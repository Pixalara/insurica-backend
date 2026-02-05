-- ==============================================
-- PRODUCTS TABLE (for Product Catalogue display)
-- Run this in Supabase SQL Editor to fix the error
-- ==============================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('General', 'Health', 'Life')),
    insurer TEXT NOT NULL,
    coverage_amount NUMERIC,
    premium_range_min NUMERIC,
    premium_range_max NUMERIC,
    features TEXT[],
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    pdf_url TEXT,
    pdf_filename TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_insurer ON public.products(insurer);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow authenticated read products" ON public.products;
CREATE POLICY "Allow authenticated read products" ON public.products
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert products" ON public.products;
CREATE POLICY "Allow authenticated insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update products" ON public.products;
CREATE POLICY "Allow authenticated update products" ON public.products
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete products" ON public.products;
CREATE POLICY "Allow authenticated delete products" ON public.products
    FOR DELETE TO authenticated USING (true);

-- ==============================================
-- ADD SAMPLE DATA
-- ==============================================

INSERT INTO public.products (name, category, insurer, coverage_amount, premium_range_min, premium_range_max, features, description, status) VALUES
    ('Comprehensive Motor Insurance', 'General', 'HDFC ERGO', 500000, 8000, 15000, ARRAY['Zero Depreciation', 'Roadside Assistance', 'NCB Protection'], 'Full coverage for your vehicle against accidents, theft, and third-party liability.', 'Active'),
    ('Family Health Insurance', 'Health', 'Star Health', 1000000, 15000, 25000, ARRAY['Cashless Treatment', 'Pre-existing Disease Cover', 'Annual Health Checkup'], 'Comprehensive health coverage for your entire family under one policy.', 'Active'),
    ('Term Life Insurance', 'Life', 'HDFC Life', 5000000, 10000, 20000, ARRAY['Life Cover', 'Accidental Death Benefit', 'Critical Illness Cover'], 'Pure life insurance with high coverage at affordable premiums.', 'Active'),
    ('Two-Wheeler Insurance', 'General', 'ICICI Lombard', 100000, 2000, 5000, ARRAY['Third Party Cover', 'Own Damage Cover', 'Personal Accident Cover'], 'Protect your bike from accidents and theft.', 'Active'),
    ('Senior Citizen Health Plan', 'Health', 'Star Health', 500000, 25000, 45000, ARRAY['No Pre-medical Checkup', 'Day Care Procedures', 'Domiciliary Treatment'], 'Special health plan designed for senior citizens aged 60+.', 'Active'),
    ('Whole Life Insurance', 'Life', 'LIC', 2500000, 30000, 50000, ARRAY['Lifelong Protection', 'Bonus Accumulation', 'Loan Facility'], 'Coverage for your entire life with savings component.', 'Active'),
    ('Home Insurance', 'General', 'Bajaj Allianz', 2000000, 5000, 12000, ARRAY['Fire Cover', 'Burglary Protection', 'Natural Calamity Cover'], 'Protect your home and belongings from unforeseen events.', 'Active'),
    ('Critical Illness Cover', 'Health', 'Max Bupa', 1500000, 12000, 22000, ARRAY['Lump Sum Payout', 'Cancer Cover', 'Heart Disease Cover'], 'Financial protection against major critical illnesses.', 'Active')
ON CONFLICT DO NOTHING;

-- Verify
SELECT COUNT(*) AS products_count FROM public.products;
