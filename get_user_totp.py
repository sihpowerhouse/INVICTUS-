from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
users = supabase.table("users").select("totp_secret").eq("employee_id", "TSFSL-0001").execute()
print("USER TOTP:", users.data)

