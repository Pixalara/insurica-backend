-- Add policy details directly to clients table for view-only portfolio summary
ALTER TABLE clients ADD COLUMN IF NOT EXISTS policy_status text DEFAULT 'Active';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS product_type text;
