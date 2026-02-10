-- ==============================================
-- STORAGE BUCKET SETUP: product-pdfs
-- Run this in Supabase SQL Editor to fix the upload error
-- ==============================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-pdfs', 'product-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access (SELECT)
-- This allows anyone to view/download the PDFs via public URLs
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-pdfs');

-- 3. Allow Authenticated Uploads (INSERT)
-- This allows agents to upload new brochures
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
CREATE POLICY "Authenticated Uploads" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-pdfs');

-- 4. Allow Authenticated Deletes (DELETE)
-- This allows agents to delete brochures if a product is deleted
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;
CREATE POLICY "Authenticated Deletes" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-pdfs');

-- 5. Allow Authenticated Updates (UPDATE)
-- This is often used during the final stages of a multi-part upload
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
CREATE POLICY "Authenticated Updates" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-pdfs');
