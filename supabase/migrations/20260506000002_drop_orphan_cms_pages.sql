-- Supprime les pages créées par 029/030 avec un format sections invalide
-- (tableau JSON au lieu d'objet ProseMirror) et des slugs doublons
DELETE FROM public.cms_pages WHERE slug IN ('a-propos', 'confidentialite');
