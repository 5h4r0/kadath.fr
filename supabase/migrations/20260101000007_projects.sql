-- ============================================================
-- 007_projects.sql
-- Projets / missions freelance
-- ============================================================

CREATE TABLE projects (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                 UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,

  title                     TEXT NOT NULL,
  description               TEXT,
  specifications_tiptap     TEXT,           -- contenu TipTap riche
  specifications_updated_at TIMESTAMPTZ,    -- mis à jour manuellement ou via trigger

  status                    TEXT NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'active', 'on_hold', 'completed', 'cancelled')),

  start_date                DATE,
  end_date                  DATE,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ   -- soft delete
);

COMMENT ON COLUMN projects.specifications_tiptap IS 'Spécifications projet au format TipTap JSON. Modifiable en backoffice uniquement.';
COMMENT ON COLUMN projects.specifications_updated_at IS 'Date de dernière modification des spécifications. Mise à jour via trigger ou manuellement.';
COMMENT ON COLUMN projects.deleted_at IS 'Soft delete — ne jamais supprimer un projet ayant des données financières.';

CREATE INDEX ON projects (client_id);
CREATE INDEX ON projects (status);

-- Mise à jour auto de specifications_updated_at si la colonne change
CREATE OR REPLACE FUNCTION set_specifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.specifications_tiptap IS DISTINCT FROM OLD.specifications_tiptap THEN
    NEW.specifications_updated_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_specifications_updated_at();

-- Images projet (admin only, ajout/suppression individuelle)
CREATE TABLE project_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storage_uri  TEXT,           -- URI Supabase Storage
  external_url TEXT,           -- URL externe
  alt          TEXT NOT NULL DEFAULT 'Image',
  order_index  INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_image_source CHECK (
    (storage_uri IS NOT NULL AND external_url IS NULL) OR
    (storage_uri IS NULL AND external_url IS NOT NULL)
  )
);

COMMENT ON COLUMN project_images.storage_uri IS 'URI Supabase Storage. Exclusif avec external_url.';
COMMENT ON COLUMN project_images.external_url IS 'URL image externe. Exclusif avec storage_uri.';

CREATE INDEX ON project_images (project_id);

-- RLS projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: admin voit tout"
  ON projects FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "projects: client voit ses projets"
  ON projects FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- RLS project_images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_images: admin uniquement"
  ON project_images FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "project_images: client voit ses images"
  ON project_images FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );
