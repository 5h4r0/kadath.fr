-- Sync raw_app_meta_data.role from admin_users for all active admins/editors
update auth.users u
set raw_app_meta_data = u.raw_app_meta_data || jsonb_build_object('role', a.role)
from public.admin_users a
where u.id = a.id
  and a.role in ('admin', 'editor')
  and a.deleted_at is null;
