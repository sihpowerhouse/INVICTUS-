import asyncio
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

client = create_client(SUPABASE_URL, SUPABASE_KEY)
path = "test/file2.txt"
data = b"Hello, World!"
try:
    res = client.storage.from_("documents").upload(path, data, {"content-type": "text/plain", "upsert": False})
    print("SUCCESS", res)
except Exception as e:
    print("ERROR", repr(e))
    if hasattr(e, "details"):
        print("DETAILS", e.details)

