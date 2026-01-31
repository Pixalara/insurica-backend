
DO $$ BEGIN
    CREATE TYPE public.lead_status AS ENUM ('Follow Up', 'Closed', 'Lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    product_name text,
    premium_quoted numeric,
    status public.lead_status DEFAULT 'Follow Up' NOT NULL,
    notes text,
    created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- Indexes for Leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_name ON public.leads (name);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Authenticated users can view leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
CREATE POLICY "Authenticated users can view leads" 
ON public.leads FOR SELECT 
TO authenticated 
USING ( true );

-- Authenticated users can insert leads
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
CREATE POLICY "Authenticated users can insert leads" 
ON public.leads FOR INSERT 
TO authenticated 
WITH CHECK ( true );

-- Authenticated users can update leads
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
CREATE POLICY "Authenticated users can update leads" 
ON public.leads FOR UPDATE 
TO authenticated 
USING ( true );
