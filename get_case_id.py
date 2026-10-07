import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

result = supabase.table("cases").select("*").limit(5).execute()
for case in result.data:
    print("Found case:", case["case_id"], case["fir_id"])

