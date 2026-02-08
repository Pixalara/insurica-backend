-- ==============================================
-- CONSOLIDATE PRODUCTS TABLES
-- Merge products_catalogue into products
-- ==============================================

-- 1. Add agent_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Create index for agent_id
CREATE INDEX IF NOT EXISTS idx_products_agent ON public.products(agent_id);

-- 3. Update existing products to have a default agent if possible (optional)
-- UPDATE public.products SET agent_id = (SELECT id FROM public.profiles LIMIT 1) WHERE agent_id IS NULL;

-- 4. Re-enable RLS with agent-specific policies if needed
-- Currently policies allow all authenticated users to read/write. 
-- We can refine this later to "only own products" if required.

-- 5. Drop the redundant products_catalogue table
DROP TABLE IF EXISTS public.products_catalogue;

-- 6. Update products-related comments
COMMENT ON TABLE public.products IS 'Unified table for all insurance products and brochures';
