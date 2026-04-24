-- Fix mutable search_path sur les fonctions publiques (security best practice)
ALTER FUNCTION public.sync_admin_user_metadata() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.is_admin_or_editor() SET search_path = public;
