-- Consolidated Migration for Clients Module

-- 1. Add detailed client information columns
ALTER TABLE clients ADD COLUMN IF NOT EXISTS dob date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS zip text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Add portfolio summary columns (for tabular view)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS policy_status text DEFAULT 'Active';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS product_type text;

-- 3. (Optional) Ensure Foreign Key for policies table exists 
-- (This fixes the "relationship not found" error if you want to use joins later)
ALTER TABLE policies 
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
