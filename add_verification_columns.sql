-- Run this in your Supabase SQL Editor to add the verification columns.

ALTER TABLE public.case_ai_documents 
ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_by uuid,
ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- If you get a PostgREST schema cache error during testing, run this:
NOTIFY pgrst, 'reload schema';
