-- ============================================================
-- 003_tags.sql
-- Tags pour les pages CMS
-- ============================================================

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON tags (slug);

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tags: lecture publique"
  ON tags FOR SELECT USING (true);

CREATE POLICY "tags: écriture admin uniquement"
  ON tags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );
