import requests
import os

token = ""

res = requests.post("http://127.0.0.1:8000/documents/upload", files={
    "file": ("test.txt", b"Hello", "text/plain")
}, data={
    "case_id": "test",
    "document_type": "other"
})
print(res.status_code, res.text)

