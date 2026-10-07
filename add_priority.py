
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
conn = psycopg2.connect(os.getenv('SUPABASE_DB_URL'))
conn.autocommit = True
cur = conn.cursor()
cur.execute('ALTER TABLE cases ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT ''MEDIUM'';')
print('Added priority column successfully.')

