-- INVICTUS Migration: add per-document AI privacy control
-- ALREADY APPLIED via psycopg2 on 2026-09-26.
-- Kept here as a reference for Supabase SQL Editor if needed.

-- Add column (safe, idempotent)
ALTER TABLE public.documents
    ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Back-fill any pre-existing rows
UPDATE public.documents
    SET ai_enabled = FALSE
    WHERE ai_enabled IS NULL;

-- Verify
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'documents'
  AND column_name  = 'ai_enabled';
