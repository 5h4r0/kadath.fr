-- Fix: Function Search Path Mutable (Supabase Security Advisor)
-- Adds SET search_path = public to all affected functions.

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_specifications_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  IF NEW.specifications_tiptap IS DISTINCT FROM OLD.specifications_tiptap THEN
    NEW.specifications_updated_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_revision_limit()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  DELETE FROM cms_page_revisions
  WHERE id IN (
    SELECT id FROM cms_page_revisions
    WHERE page_id = NEW.page_id
    ORDER BY created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_document_number(p_doc_type text)
  RETURNS text
  LANGUAGE plpgsql
  SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.assign_quote_number()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := generate_document_number('quote');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_invoice_number()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := generate_document_number('invoice');
  END IF;
  RETURN NEW;
END;
$$;
