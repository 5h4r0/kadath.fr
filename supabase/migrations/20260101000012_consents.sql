-- ============================================================
-- 012_consents.sql
-- Consentements CGU et cookies (enregistrés après validation email)
-- ============================================================

CREATE TABLE consents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('terms', 'cookies')),
  version     TEXT NOT NULL,    -- version des CGU / politique cookies ex: '2026-03'
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address  TEXT,             -- preuve légale
  user_agent  TEXT              -- preuve légale
);

COMMENT ON TABLE consents IS 'Consentements CGU et cookies enregistrés après validation email. Une nouvelle ligne par version acceptée.';
COMMENT ON COLUMN consents.version IS 'Version du document accepté (ex: 2026-03). Permet de re-demander l''acceptation si les CGU changent.';
COMMENT ON COLUMN consents.ip_address IS 'IP au moment de l''acceptation — preuve légale.';
COMMENT ON COLUMN consents.user_agent IS 'User-agent au moment de l''acceptation — preuve légale.';

CREATE INDEX ON consents (user_id, type);

-- RLS
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consents: admin voit tout"
  ON consents FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "consents: utilisateur voit ses propres consentements"
  ON consents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "consents: utilisateur insère son consentement"
  ON consents FOR INSERT
  WITH CHECK (user_id = auth.uid());
