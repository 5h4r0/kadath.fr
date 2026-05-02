-- Enable RLS on admin_users (deny all for anon/authenticated — service_role bypasses natively)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
