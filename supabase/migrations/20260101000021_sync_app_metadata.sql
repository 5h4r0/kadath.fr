-- Migration 021: trigger to keep auth.users.raw_app_meta_data in sync
-- with public.admin_users.role on INSERT or UPDATE.

CREATE OR REPLACE FUNCTION sync_admin_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER sync_admin_metadata_trigger
AFTER INSERT OR UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION sync_admin_user_metadata();
