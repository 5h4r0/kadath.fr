INSERT INTO cms_pages (slug, title, lang, published, sections)
VALUES
  (
    'about',
    'À propos',
    'fr',
    true,
    '[{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"À propos"}]}]}]'::jsonb
  ),
  (
    'confidentialite',
    'Politique de confidentialité',
    'fr',
    true,
    '[{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Politique de confidentialité"}]}]}]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;
