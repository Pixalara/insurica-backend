-- Add client_id column and foreign key relationship to policies table

-- 1. Add client_id column if it doesn't exist
ALTER TABLE policies 
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES clients(id) ON DELETE CASCADE;

-- 2. (Optional) If the column existed but wasn't a foreign key, you would use:
-- ALTER TABLE policies 
-- ADD CONSTRAINT fk_client 
-- FOREIGN KEY (client_id) 
-- REFERENCES clients(id) 
-- ON DELETE CASCADE;

-- 3. Update existing policies to link to clients (optional clean up if needed)
-- This part is tricky without data, but usually you'd want to migrate data here.
-- For now, we just ensure the schema supports the relationship.
