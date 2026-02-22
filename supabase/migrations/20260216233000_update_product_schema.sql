-- Rename 'category' to 'product_category'
ALTER TABLE public.products 
RENAME COLUMN category TO product_category;

-- Drop the old check constraint (it might depend on the old name)
-- We'll recreate it on the new column name just in case, or trust it follows.
-- Usually, constraints follow renames, but to be safe and clean:
-- We can verify the constraint name first, but typically it's auto-generated or named explicitly.
-- In the original create script: CHECK (category IN ('General', 'Health', 'Life'))
-- Let's just add the new column first.

-- Add 'product_type' column
ALTER TABLE public.products
ADD COLUMN product_type TEXT;

-- Verify
-- SELECT product_category, product_type FROM public.products LIMIT 5;
