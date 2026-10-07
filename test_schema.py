import requests
import json

base_url = "http://127.0.0.1:8000"
employee_id = "SEC-PS-HEAD-001"
password = "password"

def login():
    resp = requests.post(f"{base_url}/login", json={"employee_id": employee_id, "password": password})
    if resp.status_code == 200:
        return resp.json().get("token")
    return None

token = login()
if not token:
    print("Login Failed")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

print("=== /analytics/summary ===")
res_ana = requests.get(f"{base_url}/analytics/summary", headers=headers)
print(f"HTTP Status: {res_ana.status_code}")
if res_ana.status_code == 200:
    print(json.dumps(res_ana.json(), indent=2))
else:
    print(res_ana.text)

print("\n=== /audit/logs ===")
res_aud = requests.get(f"{base_url}/audit/logs", headers=headers)
print(f"HTTP Status: {res_aud.status_code}")
if res_aud.status_code == 200:
    print(json.dumps(res_aud.json(), indent=2))
else:
    print(res_aud.text)

print("\n=== /case/my ===")
res_case = requests.get(f"{base_url}/case/my", headers=headers)
print(f"HTTP Status: {res_case.status_code}")
if res_case.status_code == 200:
    cases = res_case.json()
    if len(cases) > 0:
        print(f"Found {len(cases)} cases, keys: {list(cases[0].keys())}")
        case_id = cases[0].get("case_id")
        # Trigger an audit event by reading case details
        print(f"Triggering read on case {case_id}")
        res_read = requests.get(f"{base_url}/case/details/{case_id}", headers=headers)
        
        # Check audit logs again to see if an event appeared
        print("\n=== /audit/logs (after read) ===")
        res_aud2 = requests.get(f"{base_url}/audit/logs", headers=headers)
        print(f"HTTP Status: {res_aud2.status_code}")
        if res_aud2.status_code == 200:
            print(json.dumps(res_aud2.json(), indent=2))
    else:
        print("No cases found")
