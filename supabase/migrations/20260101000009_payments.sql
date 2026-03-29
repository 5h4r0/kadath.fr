-- ============================================================
-- 009_payments.sql
-- Paiements (acompte / solde / unique — Stripe ou virement)
-- ============================================================

CREATE TABLE payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,

  type         TEXT NOT NULL CHECK (type IN ('deposit', 'balance', 'full')),
  method       TEXT NOT NULL CHECK (method IN ('stripe', 'bank_transfer')),
  amount       NUMERIC(10,2) NOT NULL,

  paid_at      DATE NOT NULL,
  stripe_id    TEXT,   -- Stripe Payment Intent ID, nullable si virement

  notes        TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN payments.type IS 'deposit = acompte, balance = solde, full = paiement unique.';
COMMENT ON COLUMN payments.stripe_id IS 'Stripe Payment Intent ID. NULL si paiement par virement bancaire.';

CREATE INDEX ON payments (invoice_id);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments: admin voit tout"
  ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "payments: client voit ses paiements"
  ON payments FOR SELECT
  USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN projects p ON p.id = i.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.auth_user_id = auth.uid()
    )
  );
