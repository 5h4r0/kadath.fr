-- ============================================================
-- 002_settings.sql
-- Paramètres globaux du backoffice (clé/valeur)
-- ============================================================

CREATE TABLE settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE settings IS 'Paramètres globaux modifiables en backoffice.';
COMMENT ON COLUMN settings.key IS 'Exemples : default_tjm, currency, payment_terms_days, quote_prefix, invoice_prefix, legal_name, legal_address, legal_siret, legal_vat';

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS : admin uniquement
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings: admin uniquement"
  ON settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role = 'admin'
    )
  );

-- Valeurs par défaut
INSERT INTO settings (key, value) VALUES
  ('quote_prefix',        'DEVIS'),
  ('invoice_prefix',      'FACT'),
  ('currency',            'EUR'),
  ('payment_terms_days',  '30'),
  ('default_tjm',         '0'),
  ('legal_name',          ''),
  ('legal_address',       ''),
  ('legal_siret',         ''),
  ('legal_vat',           '');
