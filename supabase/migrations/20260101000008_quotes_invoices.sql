-- ============================================================
-- 008_quotes_invoices.sql
-- Devis, factures et leurs lignes
-- ============================================================

-- -------------------------
-- DEVIS
-- -------------------------
CREATE TABLE quotes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,

  number       TEXT NOT NULL UNIQUE,   -- généré via séquence (cf. 010)
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'sent', 'accepted', 'refused', 'expired')),

  amount_ht    NUMERIC(10,2) NOT NULL, -- total calculé depuis les lignes
  tva_rate     NUMERIC(5,2) NOT NULL DEFAULT 20.00,

  issued_at    DATE NOT NULL,
  valid_until  DATE,
  notes        TEXT,                   -- conditions particulières, mentions légales

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX ON quotes (project_id);
CREATE INDEX ON quotes (status);

CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Lignes de devis
CREATE TABLE quote_lines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL,
  tva_rate    NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  order_index INT NOT NULL DEFAULT 0
);

CREATE INDEX ON quote_lines (quote_id);

-- -------------------------
-- FACTURES
-- -------------------------
CREATE TABLE invoices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  quote_id     UUID REFERENCES quotes(id) ON DELETE SET NULL,
  -- quote_id nullable : facturation directe sans devis possible

  number       TEXT NOT NULL UNIQUE,   -- généré via séquence (cf. 010)
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled')),

  amount_ht    NUMERIC(10,2) NOT NULL,
  tva_rate     NUMERIC(5,2) NOT NULL DEFAULT 20.00,

  issued_at    DATE NOT NULL,
  due_at       DATE,
  notes        TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ
);

COMMENT ON COLUMN invoices.quote_id IS 'Nullable. NULL = facturation directe sans devis préalable. Dans ce cas, invoice_lines porte l''intégralité du détail.';

CREATE INDEX ON invoices (project_id);
CREATE INDEX ON invoices (quote_id);
CREATE INDEX ON invoices (status);

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Lignes de facture
CREATE TABLE invoice_lines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL,
  tva_rate    NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  order_index INT NOT NULL DEFAULT 0
);

CREATE INDEX ON invoice_lines (invoice_id);

-- RLS quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes: admin voit tout"
  ON quotes FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "quotes: client voit ses devis"
  ON quotes FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_lines: admin voit tout"
  ON quote_lines FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "quote_lines: client voit ses lignes"
  ON quote_lines FOR SELECT
  USING (
    quote_id IN (
      SELECT q.id FROM quotes q
      JOIN projects p ON p.id = q.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- RLS invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices: admin voit tout"
  ON invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "invoices: client voit ses factures"
  ON invoices FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_lines: admin voit tout"
  ON invoice_lines FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "invoice_lines: client voit ses lignes"
  ON invoice_lines FOR SELECT
  USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN projects p ON p.id = i.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );
