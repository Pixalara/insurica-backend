
-- Authenticated users can delete leads
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;
CREATE POLICY "Authenticated users can delete leads" 
ON public.leads FOR DELETE 
TO authenticated 
USING ( true );
