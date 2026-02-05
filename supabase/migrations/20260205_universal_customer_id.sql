-- ==============================================
-- INSURICA CRM - Universal Customer ID Schema
-- Safe migration (handles existing tables)
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS TABLE (Universal Customer ID - Single Source of Truth)
-- Note: Uses IF NOT EXISTS to avoid errors on existing tables
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT,
    dob DATE,
    address TEXT,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_customer_mobile_agent'
    ) THEN
        ALTER TABLE public.customers 
        ADD CONSTRAINT unique_customer_mobile_agent 
        UNIQUE (mobile_number, agent_id);
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers(mobile_number);
CREATE INDEX IF NOT EXISTS idx_customers_agent ON public.customers(agent_id);

-- 2. POLICIES TABLE (linked by customer_id)
CREATE TABLE IF NOT EXISTS public.policies (
    policy_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(customer_id) ON DELETE RESTRICT,
    policy_number TEXT,
    product TEXT,
    insurance_company TEXT NOT NULL,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('General', 'Health', 'Life')),
    sum_insured NUMERIC,
    start_date DATE,
    end_date DATE,
    premium NUMERIC,
    claim_status TEXT CHECK (claim_status IN ('open', 'closed', NULL)),
    claim_settled_amount NUMERIC,
    remarks TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_policies_customer ON public.policies(customer_id);
CREATE INDEX IF NOT EXISTS idx_policies_type ON public.policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_policies_status ON public.policies(status);

-- 3. PRODUCTS CATALOGUE TABLE
CREATE TABLE IF NOT EXISTS public.products_catalogue (
    product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('General', 'Health', 'Life')),
    insurance_company TEXT NOT NULL,
    pdf_url TEXT,
    pdf_filename TEXT,
    uploaded_by_agent_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_catalogue_type ON public.products_catalogue(product_type);
CREATE INDEX IF NOT EXISTS idx_products_catalogue_company ON public.products_catalogue(insurance_company);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_catalogue ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS RLS Policies
DROP POLICY IF EXISTS "Allow authenticated read customers" ON public.customers;
CREATE POLICY "Allow authenticated read customers" ON public.customers
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert customers" ON public.customers;
CREATE POLICY "Allow authenticated insert customers" ON public.customers
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update customers" ON public.customers;
CREATE POLICY "Allow authenticated update customers" ON public.customers
    FOR UPDATE TO authenticated USING (true);

-- POLICIES RLS Policies
DROP POLICY IF EXISTS "Allow authenticated read policies" ON public.policies;
CREATE POLICY "Allow authenticated read policies" ON public.policies
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert policies" ON public.policies;
CREATE POLICY "Allow authenticated insert policies" ON public.policies
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update policies" ON public.policies;
CREATE POLICY "Allow authenticated update policies" ON public.policies
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete policies" ON public.policies;
CREATE POLICY "Allow authenticated delete policies" ON public.policies
    FOR DELETE TO authenticated USING (true);

-- PRODUCTS CATALOGUE RLS Policies
DROP POLICY IF EXISTS "Allow authenticated read products_catalogue" ON public.products_catalogue;
CREATE POLICY "Allow authenticated read products_catalogue" ON public.products_catalogue
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert products_catalogue" ON public.products_catalogue;
CREATE POLICY "Allow authenticated insert products_catalogue" ON public.products_catalogue
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update products_catalogue" ON public.products_catalogue;
CREATE POLICY "Allow authenticated update products_catalogue" ON public.products_catalogue
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete products_catalogue" ON public.products_catalogue;
CREATE POLICY "Allow authenticated delete products_catalogue" ON public.products_catalogue
    FOR DELETE TO authenticated USING (true);

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================
-- If this runs without errors, your schema is ready!
-- Tables created/verified:
--   ✓ customers (Universal Customer ID)
--   ✓ policies (linked by customer_id)
--   ✓ products_catalogue (for PDF uploads)
