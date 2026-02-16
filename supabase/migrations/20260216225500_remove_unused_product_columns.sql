ALTER TABLE public.products 
DROP COLUMN IF EXISTS coverage_amount,
DROP COLUMN IF EXISTS premium_range_min,
DROP COLUMN IF EXISTS premium_range_max,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS features;
