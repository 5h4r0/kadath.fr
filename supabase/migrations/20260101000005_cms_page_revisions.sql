-- ============================================================
-- 005_cms_page_revisions.sql
-- Historique de versions des pages CMS (manuel, 5 max par page)
-- ============================================================

CREATE TABLE cms_page_revisions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id    UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  label      TEXT,                  -- label libre saisi par l'éditeur
  snapshot   JSONB NOT NULL,        -- snapshot complet de la ligne cms_pages au moment de la révision
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE cms_page_revisions IS 'Versions manuelles des pages CMS. Max 5 par page — nettoyage automatique via trigger.';
COMMENT ON COLUMN cms_page_revisions.snapshot IS 'Snapshot complet de la ligne cms_pages (hors id, created_at). Permet restauration complète.';

CREATE INDEX ON cms_page_revisions (page_id, created_at DESC);
CREATE INDEX ON cms_page_revisions (author_id);

-- Trigger : conserver uniquement les 5 dernières révisions par page
CREATE OR REPLACE FUNCTION enforce_revision_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM cms_page_revisions
  WHERE id IN (
    SELECT id FROM cms_page_revisions
    WHERE page_id = NEW.page_id
    ORDER BY created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_revision_limit
  AFTER INSERT ON cms_page_revisions
  FOR EACH ROW EXECUTE FUNCTION enforce_revision_limit();

-- RLS
ALTER TABLE cms_page_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_page_revisions: admin uniquement"
  ON cms_page_revisions FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
