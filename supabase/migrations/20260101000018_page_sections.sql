-- Migration 018 — page_sections
-- Sections de contenu structurées par page CMS.
-- Chaque section a un type, un ordre, un contenu JSONB et un soft delete.

CREATE TABLE public.page_sections (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id       UUID        NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  type          TEXT        NOT NULL,
  order_index   INT         NOT NULL DEFAULT 0,
  content       JSONB       NOT NULL DEFAULT '{}',
  is_visible    BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- Index composite pour les requêtes ordonnées par page
CREATE INDEX idx_page_sections_page_order ON public.page_sections (page_id, order_index);

-- Trigger updated_at
CREATE TRIGGER trg_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Lecture publique : sections visibles et non supprimées
CREATE POLICY "page_sections_public_read"
  ON public.page_sections
  FOR SELECT
  USING (is_visible = true AND deleted_at IS NULL);

-- Écriture réservée aux admins/editors
CREATE POLICY "page_sections_admin_write"
  ON public.page_sections
  FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());
