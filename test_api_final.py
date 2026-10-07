import requests
import json
import time

BASE_URL = "http://localhost:8000"

def main():
    print("Logging in...")
    # 1. Login
    login_resp = requests.post(
        f"{BASE_URL}/login",
        json={"employee_id": "TSFSL-0001", "password": "password"}
    )
    if login_resp.status_code != 200:
        print("Login failed:", login_resp.text)
        return
        
    data = login_resp.json()
    token = data["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Creating case...")
    # 2. Create case
    case_resp = requests.post(
        f"{BASE_URL}/case/create",
        headers=headers,
        json={
            "complainant_name": "Test User",
            "incident_type": "Theft",
            "incident_date": "2026-09-17",
            "location": "Cyber Hub",
            "description": "Test case for upload"
        }
    )
    if case_resp.status_code != 200:
        print("Case creation failed:", case_resp.text)
        return
    
    case_data = case_resp.json()
    CASE_ID = case_data["case"]["case_id"]
    print("Using new case:", CASE_ID)
    
    print("Requesting OTP...")
    # 3. Request OTP
    otp_req_resp = requests.post(
        f"{BASE_URL}/security/request-otp",
        headers=headers,
        json={"purpose": "document_upload", "case_id": CASE_ID}
    )
    if otp_req_resp.status_code != 200:
        print("OTP request failed:", otp_req_resp.text)
        return
        
    time.sleep(2)
    
    # 4. Read OTP
    with open("latest_otp.txt", "r") as f:
        otp = f.read().strip()
        
    print(f"Read OTP: {otp}, verifying...")
    
    # 5. Verify OTP
    otp_ver_resp = requests.post(
        f"{BASE_URL}/security/verify-otp",
        headers=headers,
        json={"purpose": "document_upload", "code": otp, "case_id": CASE_ID}
    )
    if otp_ver_resp.status_code != 200:
        print("OTP verify failed:", otp_ver_resp.text)
        return
        
    print("OTP verified. Uploading document...")
    
    # 6. Upload PDF
    with open("test_upload.pdf", "rb") as f:
        files = {"file": ("test_upload.pdf", f, "application/pdf")}
        data = {"case_id": CASE_ID, "document_type": "evidence"}
        
        upload_resp = requests.post(
            f"{BASE_URL}/documents/upload",
            headers=headers,
            data=data,
            files=files
        )
        
    if upload_resp.status_code != 200:
        print("Upload failed:", upload_resp.status_code, upload_resp.text)
        return
        
    upload_data = upload_resp.json()
    print("Upload successful:", upload_data)
    
if __name__ == "__main__":
    main()

