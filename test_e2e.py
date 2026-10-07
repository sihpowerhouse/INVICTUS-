import requests

BASE_URL = "http://localhost:8000"

print("Starting E2E API Sweep...")
r = requests.get(f"{BASE_URL}/")
print("Root:", r.status_code)
