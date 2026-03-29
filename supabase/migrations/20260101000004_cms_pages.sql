-- ============================================================
-- 004_cms_pages.sql
-- Pages CMS avec sections, galerie, SEO, navigation, workflow
-- ============================================================

CREATE TABLE cms_pages (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id            UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_by          UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  parent_id            UUID REFERENCES cms_pages(id) ON DELETE SET NULL,

  -- Contenu
  slug                 TEXT NOT NULL UNIQUE,
  title                TEXT NOT NULL,
  excerpt              TEXT,
  resume               TEXT,
  template             TEXT NOT NULL DEFAULT 'default'
                         CHECK (template IN ('default', 'landing', 'contact', 'blog')),
  lang                 TEXT NOT NULL DEFAULT 'fr',

  -- Sections one-page TipTap (jsonb ordonné)
  -- Structure : [{ id, order, title, content_tiptap }]
  sections             JSONB NOT NULL DEFAULT '[]',

  -- Images hors TipTap
  -- hero : { storage_uri, external_url, alt }  — exactement un non-null
  hero_image           JSONB,
  -- galerie : [{ order, alt, storage_uri, external_url }]
  galerie              JSONB NOT NULL DEFAULT '[]',

  -- SEO
  meta_description     TEXT,
  og_title             TEXT,
  og_image             JSONB,   -- { storage_uri, external_url, alt }
  canonical_url        TEXT,
  robots               TEXT NOT NULL DEFAULT 'index,follow'
                         CHECK (robots IN ('index,follow', 'noindex,nofollow', 'noindex,follow')),
  schema_markup        JSONB,   -- JSON-LD structuré

  -- Navigation
  show_in_menu         BOOLEAN NOT NULL DEFAULT false,
  menu_order           INT NOT NULL DEFAULT 0,

  -- Workflow
  published            BOOLEAN NOT NULL DEFAULT false,
  published_at         TIMESTAMPTZ,
  reviewed_at          TIMESTAMPTZ,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN cms_pages.sections IS 'Sections one-page TipTap déplaçables. Structure : [{ id, order, title, content_tiptap }]';
COMMENT ON COLUMN cms_pages.hero_image IS 'Image hero. { storage_uri, external_url, alt }. Exactement un de storage_uri/external_url est non-null.';
COMMENT ON COLUMN cms_pages.galerie IS 'Galerie images. [{ order, alt, storage_uri, external_url }]. Exactement un de storage_uri/external_url par item.';
COMMENT ON COLUMN cms_pages.og_image IS 'Image Open Graph. { storage_uri, external_url, alt }.';
COMMENT ON COLUMN cms_pages.parent_id IS 'Hiérarchie de pages pour menu arborescent. NULL = page racine.';

CREATE INDEX ON cms_pages (slug);
CREATE INDEX ON cms_pages (author_id);
CREATE INDEX ON cms_pages (parent_id);
CREATE INDEX ON cms_pages (published, published_at);
CREATE INDEX ON cms_pages (show_in_menu, menu_order);

CREATE TRIGGER trg_cms_pages_updated_at
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Table de jointure pages <-> tags
CREATE TABLE pages_tags (
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (page_id, tag_id)
);

CREATE INDEX ON pages_tags (tag_id);

-- Pages liées (M-N auto-référencée, pour menu de page sur le front)
CREATE TABLE pages_linked (
  page_id        UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  linked_page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  order_index    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (page_id, linked_page_id),
  CHECK (page_id <> linked_page_id)
);

CREATE INDEX ON pages_linked (linked_page_id);

-- RLS cms_pages
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_pages: lecture publique si publiée"
  ON cms_pages FOR SELECT
  USING (published = true);

CREATE POLICY "cms_pages: lecture totale admin"
  ON cms_pages FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "cms_pages: écriture admin"
  ON cms_pages FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- RLS pages_tags / pages_linked
ALTER TABLE pages_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_tags: lecture publique" ON pages_tags FOR SELECT USING (true);
CREATE POLICY "pages_tags: écriture admin" ON pages_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

ALTER TABLE pages_linked ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_linked: lecture publique" ON pages_linked FOR SELECT USING (true);
CREATE POLICY "pages_linked: écriture admin" ON pages_linked FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
