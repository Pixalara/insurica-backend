-- ============================================
-- Row Level Security (RLS) Policies
-- Ensures agents can only access their own data
-- ============================================

-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Agents can view own customers" ON customers;
DROP POLICY IF EXISTS "Agents can insert own customers" ON customers;
DROP POLICY IF EXISTS "Agents can update own customers" ON customers;
DROP POLICY IF EXISTS "Agents can delete own customers" ON customers;

-- Agents can only view their own customers
CREATE POLICY "Agents can view own customers" ON customers
  FOR SELECT USING (agent_id = auth.uid());

-- Agents can insert their own customers
CREATE POLICY "Agents can insert own customers" ON customers
  FOR INSERT WITH CHECK (agent_id = auth.uid());

-- Agents can update their own customers  
CREATE POLICY "Agents can update own customers" ON customers
  FOR UPDATE USING (agent_id = auth.uid());

-- Agents can delete their own customers
CREATE POLICY "Agents can delete own customers" ON customers
  FOR DELETE USING (agent_id = auth.uid());

-- ============================================
-- Policies table RLS
-- ============================================

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Agents can view own policies" ON policies;
DROP POLICY IF EXISTS "Agents can insert own policies" ON policies;
DROP POLICY IF EXISTS "Agents can update own policies" ON policies;
DROP POLICY IF EXISTS "Agents can delete own policies" ON policies;

-- Agents can only access policies for their customers
CREATE POLICY "Agents can view own policies" ON policies
  FOR SELECT USING (
    customer_id IN (SELECT customer_id FROM customers WHERE agent_id = auth.uid())
  );

CREATE POLICY "Agents can insert own policies" ON policies
  FOR INSERT WITH CHECK (
    customer_id IN (SELECT customer_id FROM customers WHERE agent_id = auth.uid())
  );

CREATE POLICY "Agents can update own policies" ON policies
  FOR UPDATE USING (
    customer_id IN (SELECT customer_id FROM customers WHERE agent_id = auth.uid())
  );

CREATE POLICY "Agents can delete own policies" ON policies
  FOR DELETE USING (
    customer_id IN (SELECT customer_id FROM customers WHERE agent_id = auth.uid())
  );

-- ============================================
-- Leads table RLS - SKIPPED
-- Leads already have RLS configured with open access for authenticated users
-- See: 20260131100000_create_leads_table.sql
-- ============================================

-- ============================================
-- Audit Logs Table
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- RLS for audit logs (agents can only view their own)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON audit_logs;

CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- Any authenticated user can insert audit logs
CREATE POLICY "Authenticated can insert audit logs" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- Performance Indexes
-- ============================================

-- Index for faster renewal queries
CREATE INDEX IF NOT EXISTS idx_policies_end_date ON policies(end_date);

-- Index for customer lookup by phone
CREATE INDEX IF NOT EXISTS idx_customers_agent_phone ON customers(agent_id, mobile_number);

-- Index for policy status filtering
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
