-- Migration to unify policy status to 'Cancelled'
-- This updates existing records and ensures 'Cancelled' is available in the enum

-- 1. Add 'Cancelled' to the enum if it doesn't exist (for the clients table)
DO $$ BEGIN
    ALTER TYPE public.policy_status ADD VALUE 'Cancelled';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update status in policies table (TEXT field with CHECK constraint)
UPDATE public.policies SET status = 'Cancelled' WHERE status = 'Inactive';

-- 4. Ensure all products have an updated_at value for correct sorting
UPDATE public.products SET updated_at = created_at WHERE updated_at IS NULL;
