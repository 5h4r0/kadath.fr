-- Migration 026 — Fix mutable search_path sur 3 fonctions
-- Corrige les warnings Supabase Advisor :
--   public.sync_admin_user_metadata
--   public.is_admin
--   public.is_admin_or_editor

ALTER FUNCTION public.sync_admin_user_metadata()
  SET search_path = public;

ALTER FUNCTION public.is_admin()
  SET search_path = public;

ALTER FUNCTION public.is_admin_or_editor()
  SET search_path = public;
