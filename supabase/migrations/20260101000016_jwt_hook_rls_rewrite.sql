-- ============================================================
-- 016_jwt_hook_rls_rewrite.sql
-- Hook JWT custom_access_token + réécriture des policies admin
-- vers auth.jwt() pour éliminer les requêtes DB dans les checks.
--
-- IMPORTANT — activation manuelle requise après déploiement :
--   Supabase Dashboard → Authentication → Hooks
--   → "Custom Access Token Hook"
--   → Function : public.custom_access_token_hook
-- ============================================================

-- --------------------------------------------------------
-- 1. Fonction hook JWT
--    Enrichit le JWT avec app_metadata.role si l'utilisateur
--    est dans admin_users. Les clients n'ont aucun rôle injecté.
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.admin_users
  WHERE id = (event ->> 'user_id')::UUID;

  IF v_role IS NOT NULL THEN
    event := jsonb_set(
      event,
      '{claims,app_metadata,role}',
      to_jsonb(v_role)
    );
  END IF;

  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook
  FROM authenticated, anon, public;

-- --------------------------------------------------------
-- 2. Fonctions helper RLS
--    Évitent de répéter l'expression JWT dans chaque policy.
--    STABLE : évaluées une fois par requête.
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'editor')
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
$$;

-- --------------------------------------------------------
-- 3. admin_users
-- --------------------------------------------------------
DROP POLICY IF EXISTS "admin_users: lecture admin" ON admin_users;
DROP POLICY IF EXISTS "admin_users: modification admin" ON admin_users;

CREATE POLICY "admin_users: lecture admin"
  ON admin_users FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "admin_users: modification admin"
  ON admin_users FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 4. settings (admin seulement — pas editor)
-- --------------------------------------------------------
DROP POLICY IF EXISTS "settings: admin uniquement" ON settings;

CREATE POLICY "settings: admin uniquement"
  ON settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --------------------------------------------------------
-- 5. tags
-- --------------------------------------------------------
DROP POLICY IF EXISTS "tags: écriture admin uniquement" ON tags;

CREATE POLICY "tags: écriture admin uniquement"
  ON tags FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 6. cms_pages, pages_tags, pages_linked
-- --------------------------------------------------------
DROP POLICY IF EXISTS "cms_pages: lecture totale admin" ON cms_pages;
DROP POLICY IF EXISTS "cms_pages: écriture admin" ON cms_pages;

CREATE POLICY "cms_pages: lecture totale admin"
  ON cms_pages FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "cms_pages: écriture admin"
  ON cms_pages FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "pages_tags: écriture admin" ON pages_tags;
DROP POLICY IF EXISTS "pages_linked: écriture admin" ON pages_linked;

CREATE POLICY "pages_tags: écriture admin"
  ON pages_tags FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "pages_linked: écriture admin"
  ON pages_linked FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 7. cms_page_revisions
-- --------------------------------------------------------
DROP POLICY IF EXISTS "cms_page_revisions: admin uniquement" ON cms_page_revisions;

CREATE POLICY "cms_page_revisions: admin uniquement"
  ON cms_page_revisions FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 8. clients
-- --------------------------------------------------------
DROP POLICY IF EXISTS "clients: admin voit tout" ON clients;

CREATE POLICY "clients: admin voit tout"
  ON clients FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 9. projects, project_images
-- --------------------------------------------------------
DROP POLICY IF EXISTS "projects: admin voit tout" ON projects;
DROP POLICY IF EXISTS "project_images: admin uniquement" ON project_images;

CREATE POLICY "projects: admin voit tout"
  ON projects FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "project_images: admin uniquement"
  ON project_images FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 10. quotes, quote_lines
-- --------------------------------------------------------
DROP POLICY IF EXISTS "quotes: admin voit tout" ON quotes;
DROP POLICY IF EXISTS "quote_lines: admin voit tout" ON quote_lines;

CREATE POLICY "quotes: admin voit tout"
  ON quotes FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "quote_lines: admin voit tout"
  ON quote_lines FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 11. invoices, invoice_lines
-- --------------------------------------------------------
DROP POLICY IF EXISTS "invoices: admin voit tout" ON invoices;
DROP POLICY IF EXISTS "invoice_lines: admin voit tout" ON invoice_lines;

CREATE POLICY "invoices: admin voit tout"
  ON invoices FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "invoice_lines: admin voit tout"
  ON invoice_lines FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 12. payments
-- --------------------------------------------------------
DROP POLICY IF EXISTS "payments: admin voit tout" ON payments;

CREATE POLICY "payments: admin voit tout"
  ON payments FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 13. messages, attachments, message_reads
-- --------------------------------------------------------
DROP POLICY IF EXISTS "messages: admin voit tout" ON messages;
DROP POLICY IF EXISTS "attachments: admin voit tout" ON attachments;
DROP POLICY IF EXISTS "message_reads: admin voit tout" ON message_reads;

CREATE POLICY "messages: admin voit tout"
  ON messages FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "attachments: admin voit tout"
  ON attachments FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "message_reads: admin voit tout"
  ON message_reads FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 14. numbering_counters
-- --------------------------------------------------------
DROP POLICY IF EXISTS "numbering_counters: admin uniquement" ON numbering_counters;

CREATE POLICY "numbering_counters: admin uniquement"
  ON numbering_counters FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 15. consents
-- --------------------------------------------------------
DROP POLICY IF EXISTS "consents: admin voit tout" ON consents;

CREATE POLICY "consents: admin voit tout"
  ON consents FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- --------------------------------------------------------
-- 16. storage.objects — policies admin
-- --------------------------------------------------------
DROP POLICY IF EXISTS "media: upload admin" ON storage.objects;
DROP POLICY IF EXISTS "media: suppression admin" ON storage.objects;
DROP POLICY IF EXISTS "projects: admin accès total" ON storage.objects;
DROP POLICY IF EXISTS "attachments: admin accès total" ON storage.objects;
DROP POLICY IF EXISTS "documents: admin accès total" ON storage.objects;

CREATE POLICY "media: upload admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND public.is_admin_or_editor()
  );

CREATE POLICY "media: suppression admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND public.is_admin_or_editor()
  );

CREATE POLICY "projects: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'projects'
    AND public.is_admin_or_editor()
  )
  WITH CHECK (
    bucket_id = 'projects'
    AND public.is_admin_or_editor()
  );

CREATE POLICY "attachments: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'attachments'
    AND public.is_admin_or_editor()
  )
  WITH CHECK (
    bucket_id = 'attachments'
    AND public.is_admin_or_editor()
  );

CREATE POLICY "documents: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documents'
    AND public.is_admin_or_editor()
  )
  WITH CHECK (
    bucket_id = 'documents'
    AND public.is_admin_or_editor()
  );
