import requests
import json
import time

base_url = "http://127.0.0.1:8000"
employee_id = "SEC-PS-HEAD-001"
password = "password"

def login():
    response = requests.post(f"{base_url}/login", json={"employee_id": employee_id, "password": password})
    if response.status_code == 200:
        return response.json().get("token")
    return None

token = login()
headers = {"Authorization": f"Bearer {token}"}

# Get case
resp = requests.get(f"{base_url}/case/my", headers=headers)
cases = resp.json()
case_id = cases[0].get("case_id")

# Elevate
print("Elevating privileges")
import sqlite3 # Wait, how does run_live_test.py get the OTP? It starts a server.
# Let's just do something else that generates an audit log, like accessing a case or searching.
requests.get(f"{base_url}/case/details/{case_id}", headers=headers)

# Let's see if there's an audit log now
resp = requests.get(f"{base_url}/audit/logs", headers=headers)
print(json.dumps(resp.json(), indent=2))
