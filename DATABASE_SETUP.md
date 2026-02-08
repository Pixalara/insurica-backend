# Database Setup Required

The following database tables need to be created in Supabase for the Insurica CRM.

## 🚀 Universal Customer ID Schema (Current Architecture)

**Run this SQL in Supabase SQL Editor:**

📁 File: `supabase/migrations/20260205_universal_customer_id.sql`

This creates:
- **`customers`** - Universal Customer ID (one customer = one record across all products/insurers)
- **`policies`** - Policies linked by `customer_id` (FK)
- **`products_catalogue`** - Product PDFs uploaded by agents

> **Note:** This SQL uses `IF NOT EXISTS` so it's safe to run multiple times.

---

## Schema Overview

### Customers Table
The `customers` table is the single source of truth for customer data:

| Column | Type | Description |
|--------|------|-------------|
| customer_id | UUID | Primary key |
| full_name | TEXT | Customer's full name |
| mobile_number | TEXT | Phone number (unique per agent) |
| email | TEXT | Email address (optional) |
| dob | DATE | Date of birth (optional) |
| address | TEXT | Address (optional) |
| agent_id | UUID | FK to profiles |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Policies Table
The `policies` table stores all policy data linked to customers:

| Column | Type | Description |
|--------|------|-------------|
| policy_id | UUID | Primary key |
| customer_id | UUID | FK to customers |
| policy_number | TEXT | Policy number |
| product | TEXT | Product name |
| insurance_company | TEXT | Insurer name |
| policy_type | TEXT | 'General', 'Health', or 'Life' |
| sum_insured | NUMERIC | Coverage amount |
| start_date | DATE | Policy start date |
| end_date | DATE | Policy end date |
| premium | NUMERIC | Premium amount |
| status | TEXT | 'Active', 'Expired', or 'Cancelled' |
| remarks | TEXT | Additional notes |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

## Additional Tables

### Products Table

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

### Leads Table

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

## Module Usage

The following modules use the `customers` and `policies` tables:
- **Dashboard**: Queries `policies` with customer joins for analytics
- **Policies Module**: CRUD on `policies` table with customer references
- **Clients Module**: Manages `customers` with their associated policies
- **Renewals Module**: Queries `policies` for upcoming renewals
- **Insurance Modules (General/Health/Life)**: Filtered views of `policies` by type

## Row Level Security (RLS)

RLS policies are defined in the migration file for:
- `customers` - Authenticated read/insert/update
- `policies` - Authenticated read/insert/update/delete
- `products_catalogue` - Authenticated read/insert/update/delete

## Running the Migrations

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run `supabase/migrations/20260205_universal_customer_id.sql`
4. Verify the tables are created successfully

## Dropping Old Clients Table (Optional)

If migrating from the old schema with a `clients` table:

📁 File: `supabase/migrations/20260207_drop_clients_table.sql`

> **Warning:** Only run this after migrating any existing data to the new schema.
