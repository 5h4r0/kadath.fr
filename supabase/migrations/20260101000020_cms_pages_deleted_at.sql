-- Migration 020: add deleted_at to cms_pages for soft delete support
ALTER TABLE public.cms_pages
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
