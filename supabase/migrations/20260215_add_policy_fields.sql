-- Add product_type and vehicle_number to policies table
ALTER TABLE policies ADD COLUMN IF NOT EXISTS product_type TEXT;
ALTER TABLE policies ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
