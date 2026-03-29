-- ============================================================
-- 006_clients.sql
-- Clients freelance avec espace client Supabase Auth
-- ============================================================

CREATE TABLE clients (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Lié à Supabase Auth si le client a un compte espace client
  auth_user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Identité (modifiables par le client lui-même via RLS)
  first_name       TEXT,
  last_name        TEXT,
  email            TEXT NOT NULL,
  phone            TEXT,
  siret            TEXT,
  address          TEXT,
  activity         TEXT,

  -- Interne admin uniquement
  description      TEXT,   -- description du besoin général
  notes            TEXT,   -- remarques internes, non visibles du client
  source           TEXT CHECK (source IN ('referral', 'portfolio', 'linkedin', 'other')),
  status           TEXT NOT NULL DEFAULT 'prospect'
                     CHECK (status IN ('prospect', 'active', 'inactive', 'archived')),

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ   -- soft delete
);

COMMENT ON COLUMN clients.auth_user_id IS 'NULL si le client n''a pas encore activé son espace client.';
COMMENT ON COLUMN clients.notes IS 'Notes internes admin. Non visibles du client.';
COMMENT ON COLUMN clients.deleted_at IS 'Soft delete — ne jamais supprimer un client ayant des données financières.';

CREATE INDEX ON clients (auth_user_id);
CREATE INDEX ON clients (status);
CREATE INDEX ON clients (email);

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients: admin voit tout"
  ON clients FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Le client voit uniquement sa propre fiche
CREATE POLICY "clients: client voit sa fiche"
  ON clients FOR SELECT
  USING (auth_user_id = auth.uid());

-- Le client peut modifier uniquement ses champs autorisés
-- (first_name, last_name, email, phone, siret, address, activity)
-- Contrôle fin géré côté app — la politique RLS autorise l'UPDATE sur sa ligne,
-- la restriction des colonnes est appliquée par la couche API/server action.
CREATE POLICY "clients: client modifie sa fiche"
  ON clients FOR UPDATE
  USING (auth_user_id = auth.uid());
