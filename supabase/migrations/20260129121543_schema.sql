-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.policy_category AS ENUM ('Life', 'Health', 'General');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.policy_status AS ENUM ('Active', 'Inactive', 'Expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles (User Management)
-- Extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    agency_name text,
    role public.user_role DEFAULT 'agent',
    created_at timestamptz DEFAULT timezone('utc', now()),
    updated_at timestamptz DEFAULT timezone('utc', now())
);

-- 2. Companies (Insurers)
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT timezone('utc', now()),
    updated_at timestamptz DEFAULT timezone('utc', now())
);

-- 3. Clients (Policy & Client Data)
-- Note: Each row represents a policy held by a client.
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    policy_number text NOT NULL UNIQUE,
    company_id uuid REFERENCES public.companies(id) ON DELETE RESTRICT,
    category public.policy_category NOT NULL,
    status public.policy_status,
    
    -- Client/Customer Details
    name text NOT NULL,
    email text,
    phone text,

    -- Common Policy Fields
    product_name text,
    sum_insured numeric,
    premium_amount numeric,
    start_date date,
    end_date date,
    
    -- Creation/Update info
    agent_id uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,

    created_at timestamptz DEFAULT timezone('utc', now()),
    updated_at timestamptz DEFAULT timezone('utc', now())
);

-- Indexes for Search Performance

-- Clients (Policy & Customer Search)
CREATE INDEX IF NOT EXISTS idx_clients_policy_number ON public.clients (policy_number);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients (name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients (phone);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients (company_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients (status);
CREATE INDEX IF NOT EXISTS idx_clients_agent_id ON public.clients (agent_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles (to see other agents/admins), update own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- Companies: Authenticated users can view/create/update
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
CREATE POLICY "Authenticated users can view companies" 
ON public.companies FOR SELECT 
TO authenticated 
USING ( true );

DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
CREATE POLICY "Authenticated users can insert companies" 
ON public.companies FOR INSERT 
TO authenticated 
WITH CHECK ( true );

DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
CREATE POLICY "Authenticated users can update companies" 
ON public.companies FOR UPDATE 
TO authenticated 
USING ( true );

-- Clients (Policies): Authenticated users can view/create/update
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
CREATE POLICY "Authenticated users can view clients" 
ON public.clients FOR SELECT 
TO authenticated 
USING ( true );

DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
CREATE POLICY "Authenticated users can insert clients" 
ON public.clients FOR INSERT 
TO authenticated 
WITH CHECK ( true );

DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
CREATE POLICY "Authenticated users can update clients" 
ON public.clients FOR UPDATE 
TO authenticated 
USING ( true );
