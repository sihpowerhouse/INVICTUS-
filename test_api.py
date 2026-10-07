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
    
    print("Logged in, getting cases...")
    
    # 2. Get Cases
    cases_resp = requests.get(f"{BASE_URL}/case/my", headers=headers)
    cases = cases_resp.json()
    if not cases:
        print("No cases found")
        return
        
    case_id = cases[0]["case_id"]
    print("Using case:", case_id)
    
    print("Requesting OTP...")
    # 3. Request OTP
    otp_req_resp = requests.post(
        f"{BASE_URL}/auth/otp/request",
        headers=headers,
        json={"action": "UPLOAD_FILE", "context_id": case_id}
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
        f"{BASE_URL}/auth/otp/verify",
        headers=headers,
        json={"action": "UPLOAD_FILE", "code": otp, "context_id": case_id}
    )
    if otp_ver_resp.status_code != 200:
        print("OTP verify failed:", otp_ver_resp.text)
        return
        
    print("OTP verified. Uploading document...")
    
    # 6. Upload PDF
    with open("test_upload.pdf", "rb") as f:
        files = {"file": ("test_upload.pdf", f, "application/pdf")}
        data = {"case_id": case_id, "document_type": "evidence"}
        
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

