# Database Setup Required

The following database tables need to be created in Supabase for the Insurica CRM.

## 🚀 Universal Customer ID Schema (NEW - Run First!)

**Run this SQL in Supabase SQL Editor:**

📁 File: `supabase/migrations/20260205_universal_customer_id.sql`

This creates:
- **`customers`** - Universal Customer ID (one customer = one record across all products/insurers)
- **`policies`** - Policies linked by `customer_id` (FK)
- **`products_catalogue`** - Product PDFs uploaded by agents

> **Note:** This SQL uses `IF NOT EXISTS` so it's safe to run multiple times.

---


## Updates for Enhanced Features

### 1. Update Clients Table (Universal Customer ID)

```sql
-- Add unique constraint to phone for customer lookup
-- Note: Only run if you're sure no duplicate phone numbers exist
ALTER TABLE clients ADD CONSTRAINT unique_phone UNIQUE (phone);

-- OR if you have duplicates, first clean them up, then add constraint
-- You can query duplicates with:
-- SELECT phone, COUNT(*) FROM clients GROUP BY phone HAVING COUNT(*) > 1;

-- Create index for faster phone lookups
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
```

### 2. Update Products Table (PDF Support)

```sql
-- Add PDF-related columns to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_filename TEXT;

-- Create index for insurer filtering
CREATE INDEX IF NOT EXISTS idx_products_insurer ON products(insurer);
```

## 1. Products Table

```sql
CREATE TABLE IF NOT EXISTS products (
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

-- Create index for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
```

## 2. Leads Table

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
  source TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
```

## 3. Existing Tables

The following modules use the existing `clients` table:
- **Policies Module**: Uses `clients` table (already exists)
- **Renewals Module**: Uses `clients` table (already exists)
- **Clients Module**: Uses `clients` table (already exists)

## Row Level Security (RLS)

Make sure to enable RLS and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
-- Example: Allow authenticated users to read all products
CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete products" ON products
  FOR DELETE TO authenticated USING (true);

-- Similar policies for leads
CREATE POLICY "Allow authenticated users to read leads" ON leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert leads" ON leads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update leads" ON leads
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete leads" ON leads
  FOR DELETE TO authenticated USING (true);
```

## Running the Migrations

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each SQL block above
4. Execute them one by one
5. Verify the tables are created successfully

## Optional: Sample Data

You can add some sample data for testing:

```sql
-- Sample Products
INSERT INTO products (name, category, insurer, coverage_amount, premium_range_min, premium_range_max, features, description, status)
VALUES
  ('Comprehensive Motor Insurance', 'General', 'HDFC ERGO', 500000, 8000, 15000, ARRAY['Zero Depreciation', 'Roadside Assistance', 'NCB Protection'], 'Full coverage for your vehicle', 'Active'),
  ('Family Health Insurance', 'Health', 'Star Health', 1000000, 15000, 25000, ARRAY['Cashless Treatment', 'Pre-existing Disease Cover', 'Annual Health Checkup'], 'Comprehensive health coverage for family', 'Active'),
  ('Term Life Insurance', 'Life', 'HDFC Life', 5000000, 10000, 20000, ARRAY['Life Cover', 'Accidental Death Benefit', 'Critical Illness Cover'], 'Secure your family future', 'Active');

-- Sample Leads
INSERT INTO leads (name, email, phone, interest, status, source, notes)
VALUES
  ('Rajesh Kumar', 'rajesh@example.com', '+91-9876543210', 'Motor Insurance', 'New', 'Website', 'Interested in comprehensive coverage'),
  ('Priya Sharma', 'priya@example.com', '+91-9876543211', 'Health Insurance', 'Contacted', 'Referral', 'Looking for family floater plan'),
  ('Amit Patel', 'amit@example.com', '+91-9876543212', 'Life Insurance', 'Qualified', 'Walk-in', 'Ready to purchase term plan');
```
