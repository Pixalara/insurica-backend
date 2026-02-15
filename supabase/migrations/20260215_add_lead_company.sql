-- Add company_name to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_name TEXT;
