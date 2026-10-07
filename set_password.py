import bcrypt
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
pwd = bcrypt.hashpw(b"password", bcrypt.gensalt()).decode()
supabase.table("users").update({"password_hash": pwd}).eq("employee_id", "TSFSL-0001").execute()
supabase.table("users").update({"password_hash": pwd}).eq("employee_id", "SEC-PS-HEAD-001").execute()
print("Password updated for TSFSL-0001 and SEC-PS-HEAD-001")

