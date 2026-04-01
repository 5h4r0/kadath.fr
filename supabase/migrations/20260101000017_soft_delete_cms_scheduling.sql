-- ============================================================
-- 017_soft_delete_cms_scheduling.sql
-- 1. cms_pages : lecture publique avec scheduling published_at
-- 2. Toutes les policies SELECT clients : filtre deleted_at IS NULL
--    sur projects, clients, quotes, invoices et leurs jointures
-- ============================================================

-- --------------------------------------------------------
-- 1. cms_pages — scheduling published_at
--    Ancienne policy : USING (published = true)
--    Problème : une page programmée avec published_at dans le
--    futur était visible immédiatement si published = true.
-- --------------------------------------------------------
DROP POLICY IF EXISTS "cms_pages: lecture publique si publiée" ON cms_pages;

CREATE POLICY "cms_pages: lecture publique si publiée"
  ON cms_pages FOR SELECT
  USING (
    published = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

-- --------------------------------------------------------
-- 2. clients — client voit sa fiche si non supprimée
-- --------------------------------------------------------
DROP POLICY IF EXISTS "clients: client voit sa fiche" ON clients;
DROP POLICY IF EXISTS "clients: client modifie sa fiche" ON clients;

CREATE POLICY "clients: client voit sa fiche"
  ON clients FOR SELECT
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "clients: client modifie sa fiche"
  ON clients FOR UPDATE
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (auth_user_id = auth.uid() AND deleted_at IS NULL);

-- --------------------------------------------------------
-- 3. projects — filtre projets supprimés côté client
-- --------------------------------------------------------
DROP POLICY IF EXISTS "projects: client voit ses projets" ON projects;

CREATE POLICY "projects: client voit ses projets"
  ON projects FOR SELECT
  USING (
    deleted_at IS NULL
    AND client_id IN (
      SELECT id FROM clients
      WHERE auth_user_id = auth.uid()
        AND deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 4. project_images — via projets et clients actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "project_images: client voit ses images" ON project_images;

CREATE POLICY "project_images: client voit ses images"
  ON project_images FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 5. quotes — filtre devis supprimés
-- --------------------------------------------------------
DROP POLICY IF EXISTS "quotes: client voit ses devis" ON quotes;

CREATE POLICY "quotes: client voit ses devis"
  ON quotes FOR SELECT
  USING (
    deleted_at IS NULL
    AND project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 6. quote_lines — via devis et projets actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "quote_lines: client voit ses lignes" ON quote_lines;

CREATE POLICY "quote_lines: client voit ses lignes"
  ON quote_lines FOR SELECT
  USING (
    quote_id IN (
      SELECT q.id FROM quotes q
      JOIN projects p ON p.id = q.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND q.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 7. invoices — filtre factures supprimées
-- --------------------------------------------------------
DROP POLICY IF EXISTS "invoices: client voit ses factures" ON invoices;

CREATE POLICY "invoices: client voit ses factures"
  ON invoices FOR SELECT
  USING (
    deleted_at IS NULL
    AND project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 8. invoice_lines — via factures et projets actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "invoice_lines: client voit ses lignes" ON invoice_lines;

CREATE POLICY "invoice_lines: client voit ses lignes"
  ON invoice_lines FOR SELECT
  USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN projects p ON p.id = i.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND i.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 9. payments — via factures et projets actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "payments: client voit ses paiements" ON payments;

CREATE POLICY "payments: client voit ses paiements"
  ON payments FOR SELECT
  USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN projects p ON p.id = i.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND i.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 10. messages — via projets et clients actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "messages: client voit ses messages" ON messages;
DROP POLICY IF EXISTS "messages: client envoie un message" ON messages;

CREATE POLICY "messages: client voit ses messages"
  ON messages FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

CREATE POLICY "messages: client envoie un message"
  ON messages FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND author_type = 'client'
    AND project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 11. attachments — via projets et clients actifs
-- --------------------------------------------------------
DROP POLICY IF EXISTS "attachments: client lecture ses pièces jointes" ON attachments;

CREATE POLICY "attachments: client lecture ses pièces jointes"
  ON attachments FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN projects p ON p.id = m.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- --------------------------------------------------------
-- 12. storage.objects — policies client avec deleted_at
-- --------------------------------------------------------

-- Bucket projects : images projet via projets actifs
DROP POLICY IF EXISTS "projects: client lecture ses images" ON storage.objects;

CREATE POLICY "projects: client lecture ses images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'projects'
    AND (storage.foldername(name))[1] IN (
      SELECT p.id::TEXT
      FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- Bucket attachments : pièces jointes via projets actifs
DROP POLICY IF EXISTS "attachments: client lecture ses pièces jointes" ON storage.objects;
DROP POLICY IF EXISTS "attachments: client upload ses pièces jointes" ON storage.objects;

CREATE POLICY "attachments: client lecture ses pièces jointes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[1] IN (
      SELECT m.id::TEXT
      FROM public.messages m
      JOIN public.projects p ON p.id = m.project_id
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

CREATE POLICY "attachments: client upload ses pièces jointes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[1] IN (
      SELECT m.id::TEXT
      FROM public.messages m
      JOIN public.projects p ON p.id = m.project_id
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
        AND p.deleted_at IS NULL
        AND c.deleted_at IS NULL
    )
  );

-- Bucket documents : PDF devis/factures via données actives
DROP POLICY IF EXISTS "documents: client lecture ses documents" ON storage.objects;

CREATE POLICY "documents: client lecture ses documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      -- Devis
      (storage.foldername(name))[2] IN (
        SELECT q.id::TEXT
        FROM public.quotes q
        JOIN public.projects p ON p.id = q.project_id
        JOIN public.clients c ON c.id = p.client_id
        WHERE c.auth_user_id = auth.uid()
          AND q.deleted_at IS NULL
          AND p.deleted_at IS NULL
          AND c.deleted_at IS NULL
      )
      OR
      -- Factures
      (storage.foldername(name))[2] IN (
        SELECT i.id::TEXT
        FROM public.invoices i
        JOIN public.projects p ON p.id = i.project_id
        JOIN public.clients c ON c.id = p.client_id
        WHERE c.auth_user_id = auth.uid()
          AND i.deleted_at IS NULL
          AND p.deleted_at IS NULL
          AND c.deleted_at IS NULL
      )
    )
  );
