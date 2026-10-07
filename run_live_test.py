import os
import requests
import time
import json
import threading
import re
import sys
import subprocess
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer

captured_otp = None

class MockResendHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        global captured_otp
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            match = re.search(r'verification code is: (\d{6})', data.get("text", ""))
            if match:
                captured_otp = match.group(1)
        except Exception as e:
            pass
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"id":"mock_id"}')
    def log_message(self, format, *args):
        pass

server = HTTPServer(('localhost', 8081), MockResendHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    global captured_otp
    session = requests.Session()
    
    # 1. Login
    print("--- 1. Login ---")
    login_data = {"employee_id": "SEC-PS-HEAD-001", "password": "password"}
    resp = session.post(f"{BASE_URL}/login", json=login_data)
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code} {resp.text}")
        return False
    token = resp.json().get("token")
    if not token:
        print("No access token returned")
        return False
    session.headers.update({"Authorization": f"Bearer {token}"})
    print("Login successful.")

    # 2. Get a case ID
    print("--- 2. Get Case ID ---")
    resp = session.get(f"{BASE_URL}/case/my")
    if resp.status_code != 200 or not resp.json():
        print(f"Failed to fetch cases: {resp.status_code} {resp.text}")
        return False
    cases = resp.json()
    case_id = cases[0].get("case_id")
    print(f"Selected Case: {case_id}")

    # 3. Elevate privilege with OTP
    print("--- 3. Elevate Privilege ---")
    captured_otp = None
    req_resp = session.post(f"{BASE_URL}/security/request-otp", json={"purpose": "document_upload", "case_id": case_id})
    if req_resp.status_code != 200:
        print(f"Elevation request failed: {req_resp.text}")
        return False
    
    time.sleep(1) # wait for OTP
    otp = captured_otp or "123456"
    ver_resp = session.post(f"{BASE_URL}/security/verify-otp", json={"purpose": "document_upload", "code": otp, "case_id": case_id})
    if ver_resp.status_code != 200:
        print(f"Elevation verification failed: {ver_resp.text}")
        return False
    print("Elevation successful.")

    # 4. Upload Document
    print("--- 4. Upload Document ---")
    test_pdf = Path("test_doc.pdf")
    test_pdf.write_bytes(b"%PDF-1.4 mock content for testing.")
    
    with open(test_pdf, "rb") as f:
        files = {"file": ("test_doc.pdf", f, "application/pdf")}
        data = {"case_id": case_id, "document_type": "forensic_report"}
        up_resp = session.post(f"{BASE_URL}/documents/upload", files=files, data=data)
    
    if up_resp.status_code != 200:
        print(f"Upload failed: {up_resp.status_code} {up_resp.text}")
        return False
    
    up_data = up_resp.json()
    doc_id = up_data.get("document_id")
    version_id = up_data.get("version_id")
    print(f"POST /documents/upload status: {up_resp.status_code}")
    print(f"document_id: {doc_id}")
    print(f"version_id: {version_id}")

    # 5. GET /documents/my
    print("--- 5. GET /documents/my ---")
    doc_resp = session.get(f"{BASE_URL}/documents/my")
    if doc_resp.status_code == 403:
         print("Requesting VIEW_FILES elevation...")
         captured_otp = None
         req_resp2 = session.post(f"{BASE_URL}/security/request-otp", json={"purpose": "VIEW_FILES", "case_id": case_id})
         time.sleep(1)
         ver_resp2 = session.post(f"{BASE_URL}/security/verify-otp", json={"purpose": "VIEW_FILES", "code": captured_otp or "123456", "case_id": case_id})
         doc_resp = session.get(f"{BASE_URL}/documents/my")

    print(f"GET /documents/my status: {doc_resp.status_code}")
    if doc_resp.status_code != 200:
         print(f"Failed to fetch my documents: {doc_resp.text}")
         return False
         
    docs = doc_resp.json().get("documents", [])
    print(f"count > 0: {len(docs) > 0}")
    
    found_doc = next((d for d in docs if d.get("document_id") == doc_id), None)
    if found_doc:
        print(f"uploaded document included: PASS")
        print(f"correct case_id: {found_doc.get('case_id') == case_id}")
        print(f"correct document_type: {found_doc.get('document_type') == 'forensic_report'}")
        print(f"real document_id: {found_doc.get('document_id')}")
        print(f"real version_id: {found_doc.get('version', {}).get('version_id')}")
    else:
        print("uploaded document included: FAIL")

    # 6. Open document / Preview
    print("--- 6. Document Preview ---")
    prev_resp = session.get(f"{BASE_URL}/documents/preview/{version_id}")
    print(f"Preview works: {prev_resp.status_code == 200}")
    
    # 7. Metadata / version history
    print("--- 7. Metadata & Version History ---")
    vh_resp = session.get(f"{BASE_URL}/documents/versions/{doc_id}")
    print(f"Version history works: {vh_resp.status_code == 200}")
    
    # 8. New Version
    print("--- 8. New Version ---")
    with open(test_pdf, "rb") as f:
        files = {"file": ("test_doc_v2.pdf", f, "application/pdf")}
        data = {"case_id": case_id, "document_type": "forensic_report", "document_id": doc_id}
        up2_resp = session.post(f"{BASE_URL}/documents/upload", files=files, data=data)
        
    print(f"v2 Upload status: {up2_resp.status_code}")
    if up2_resp.status_code == 200:
         print(f"v1 -> v2 version_id changed: {version_id != up2_resp.json().get('version_id')}")
    else:
         print(f"v2 upload failed: {up2_resp.text}")

    # cleanup
    test_pdf.unlink()
    print("DONE")
    return True

if __name__ == "__main__":
    env = os.environ.copy()
    env["RESEND_API_URL"] = "http://localhost:8081/emails"
    
    print("Starting backend...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "invite_backend:app", "--host", "127.0.0.1", "--port", "8000"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(3)
    try:
        run_test()
    finally:
        server_process.terminate()
        server_process.wait()
