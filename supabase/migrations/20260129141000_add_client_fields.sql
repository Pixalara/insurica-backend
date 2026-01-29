ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS policy_duration text,
ADD COLUMN IF NOT EXISTS notes text;
