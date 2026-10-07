"""
LIVE TRACE: Document upload → registry retrieval end-to-end diagnostic.

This script performs the exact same sequence the frontend does:
  1. Login
  2. GET /me
  3. GET /case/my → extract real case UUIDs
  4. OTP elevation for UPLOAD_FILE
  5. POST /documents/upload with a real PDF
  6. Verify DB persistence (document + version rows)
  7. OTP elevation for VIEW_FILES
  8. GET /case/documents?case_id=<real UUID>
  9. Compare backend data with what frontend would render
  10. Diagnose root cause of "NO DOCUMENTS FOUND"

Uses a mock Resend server on port 8081 to capture OTPs.
Runs backend on port 8001 (separate from any dev server).
"""

import requests, json, time, os, sys, re, threading, hashlib, secrets
from http.server import BaseHTTPRequestHandler, HTTPServer

# ── Mock email server to capture OTPs ──────────────────────────────────

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
PASS = "✅ PASS"
FAIL = "❌ FAIL"

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

def safe(d, keys_to_hide=None):
    """Print dict without sensitive fields."""
    keys_to_hide = keys_to_hide or {"token", "password", "totp_secret", "signature", "encrypted_private_key"}
    return {k: ("***" if k in keys_to_hide else v) for k, v in d.items()}


