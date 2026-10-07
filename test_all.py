import requests
import json
import time
import os
import threading
import re
from http.server import BaseHTTPRequestHandler, HTTPServer

captured_otp = None

class MockResendHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        global captured_otp
        print(f"[MOCK_SERVER] Received POST {self.path}")
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            match = re.search(r'verification code is: (\d{6})', data.get("text", ""))
            if match:
                captured_otp = match.group(1)
                print(f"[MOCK_SERVER] Captured OTP: {captured_otp}")
            else:
                print(f"[MOCK_SERVER] OTP not found in text: {data.get('text')}")
        except Exception as e:
            print(f"[MOCK_SERVER] Error processing request: {e}")
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"id":"mock_id"}')
    def log_message(self, format, *args):
        pass

server = HTTPServer(('localhost', 8081), MockResendHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

BASE_URL = "http://localhost:8001"

def test_flow():
    global captured_otp
    print("=== STARTING FULL SYSTEM TEST ===")
    
    # 1. Login
    print("1. Login...")
    resp = requests.post(f"{BASE_URL}/login", json={"employee_id": "SEC-PS-HEAD-001", "password": "password"})
    if resp.status_code != 200:
        print("FAIL Login:", resp.text)
        return False
    token = resp.json()["token"]
    print("User Dept:", resp.json().get("department_type"), resp.json().get("department_name"))
    headers = {"Authorization": f"Bearer {token}"}
    print("PASS Login")
    
    # 2. Get /me
    print("2. /me...")
    resp = requests.get(f"{BASE_URL}/me", headers=headers)
    if resp.status_code != 200:
        print("FAIL /me:", resp.text)
        return False
    print("PASS /me")
    
    # 3. Analytics
    print("3. Analytics...")
    resp = requests.get(f"{BASE_URL}/analytics/summary", headers=headers)
    if resp.status_code != 200:
        print("FAIL /analytics/summary:", resp.status_code, resp.text)
    else:
        print("PASS /analytics/summary")
        
    # 4. Audit logs
    print("4. Audit Logs...")
    resp = requests.get(f"{BASE_URL}/audit/logs", headers=headers)
    if resp.status_code != 200:
        print("FAIL /audit/logs:", resp.status_code, resp.text)
    else:
        print("PASS /audit/logs")
        
    # 5. Create Case
    print("5. Create Case...")
    case_payload = {
        "complainant_name": "John Doe",
        "incident_type": "Cyber Fraud",
        "incident_date": "2026-09-17",
        "location": "Online",
        "description": "Lost money via phishing"
    }
    resp = requests.post(f"{BASE_URL}/case/create", headers=headers, json=case_payload)
    if resp.status_code != 200:
        print("FAIL Case Create:", resp.text)
        return False
    
    try:
        case_id = resp.json().get("case_id") or resp.json()["case"]["case_id"]
        print(f"PASS Case Create: {case_id}")
    except KeyError:
        print("FAIL Case Create, unexpected JSON:", resp.json())
        return False
    
    # 5b. Request OTP for Case AI (MANAGE_MEMBERS)
    print("5b. OTP for MANAGE_MEMBERS...")
    resp = requests.post(f"{BASE_URL}/security/request-otp", headers=headers, json={"purpose": "MANAGE_MEMBERS", "case_id": case_id})
    if resp.status_code != 200: print("FAIL Request OTP:", resp.text); return False
    # Wait for OTP
    for _ in range(50):
        if captured_otp: break
        time.sleep(0.1)
    otp = captured_otp
    captured_otp = None
    resp = requests.post(f"{BASE_URL}/security/verify-otp", headers=headers, json={"purpose": "MANAGE_MEMBERS", "code": otp, "case_id": case_id})
    if resp.status_code != 200: print("FAIL Verify OTP:", resp.text); return False
    
    # 6. Case AI Toggle
    print("6. Case AI Toggle...")
    resp = requests.post(f"{BASE_URL}/case/ai/toggle", headers=headers, json={"case_id": case_id, "enabled": True})
    if resp.status_code != 200:
        print("FAIL Case AI Toggle:", resp.text)
    else:
        print("PASS Case AI Toggle")
        
    # 7. Request OTP
    print("7. OTP Flow...")
    resp = requests.post(f"{BASE_URL}/security/request-otp", headers=headers, json={"purpose": "document_upload", "case_id": case_id})
    if resp.status_code != 200:
        print("FAIL Request OTP:", resp.text)
        return False
        
    # Wait for OTP
    for _ in range(50):
        if captured_otp: break
        time.sleep(0.1)
    otp = captured_otp
    captured_otp = None
        
    resp = requests.post(f"{BASE_URL}/security/verify-otp", headers=headers, json={"purpose": "document_upload", "code": otp, "case_id": case_id})
    if resp.status_code != 200:
        print("FAIL Verify OTP:", resp.text)
        return False
    print("PASS OTP Flow")
    
    # 8. Upload Document v1
    print("8. Upload v1...")
    with open("test_upload.pdf", "wb") as f:
        f.write(b"Test Document Content")
        
    with open("test_upload.pdf", "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/documents/upload",
            headers=headers,
            data={"case_id": case_id, "document_type": "evidence"},
            files={"file": ("test_upload.pdf", f, "application/pdf")}
        )
    if resp.status_code != 200:
        print("FAIL Upload v1:", resp.text)
        return False
    doc_id = resp.json().get("document_id")
    print(f"PASS Upload v1: {doc_id}")
    
    # 9. Upload Document v2 (Same document_id)
    print("9. Upload v2...")
    with open("test_upload.pdf", "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/documents/upload",
            headers=headers,
            data={"case_id": case_id, "document_type": "evidence", "document_id": doc_id},
            files={"file": ("test_upload_v2.pdf", f, "application/pdf")}
        )
    if resp.status_code != 200:
        print("FAIL Upload v2:", resp.text)
    else:
        print("PASS Upload v2")
        
    # 10. Get Versions
    print("10. Check Versions...")
    print("10a. OTP for VIEW_FILES...")
    resp = requests.post(f"{BASE_URL}/security/request-otp", headers=headers, json={"purpose": "VIEW_FILES", "case_id": case_id})
    if resp.status_code != 200: print("FAIL Request OTP VIEW_FILES:", resp.text); return False
    
    # Wait for OTP
    for _ in range(50):
        if captured_otp: break
        time.sleep(0.1)
    otp = captured_otp
    captured_otp = None
    
    resp = requests.post(f"{BASE_URL}/security/verify-otp", headers=headers, json={"purpose": "VIEW_FILES", "code": otp, "case_id": case_id})
    if resp.status_code != 200: print("FAIL Verify OTP VIEW_FILES:", resp.text); return False
    
    resp = requests.get(f"{BASE_URL}/documents/versions/{doc_id}", headers=headers)
    if resp.status_code != 200:
        print("FAIL Get Versions:", resp.text)
    else:
        versions = resp.json().get("versions", [])
        print(f"PASS Get Versions (found {len(versions)})")
        if len(versions) > 0:
            version_id = versions[0]["version_id"]
            
            # 11. Extraction Endpoints
            print("11. Testing extraction endpoints...")
            resp_acc = requests.post(f"{BASE_URL}/documents/versions/{version_id}/extraction/accept", headers=headers)
            print("Accept Extraction:", resp_acc.status_code)
            
            resp_edit = requests.post(f"{BASE_URL}/documents/versions/{version_id}/extraction/edit", headers=headers, json={"text": "Edited content"})
            print("Edit Extraction:", resp_edit.status_code)
            
            resp_rep = requests.post(f"{BASE_URL}/documents/versions/{version_id}/reprocess", headers=headers)
            print("Reprocess:", resp_rep.status_code)
            
    # 12. Document Activity
    print("12. Document Activity...")
    resp = requests.get(f"{BASE_URL}/documents/{doc_id}/activity", headers=headers)
    if resp.status_code != 200:
        print("FAIL Document Activity:", resp.text)
    else:
        print("PASS Document Activity:", len(resp.json()))

    return True

if __name__ == "__main__":
    import subprocess
    import sys
    
    # Spawn dedicated test backend
    env = os.environ.copy()
    env["RESEND_API_URL"] = "http://localhost:8081/emails"
    
    print("Starting dedicated test backend on port 8001...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "invite_backend:app", "--port", "8001"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # Wait for server to be ready
    time.sleep(3)
    
    success = False
    try:
        success = test_flow()
    finally:
        print("Terminating test backend...")
        server_process.terminate()
        server_process.wait()
        
    if not success:
        sys.exit(1)
    sys.exit(0)
