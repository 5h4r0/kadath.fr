-- Supprimer l'ancienne clé settings
DELETE FROM settings WHERE key = 'footer_legal_links';

-- Créer la table
CREATE TABLE IF NOT EXISTS public.footer_legal_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cms_page_id   uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  zone          text NOT NULL CHECK (zone IN ('legal', 'nav')),
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.footer_legal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "footer_legal_links: lecture publique"
  ON public.footer_legal_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "footer_legal_links: admin uniquement"
  ON public.footer_legal_links FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());