def run_trace():
    results = {}
    print("\n" + "=" * 60)
    print("  DOCUMENT REGISTRY LIVE TRACE")
    print("=" * 60)

    # ── 1. LOGIN ─────────────────────────────────────────────────
    print("\n── 1. LOGIN ──")
    r = requests.post(f"{BASE}/login", json={"employee_id": "SEC-PS-HEAD-001", "password": "password"})
    if r.status_code != 200:
        print(f"{FAIL} Login: {r.status_code} {r.text}")
        return
    login = r.json()
    token = login["token"]
    h = {"Authorization": f"Bearer {token}"}
    print(f"{PASS} Login → dept_type={login.get('department_type')}, dept_name={login.get('department_name')}")

    # ── 2. GET /me ───────────────────────────────────────────────
    print("\n── 2. GET /me ──")
    r = requests.get(f"{BASE}/me", headers=h)
    if r.status_code != 200:
        print(f"{FAIL} /me: {r.status_code}")
        return
    me = r.json()
    print(f"{PASS} /me → user_id={me['user_id'][:8]}..., elevated={me.get('is_elevated')}, purpose={me.get('elevated_purpose')}")

    # ── 3. GET /case/my ──────────────────────────────────────────
    print("\n── 3. GET /case/my ──")
    r = requests.get(f"{BASE}/case/my", headers=h)
    if r.status_code != 200:
        print(f"{FAIL} /case/my: {r.status_code} {r.text}")
        return
    my_cases = r.json()
    print(f"{PASS} /case/my → {len(my_cases)} case(s)")
    if not my_cases:
        print(f"\n{'='*60}")
        print(f"  ROOT CAUSE: /case/my returns ZERO cases.")
        print(f"  The frontend getDocuments() calls /case/my first.")
        print(f"  If it returns [], getDocuments() returns [] immediately.")
        print(f"  → 'NO DOCUMENTS FOUND' is correct — user has no cases.")
        print(f"{'='*60}")
        results["root_cause"] = "User has zero cases in case_membership"
        return results

    # Print safe case metadata
    for i, c in enumerate(my_cases):
        case_id = c.get("case_id", "?")
        fir_id = (c.get("cases") or {}).get("fir_id", "?")
        status = (c.get("cases") or {}).get("status", "?")
        perm = c.get("permission_level", "?")
        doc_types = c.get("allowed_document_types", [])
        print(f"  Case {i+1}: id={case_id[:12]}..., fir={fir_id}, status={status}, perm={perm}, doc_types={doc_types}")

    # Use the first case
    case = my_cases[0]
    case_id = case["case_id"]
    allowed_types = set(case.get("allowed_document_types") or [])
    print(f"\n  Using case: {case_id}")
    print(f"  Allowed document types for this user: {sorted(allowed_types)}")

    # ── 4. TEST /case/documents WITHOUT elevation ────────────────
    print("\n── 4. TEST /case/documents WITHOUT elevation ──")
    r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
    print(f"  Status: {r.status_code}")
    if r.status_code == 403:
        print(f"  {PASS} 403 as expected — VIEW_FILES elevation required")
        results["pre_elevation_status"] = 403
    elif r.status_code == 200:
        data = r.json()
        doc_count = len(data.get("documents", []))
        print(f"  ⚠ 200 returned — user is already elevated! Documents: {doc_count}")
        results["pre_elevation_status"] = 200
    else:
        print(f"  ⚠ Unexpected status: {r.status_code} → {r.text[:200]}")

    # ── 5. OTP for UPLOAD_FILE ───────────────────────────────────
    print("\n── 5. OTP for UPLOAD_FILE ──")
    r = requests.post(f"{BASE}/security/request-otp", headers=h, json={"purpose": "UPLOAD_FILE", "case_id": case_id})
    if r.status_code != 200:
        print(f"{FAIL} Request OTP: {r.status_code} {r.text}")
        return
    otp = wait_otp()
    if not otp:
        print(f"{FAIL} OTP not captured")
        return
    r = requests.post(f"{BASE}/security/verify-otp", headers=h, json={"purpose": "UPLOAD_FILE", "code": otp, "case_id": case_id})
    if r.status_code != 200:
        print(f"{FAIL} Verify OTP: {r.status_code} {r.text}")
        return
    print(f"{PASS} UPLOAD_FILE elevation granted")

    # ── 6. UPLOAD DOCUMENT ───────────────────────────────────────
    print("\n── 6. POST /documents/upload ──")

    # Choose a document_type that's in allowed_types
    upload_type = None
    preferred = ["evidence", "forensic_report", "fir", "court_order", "cctv", "other"]
    for pt in preferred:
        if pt in allowed_types:
            upload_type = pt
            break
    if not upload_type:
        if allowed_types:
            upload_type = sorted(allowed_types)[0]
        else:
            print(f"{FAIL} User has NO allowed_document_types — cannot upload anything")
            results["root_cause"] = "allowed_document_types is empty in case_membership"
            return results

    print(f"  Uploading with document_type='{upload_type}' (from allowed: {sorted(allowed_types)})")

    # Create a real small PDF
    pdf_content = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"

    with open("trace_test.pdf", "wb") as f:
        f.write(pdf_content)

    with open("trace_test.pdf", "rb") as f:
        r = requests.post(
            f"{BASE}/documents/upload",
            headers=h,
            data={"case_id": case_id, "document_type": upload_type},
            files={"file": ("trace_test.pdf", f, "application/pdf")}
        )

    print(f"  HTTP Status: {r.status_code}")
    results["upload_status"] = r.status_code

    if r.status_code != 200:
        print(f"  {FAIL} Upload failed: {r.text[:300]}")
        results["root_cause"] = f"Upload failed with {r.status_code}"
        return results

    upload = r.json()
    doc_id = upload.get("document_id")
    ver_id = upload.get("version_id")
    ver_num = upload.get("version_number")
    file_hash = upload.get("file_hash")
    storage_path = upload.get("storage_path")

    print(f"  {PASS} Upload succeeded")
    print(f"  document_id:  {doc_id}")
    print(f"  version_id:   {ver_id}")
    print(f"  version_num:  {ver_num}")
    print(f"  file_hash:    {file_hash[:16]}..." if file_hash else "  file_hash: MISSING")
    print(f"  storage_path: {storage_path}" if storage_path else "  storage_path: MISSING")
    results["document_id"] = doc_id
    results["version_id"] = ver_id

    # ── 7. VERIFY DATABASE PERSISTENCE ───────────────────────────
    print("\n── 7. VERIFY DATABASE PERSISTENCE ──")
    # We can check by fetching versions (requires VIEW_FILES elevation)
    # The UPLOAD_FILE elevation should allow VIEW_FILES (backend line 331)

    r = requests.get(f"{BASE}/documents/versions/{doc_id}", headers=h)
    print(f"  GET /documents/versions/{doc_id[:8]}...: {r.status_code}")
    if r.status_code == 200:
        vdata = r.json()
        doc_row = vdata.get("document")
        versions = vdata.get("versions", [])
        print(f"  {PASS} Document row exists")
        print(f"    case_id:       {doc_row.get('case_id', '?')[:12]}...")
        print(f"    document_type: {doc_row.get('document_type', '?')}")
        print(f"    Versions:      {len(versions)}")
        for v in versions:
            print(f"      v{v.get('version_number')}: id={v.get('version_id','?')[:12]}..., hash={str(v.get('file_hash','?'))[:12]}...")
        results["db_persistence"] = "PASS"
        results["db_doc_type"] = doc_row.get("document_type")
        results["db_case_id"] = doc_row.get("case_id")
    else:
        print(f"  {FAIL} Cannot verify DB: {r.text[:200]}")
        results["db_persistence"] = "FAIL"

    # ── 8. VERIFY STORAGE OBJECT ─────────────────────────────────
    print("\n── 8. VERIFY STORAGE OBJECT ──")
    if storage_path:
        print(f"  {PASS} storage_path returned: {storage_path}")
        results["storage_object"] = "PASS"
    else:
        print(f"  {FAIL} No storage_path in upload response")
        results["storage_object"] = "FAIL"

    # ── 9. OTP for VIEW_FILES ────────────────────────────────────
    print("\n── 9. OTP for VIEW_FILES (to test registry API) ──")
    # First check if UPLOAD_FILE elevation works for VIEW_FILES
    r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
    print(f"  GET /case/documents (with UPLOAD_FILE elevation): {r.status_code}")

    if r.status_code == 403:
        print("  UPLOAD_FILE elevation did NOT satisfy VIEW_FILES — requesting separate OTP")
        r = requests.post(f"{BASE}/security/request-otp", headers=h, json={"purpose": "VIEW_FILES", "case_id": case_id})
        if r.status_code != 200:
            print(f"  {FAIL} Request VIEW_FILES OTP: {r.text}")
            return results
        otp = wait_otp()
        if not otp:
            print(f"  {FAIL} VIEW_FILES OTP not captured")
            return results
        r = requests.post(f"{BASE}/security/verify-otp", headers=h, json={"purpose": "VIEW_FILES", "code": otp, "case_id": case_id})
        if r.status_code != 200:
            print(f"  {FAIL} Verify VIEW_FILES OTP: {r.text}")
            return results
        print(f"  {PASS} VIEW_FILES elevation granted")
        # Retry
        r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
        print(f"  GET /case/documents (after VIEW_FILES OTP): {r.status_code}")

    # ── 10. EXAMINE /case/documents RESPONSE ─────────────────────
    print("\n── 10. EXAMINE /case/documents RESPONSE ──")
    results["case_documents_status"] = r.status_code

    if r.status_code == 200:
        cd = r.json()
        docs = cd.get("documents", [])
        perm = cd.get("my_permission_level")
        allowed = cd.get("my_allowed_document_types", [])
        warnings = cd.get("integrity_warning_count", 0)
        print(f"  {PASS} Status 200")
        print(f"  my_permission_level:       {perm}")
        print(f"  my_allowed_document_types: {allowed}")
        print(f"  documents returned:        {len(docs)}")
        print(f"  integrity_warnings:        {warnings}")
        results["documents_returned"] = len(docs)

        if len(docs) == 0:
            print(f"\n  ⚠ ZERO documents returned despite successful upload!")
            print(f"  Checking if document_type '{upload_type}' is in allowed_document_types: {allowed}")
            if upload_type not in allowed:
                print(f"  ❌ ROOT CAUSE FOUND: uploaded document_type '{upload_type}' is NOT in")
                print(f"     the user's allowed_document_types {allowed}")
                print(f"     The backend filters documents by allowed_document_types.")
                print(f"     The document EXISTS in the DB but is INVISIBLE to this user.")
                results["root_cause"] = f"document_type '{upload_type}' not in allowed_document_types {allowed}"
            else:
                print(f"  document_type IS in allowed list — checking DB directly...")
                results["root_cause"] = "Backend returns 0 docs despite type being allowed — investigate SQL query"
        else:
            found_our_doc = any(d.get("document_id") == doc_id for d in docs)
            print(f"  Our uploaded document in list: {found_our_doc}")
            for d in docs:
                print(f"    doc_id={d.get('document_id','?')[:12]}..., type={d.get('document_type')}, filename={d.get('filename')}")

            # ── 11. SIMULATE FRONTEND MAPPING ────────────────────────
            print("\n── 11. SIMULATE FRONTEND MAPPING ──")
            type_map = {
                "fir": "FIR", "evidence": "EVIDENCE_RECORD",
                "forensic_report": "FORENSIC_REPORT", "postmortem_report": "FORENSIC_REPORT",
                "witness_statement": "WITNESS_STATEMENT", "suspect_interview": "WITNESS_STATEMENT",
                "medical_report": "FORENSIC_REPORT", "charge_sheet": "CHARGE_SHEET",
                "court_order": "COURT_FILING", "judgment": "COURT_FILING",
                "cctv": "EVIDENCE_RECORD", "police_report": "POLICE_REPORT", "other": "OTHER",
            }
            mapped_docs = []
            for d in docs:
                raw_type = (d.get("document_type") or "").lower()
                mapped_type = type_map.get(raw_type, "OTHER")
                mapped = {
                    "id": d.get("document_id"),
                    "caseId": d.get("case_id"),
                    "name": d.get("filename", "Document"),
                    "type": mapped_type,
                    "status": "UPLOADED",
                }
                mapped_docs.append(mapped)
                print(f"    Mapped: id={mapped['id'][:12]}..., type={mapped_type}, name={mapped['name']}")

            if mapped_docs:
                # Check if frontend filter would pass
                valid = [m for m in mapped_docs if m["id"]]
                print(f"  Documents with valid id: {len(valid)}/{len(mapped_docs)}")
                results["frontend_mapping"] = f"{len(valid)} valid docs"
            else:
                results["frontend_mapping"] = "EMPTY"

    elif r.status_code == 403:
        print(f"  {FAIL} 403 — user cannot view case documents")
        results["documents_returned"] = "BLOCKED (403)"
        results["root_cause"] = "VIEW_FILES elevation not working"
    else:
        print(f"  {FAIL} Unexpected: {r.status_code} → {r.text[:200]}")

    # ── 12. TEST ALL CASES (like frontend does) ──────────────────
    print("\n── 12. TEST ALL CASES (simulating frontend getDocuments) ──")
    total_docs = 0
    elevation_blocks = 0
    for c in my_cases:
        cid = c["case_id"]
        r = requests.get(f"{BASE}/case/documents?case_id={cid}", headers=h)
        if r.status_code == 200:
            n = len(r.json().get("documents", []))
            total_docs += n
            print(f"  Case {cid[:12]}...: {r.status_code} → {n} doc(s)")
        elif r.status_code == 403:
            elevation_blocks += 1
            print(f"  Case {cid[:12]}...: 403 (elevation needed)")
        else:
            print(f"  Case {cid[:12]}...: {r.status_code}")

    print(f"\n  TOTAL documents across all cases: {total_docs}")
    print(f"  Cases blocked by elevation:       {elevation_blocks}")
    results["total_docs_all_cases"] = total_docs

    if total_docs == 0 and elevation_blocks == len(my_cases):
        print("  → Frontend would throw ElevationRequiredError → show OTP modal")
    elif total_docs == 0 and elevation_blocks == 0:
        print("  → Frontend would show 'NO DOCUMENTS FOUND' (genuinely empty)")
    elif total_docs > 0:
        print(f"  → Frontend should display {total_docs} document(s)")

    # ── 13. UPLOAD v2 ────────────────────────────────────────────
    print("\n── 13. UPLOAD v2 (new version of same document) ──")
    pdf_v2 = pdf_content + b"\n% Version 2 marker"
    with open("trace_test_v2.pdf", "wb") as f:
        f.write(pdf_v2)
    with open("trace_test_v2.pdf", "rb") as f:
        r = requests.post(
            f"{BASE}/documents/upload",
            headers=h,
            data={"case_id": case_id, "document_type": upload_type, "document_id": doc_id},
            files={"file": ("trace_test_v2.pdf", f, "application/pdf")}
        )
    print(f"  Upload v2 status: {r.status_code}")
    if r.status_code == 200:
        v2 = r.json()
        print(f"  {PASS} v2 uploaded: version_number={v2.get('version_number')}, version_id={v2.get('version_id','?')[:12]}...")
        results["v2_upload"] = "PASS"
    else:
        print(f"  {FAIL} v2 upload failed: {r.text[:200]}")
        results["v2_upload"] = "FAIL"

    # ── 14. VERIFY REGISTRY AFTER v2 ─────────────────────────────
    print("\n── 14. VERIFY REGISTRY AFTER v2 ──")
    r = requests.get(f"{BASE}/case/documents?case_id={case_id}", headers=h)
    if r.status_code == 200:
        docs = r.json().get("documents", [])
        found = [d for d in docs if d.get("document_id") == doc_id]
        print(f"  Documents in case: {len(docs)}")
        if found:
            d = found[0]
            ver = d.get("version", {})
            print(f"  {PASS} Our document found: version={ver.get('version_number')}, version_id={ver.get('version_id','?')[:12]}...")
        else:
            print(f"  {FAIL} Our document NOT found in registry after v2!")

    # ── FINAL REPORT ─────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  FINAL TRACE REPORT")
    print("=" * 60)
    print(f"  1.  Upload HTTP result:          {results.get('upload_status')}")
    print(f"  2.  document_id:                 {results.get('document_id','?')}")
    print(f"  3.  version_id:                  {results.get('version_id','?')}")
    print(f"  4.  Database persistence:         {results.get('db_persistence','?')}")
    print(f"  5.  Storage object:               {results.get('storage_object','?')}")
    print(f"  6.  GET /case/documents status:   {results.get('case_documents_status','?')}")
    print(f"  7.  Documents returned count:     {results.get('documents_returned','?')}")
    print(f"  8.  Total docs all cases:         {results.get('total_docs_all_cases','?')}")
    print(f"  9.  Frontend mapping:             {results.get('frontend_mapping','?')}")
    print(f"  10. v2 upload:                    {results.get('v2_upload','?')}")
    print(f"  11. Root cause:                   {results.get('root_cause','See analysis above')}")
    print("=" * 60)

    # Cleanup
    for f in ["trace_test.pdf", "trace_test_v2.pdf"]:
        try: os.remove(f)
        except: pass

    return results


if __name__ == "__main__":
    import subprocess
    env = os.environ.copy()
    env["RESEND_API_URL"] = "http://localhost:8081/emails"

    print("Starting dedicated test backend on port 8001...")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "invite_backend:app", "--port", "8001"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    time.sleep(4)

    try:
        run_trace()
    finally:
        print("\nTerminating test backend...")
        proc.terminate()
        proc.wait()
