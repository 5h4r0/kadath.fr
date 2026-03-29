-- ============================================================
-- 011_numbering_sequences.sql
-- Numérotation automatique devis / factures par année
-- Format : {PREFIX}-{YYYY}-{NNNN}  ex: DEVIS-2026-0001
-- ============================================================

-- Table de compteurs par année et type de document
CREATE TABLE numbering_counters (
  doc_type TEXT NOT NULL,   -- 'quote' | 'invoice'
  year     INT  NOT NULL,
  counter  INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (doc_type, year)
);

COMMENT ON TABLE numbering_counters IS 'Compteurs de numérotation annuels pour devis et factures. Reset automatique chaque année.';

-- Fonction de génération du numéro
CREATE OR REPLACE FUNCTION generate_document_number(p_doc_type TEXT)
RETURNS TEXT AS $$
DECLARE
  v_year      INT := EXTRACT(YEAR FROM now());
  v_counter   INT;
  v_prefix    TEXT;
BEGIN
  -- Récupérer le préfixe depuis settings
  SELECT value INTO v_prefix
  FROM settings
  WHERE key = CASE p_doc_type
    WHEN 'quote'   THEN 'quote_prefix'
    WHEN 'invoice' THEN 'invoice_prefix'
  END;

  v_prefix := COALESCE(v_prefix, UPPER(p_doc_type));

  -- Incrémenter le compteur de l'année courante (upsert atomique)
  INSERT INTO numbering_counters (doc_type, year, counter)
  VALUES (p_doc_type, v_year, 1)
  ON CONFLICT (doc_type, year)
  DO UPDATE SET counter = numbering_counters.counter + 1
  RETURNING counter INTO v_counter;

  -- Format : PREFIX-YYYY-NNNN
  RETURN v_prefix || '-' || v_year || '-' || LPAD(v_counter::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger : numéro auto à l'INSERT si non fourni
CREATE OR REPLACE FUNCTION assign_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := generate_document_number('quote');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_quote_number
  BEFORE INSERT ON quotes
  FOR EACH ROW EXECUTE FUNCTION assign_quote_number();

CREATE OR REPLACE FUNCTION assign_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := generate_document_number('invoice');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION assign_invoice_number();

-- RLS numbering_counters : admin uniquement
ALTER TABLE numbering_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "numbering_counters: admin uniquement"
  ON numbering_counters FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
