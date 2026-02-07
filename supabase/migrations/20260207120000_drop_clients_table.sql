-- ==============================================
-- INSURICA CRM - Drop Clients Table Migration
-- This migration removes the old clients table
-- after refactoring to customers + policies schema
-- ==============================================

-- 1. Drop RLS policies on clients table
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

-- 2. Drop indexes on clients table
DROP INDEX IF EXISTS idx_clients_policy_number;
DROP INDEX IF EXISTS idx_clients_name;
DROP INDEX IF EXISTS idx_clients_email;
DROP INDEX IF EXISTS idx_clients_phone;
DROP INDEX IF EXISTS idx_clients_company_id;
DROP INDEX IF EXISTS idx_clients_status;
DROP INDEX IF EXISTS idx_clients_agent_id;

-- 3. Drop the clients table
DROP TABLE IF EXISTS public.clients;

-- ==============================================
-- VERIFICATION
-- ==============================================
-- After running this migration, verify:
--   ✓ clients table no longer exists
--   ✓ customers table exists (from 20260205_universal_customer_id.sql)
--   ✓ policies table exists (from 20260205_universal_customer_id.sql)
