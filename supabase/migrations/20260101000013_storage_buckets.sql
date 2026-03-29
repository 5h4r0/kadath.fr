-- ============================================================
-- 013_storage_buckets.sql
-- Supabase Storage — buckets et policies
-- ============================================================
-- Signed URL expiry (appliqué côté app Next.js) :
--   documents  (devis, factures)  : 3600s   (1h)
--   attachments (pièces jointes)  : 3600s   (1h)
--   projects   (images projets)   : 3600s   (1h)
--   media      (CMS)              : public, pas de signed URL
-- ============================================================

-- -------------------------
-- BUCKET : media (public)
-- Images CMS : hero, galerie, og:image
-- -------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,  -- 5 MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- Lecture publique
CREATE POLICY "media: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Upload admin uniquement
CREATE POLICY "media: upload admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Suppression admin uniquement
CREATE POLICY "media: suppression admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- -------------------------
-- BUCKET : projects (privé)
-- Images projets — admin uniquement
-- Signed URLs : 86400s (24h)
-- -------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  false,
  5242880,  -- 5 MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Admin : accès total
CREATE POLICY "projects: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'projects'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Client : lecture de ses propres images projet via signed URL
CREATE POLICY "projects: client lecture ses images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'projects'
    AND (storage.foldername(name))[1] IN (
      SELECT p.id::TEXT
      FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- -------------------------
-- BUCKET : attachments (privé)
-- Pièces jointes messages
-- Signed URLs : 3600s (1h)
-- -------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false,
  10485760,  -- 10 MB max
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ]
);

-- Admin : accès total
CREATE POLICY "attachments: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'attachments'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Client : lecture de ses pièces jointes
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
    )
  );

-- Client : upload dans ses projets
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
    )
  );

-- -------------------------
-- BUCKET : documents (privé)
-- PDF devis et factures générés
-- Signed URLs : 3600s (1h)
-- -------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,  -- 10 MB max
  ARRAY['application/pdf']
);

-- Admin : accès total
CREATE POLICY "documents: admin accès total"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documents'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Client : lecture de ses documents
-- Convention de nommage : documents/{quote|invoice}/{document_id}.pdf
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
      )
      OR
      -- Factures
      (storage.foldername(name))[2] IN (
        SELECT i.id::TEXT
        FROM public.invoices i
        JOIN public.projects p ON p.id = i.project_id
        JOIN public.clients c ON c.id = p.client_id
        WHERE c.auth_user_id = auth.uid()
      )
    )
  );
