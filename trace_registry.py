"""
Targeted trace: test the exact getDocuments() flow that the frontend uses.

1. Login
2. GET /case/my
3. OTP for UPLOAD_FILE
4. Upload to first case
5. GET /case/documents for that case (should work via UPLOAD_FILE->VIEW_FILES bridge)
6. Check the exact response shape
7. Check how many cases have documents
"""

import requests, json, time, os, sys, re, threading
from http.server import BaseHTTPRequestHandler, HTTPServer

captured_otp = None

class MockResendHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        global captured_otp
        try:
            cl = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(cl)) if cl else {}
            match = re.search(r'verification code is: (\d{6})', data.get("text", ""))
            if match:
                captured_otp = match.group(1)
                print(f"  [OTP CAPTURED: {captured_otp}]")
        except Exception:
            pass
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"id":"mock_id"}')
    def log_message(self, *a): pass

server = HTTPServer(('localhost', 8081), MockResendHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

BASE = "http://localhost:8001"

def wait_otp(timeout=10):
    global captured_otp
    captured_otp = None
    for _ in range(int(timeout / 0.1)):
        if captured_otp:
            code = captured_otp
            captured_otp = None
            return code
        time.sleep(0.1)
    return None

def do_otp(headers, purpose, case_id=""):
    global captured_otp
    captured_otp = None  # Clear BEFORE making the request
    r = requests.post(f"{BASE}/security/request-otp", headers=headers, json={"purpose": purpose, "case_id": case_id})
    if r.status_code != 200:
        print(f"  FAIL request-otp({purpose}): {r.status_code} {r.text[:200]}")
        return False
    # The mock handler may have already captured the OTP during the request
    code = captured_otp
    if not code:
        code = wait_otp()
    else:
        captured_otp = None
    if not code:
        print(f"  FAIL: OTP not captured for {purpose}")
        return False
    r = requests.post(f"{BASE}/security/verify-otp", headers=headers, json={"purpose": purpose, "code": code, "case_id": case_id})
    if r.status_code != 200:
        print(f"  FAIL verify-otp({purpose}): {r.status_code} {r.text[:200]}")
        return False
    print(f"  OTP verified for {purpose}")
    return True

def run():
    print("=" * 60)
    print("TARGETED DOCUMENT REGISTRY TRACE")
    print("=" * 60)

    # Login
    r = requests.post(f"{BASE}/login", json={"employee_id": "SEC-PS-HEAD-001", "password": "password"})
    assert r.status_code == 200, f"Login failed: {r.text}"
    token = r.json()["token"]
    h = {"Authorization": f"Bearer {token}"}
    print(f"1. Login OK")

    # Get cases
    r = requests.get(f"{BASE}/case/my", headers=h)
    assert r.status_code == 200
    cases = r.json()
    print(f"2. /case/my: {len(cases)} cases")

    if not cases:
        print("ROOT CAUSE: No cases exist for this user")
        return

    # Create a FRESH case + upload
    print("3. Creating fresh test case...")
    r = requests.post(f"{BASE}/case/create", headers=h, json={
        "complainant_name": "Trace Test",
        "incident_type": "Document Registry Trace",
        "incident_date": "2026-09-24",
        "location": "Trace",
        "description": "Trace document registry flow"
    })
    assert r.status_code == 200, f"Case create failed: {r.text}"
    try:
        case_id = r.json().get("case_id") or r.json()["case"]["case_id"]
    except:
        print(f"  Case response: {r.json()}")
        return
    print(f"   Case created: {case_id}")

    # Elevate for upload
    print("4. OTP for UPLOAD_FILE...")
    if not do_otp(h, "UPLOAD_FILE", case_id):
        return

    # Upload a document
    print("5. Uploading test document...")
    pdf = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
    r = requests.post(
        f"{BASE}/documents/upload", headers=h,
        data={"case_id": case_id, "document_type": "evidence"},
        files={"file": ("trace.pdf", pdf, "application/pdf")}
    )
    assert r.status_code == 200, f"Upload failed: {r.text}"
    up = r.json()
    doc_id = up["document_id"]
    ver_id = up["version_id"]
    print(f"   Upload OK: doc={doc_id}, ver={ver_id}, v{up.get('version_number')}")

    # TEST A: /case/documents with UPLOAD_FILE elevation (should work via bridge)
    print("\n6. GET /case/documents (with UPLOAD_FILE elevation)...")
    r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        docs = data.get("documents", [])
        print(f"   Documents returned: {len(docs)}")
        for d in docs:
            print(f"     doc_id={d.get('document_id')}, type={d.get('document_type')}, filename={d.get('filename')}")
        if not docs:
            print("   WARNING: 0 documents returned!")
            print(f"   my_allowed_document_types: {data.get('my_allowed_document_types')}")
            print(f"   my_permission_level: {data.get('my_permission_level')}")
    elif r.status_code == 403:
        print("   403! UPLOAD_FILE->VIEW_FILES bridge NOT working")
        print(f"   Response: {r.text[:200]}")

    # TEST B: Elevate with VIEW_FILES and retry
    print("\n7. OTP for VIEW_FILES...")
    if not do_otp(h, "VIEW_FILES", case_id):
        return

    print("8. GET /case/documents (with VIEW_FILES elevation)...")
    r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        docs = data.get("documents", [])
        print(f"   Documents: {len(docs)}")
        print(f"   my_permission: {data.get('my_permission_level')}")
        print(f"   my_allowed_types: {data.get('my_allowed_document_types')}")
        for d in docs:
            print(f"     doc_id={d.get('document_id')[:12]}...")
            print(f"     type={d.get('document_type')}")
            print(f"     filename={d.get('filename')}")
            print(f"     version={d.get('version', {})}")
            print(f"     integrity={d.get('integrity', {}).get('valid')}")

        # Check our specific document
        found = any(d.get("document_id") == doc_id for d in docs)
        print(f"\n   Our uploaded document found: {found}")
        if not found and docs:
            print("   MISMATCH: documents exist but ours is missing")
    else:
        print(f"   FAIL: {r.text[:200]}")

    # TEST C: Simulate the frontend getDocuments() loop
    print(f"\n9. Simulating frontend getDocuments() for ALL {len(cases)+1} cases...")
    # Re-fetch cases to include the new one
    r = requests.get(f"{BASE}/case/my", headers=h)
    all_cases = r.json()
    print(f"   Total cases now: {len(all_cases)}")

    total_docs = 0
    cases_with_docs = 0
    errors_403 = 0
    errors_other = 0

    for c in all_cases:
        cid = c["case_id"]
        r = requests.get(f"{BASE}/case/documents?case_id={cid}", headers=h)
        if r.status_code == 200:
            n = len(r.json().get("documents", []))
            total_docs += n
            if n > 0:
                cases_with_docs += 1
        elif r.status_code == 403:
            errors_403 += 1
        else:
            errors_other += 1

    print(f"   Results across all cases:")
    print(f"     Total documents:     {total_docs}")
    print(f"     Cases with docs:     {cases_with_docs}")
    print(f"     Cases with 403:      {errors_403}")
    print(f"     Cases with errors:   {errors_other}")

    if errors_403 > 0 and total_docs == 0:
        print("\n   ROOT CAUSE: Some cases return 403 (elevation expired or purpose mismatch)")
        print("   Frontend would throw ElevationRequiredError IF all cases 403")
        print("   If some 403 + some 200 with 0 docs -> shows 'NO DOCUMENTS FOUND'")
    elif total_docs == 0:
        print("\n   ROOT CAUSE: All cases genuinely have 0 documents in DB")
    else:
        print(f"\n   Frontend should show {total_docs} documents")

    print("\n" + "=" * 60)
    print("TRACE COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    import subprocess
    env = os.environ.copy()
    env["RESEND_API_URL"] = "http://localhost:8081/emails"

    print("Starting test backend on port 8001...")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "invite_backend:app", "--port", "8001"],
        env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    time.sleep(4)

    try:
        run()
    finally:
        print("\nShutting down test backend...")
        proc.terminate()
        proc.wait()
