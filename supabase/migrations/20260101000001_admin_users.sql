-- ============================================================
-- 001_admin_users.sql
-- Utilisateurs admin (liés à Supabase Auth)
-- ============================================================

CREATE TABLE admin_users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  first_name TEXT,
  last_name  TEXT,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE admin_users IS 'Utilisateurs du backoffice manage.kadath.fr. id = auth.users.id.';
COMMENT ON COLUMN admin_users.role IS 'admin : accès total. editor : lecture + édition CMS, pas de gestion clients/facturation.';

-- Updated_at automatique
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users: admin voit tout"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role = 'admin'
    )
  );

CREATE POLICY "admin_users: editor voit son propre profil"
  ON admin_users FOR SELECT
  USING (id = auth.uid());
