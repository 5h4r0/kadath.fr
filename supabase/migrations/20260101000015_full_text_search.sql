-- ============================================================
-- Full-text search — GIN indexes on tsvector generated columns
-- ============================================================

-- ─── cms_pages — fr + en (public front search) ───────────────────────────

ALTER TABLE cms_pages
  ADD COLUMN fts_fr tsvector GENERATED ALWAYS AS (
    to_tsvector('french',
      coalesce(title, '')            || ' ' ||
      coalesce(resume, '')           || ' ' ||
      coalesce(meta_description, '')
    )
  ) STORED,
  ADD COLUMN fts_en tsvector GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '')            || ' ' ||
      coalesce(resume, '')           || ' ' ||
      coalesce(meta_description, '')
    )
  ) STORED;

CREATE INDEX idx_cms_pages_fts_fr ON cms_pages USING GIN (fts_fr);
CREATE INDEX idx_cms_pages_fts_en ON cms_pages USING GIN (fts_en);

-- ─── clients — simple (admin search) ─────────────────────────────────────

ALTER TABLE clients
  ADD COLUMN fts tsvector GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(first_name, '') || ' ' ||
      coalesce(last_name,  '') || ' ' ||
      coalesce(email,      '') || ' ' ||
      coalesce(activity,   '')
    )
  ) STORED;

CREATE INDEX idx_clients_fts ON clients USING GIN (fts);

-- ─── projects — french (admin search) ────────────────────────────────────

ALTER TABLE projects
  ADD COLUMN fts tsvector GENERATED ALWAYS AS (
    to_tsvector('french',
      coalesce(title,       '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED;

CREATE INDEX idx_projects_fts ON projects USING GIN (fts);

-- ─── quotes — simple (admin search on number) ────────────────────────────

ALTER TABLE quotes
  ADD COLUMN fts tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(number, ''))
  ) STORED;

CREATE INDEX idx_quotes_fts ON quotes USING GIN (fts);

-- ─── invoices — simple (admin search on number) ──────────────────────────

ALTER TABLE invoices
  ADD COLUMN fts tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(number, ''))
  ) STORED;

CREATE INDEX idx_invoices_fts ON invoices USING GIN (fts);

-- ─── search_cms_pages(query, lang) ───────────────────────────────────────
-- Retourne les pages CMS publiées correspondant à la requête,
-- triées par pertinence (ts_rank DESC).
-- lang : 'fr' (défaut) ou 'en'

CREATE OR REPLACE FUNCTION search_cms_pages(query text, lang text DEFAULT 'fr')
  RETURNS SETOF cms_pages
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  v_config regconfig;
BEGIN
  v_config := CASE lang
    WHEN 'en' THEN 'english'::regconfig
    ELSE            'french'::regconfig
  END;

  RETURN QUERY
  SELECT * FROM cms_pages
  WHERE published    = true
    AND deleted_at   IS NULL
    AND (
      CASE lang
        WHEN 'en' THEN fts_en
        ELSE           fts_fr
      END
    ) @@ plainto_tsquery(v_config, query)
  ORDER BY ts_rank(
    CASE lang WHEN 'en' THEN fts_en ELSE fts_fr END,
    plainto_tsquery(v_config, query)
  ) DESC;
END;
$$;
