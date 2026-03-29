-- ============================================================
-- 010_messages.sql
-- Messagerie projet avec pièces jointes et statut de lecture
-- ============================================================

CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL,         -- auth.users.id (admin ou client)
  author_type TEXT NOT NULL CHECK (author_type IN ('admin', 'client')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON messages (project_id, created_at DESC);
CREATE INDEX ON messages (author_id);

-- Pièces jointes
CREATE TABLE attachments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id   UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name    TEXT NOT NULL,
  storage_uri  TEXT,         -- URI Supabase Storage
  external_url TEXT,         -- URL externe
  mime_type    TEXT,
  size_bytes   BIGINT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_attachment_source CHECK (
    (storage_uri IS NOT NULL AND external_url IS NULL) OR
    (storage_uri IS NULL AND external_url IS NOT NULL)
  )
);

CREATE INDEX ON attachments (message_id);

-- Statut de lecture (M-N messages <-> utilisateurs)
CREATE TABLE message_reads (
  message_id  UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL,        -- auth.users.id
  user_type   TEXT NOT NULL CHECK (user_type IN ('admin', 'client')),
  read_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

CREATE INDEX ON message_reads (message_id);
CREATE INDEX ON message_reads (user_id);

-- RLS messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages: admin voit tout"
  ON messages FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "messages: client voit ses messages"
  ON messages FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
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
    )
  );

-- RLS attachments
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attachments: admin voit tout"
  ON attachments FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "attachments: client voit ses pièces jointes"
  ON attachments FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN projects p ON p.id = m.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- RLS message_reads
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_reads: admin voit tout"
  ON message_reads FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "message_reads: client gère ses lectures"
  ON message_reads FOR ALL
  USING (user_id = auth.uid() AND user_type = 'client');
