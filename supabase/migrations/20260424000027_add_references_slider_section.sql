INSERT INTO cms_pages (id, slug, title, published)
VALUES (
  '00000020-0000-0000-0000-000000000001',
  'homepage',
  'Homepage',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO page_sections (page_id, type, order_index, content)
VALUES (
  '00000020-0000-0000-0000-000000000001',
  'references_slider',
  (SELECT COALESCE(MAX(order_index), 0) + 1
   FROM page_sections
   WHERE page_id = '00000020-0000-0000-0000-000000000001'),
  '{"fr": {}, "en": {}}'::jsonb
)
ON CONFLICT DO NOTHING;
