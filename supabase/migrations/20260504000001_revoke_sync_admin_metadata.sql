-- Revoke public execution of sync_admin_user_metadata (SECURITY DEFINER)
-- Called only by triggers, not by external roles
REVOKE EXECUTE ON FUNCTION public.sync_admin_user_metadata() FROM anon, authenticated;
