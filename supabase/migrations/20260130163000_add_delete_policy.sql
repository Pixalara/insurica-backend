-- Enable DELETE for authenticated users on clients table
DO $$ BEGIN
    DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;
    CREATE POLICY "Authenticated users can delete clients"
    ON public.clients FOR DELETE
    TO authenticated
    USING ( true );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
