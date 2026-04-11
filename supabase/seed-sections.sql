-- seed-sections.sql — Sections homepage CMS
-- Exécuter manuellement après supabase start :
--   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed-sections.sql

INSERT INTO page_sections (page_id, type, order_index, content, is_visible) VALUES
  (
    '00000020-0000-0000-0000-000000000001',
    'hero',
    0,
    '{"tagline_top":"design × code","tagline_main":"précision × exécution","tagline_sub":"double exigence","logo_alt":"ThinkTwice"}',
    true
  ),
  (
    '00000020-0000-0000-0000-000000000001',
    'value_prop',
    1,
    '{"headline":"Conception de sites WordPress performants, pensés pour votre image et votre business.","subheadline":"Nous associons direction artistique et développement pour créer des sites sur mesure, clairs, rapides et durables.","cta_primary":{"label":"Demander un devis","href":"#contact"},"cta_secondary":{"label":"Prendre rendez-vous","href":"#contact"}}',
    true
  ),
  (
    '00000020-0000-0000-0000-000000000001',
    'social_proof',
    2,
    '{"stat_label":"+20 ans d''expérience"}',
    true
  ),
  (
    '00000020-0000-0000-0000-000000000001',
    'problem_solution',
    3,
    '{"problem_headline":"Problème client","problem_body":"Aujourd''hui, beaucoup de sites construits avec WordPress manquent de clarté, sont peu différenciants et ne génèrent pas de résultats. Un site qui existe… mais qui ne sert pas votre activité.","solution_headline":"Solution","solution_body":"Nous concevons des sites esthétiques et performants. Un design sur mesure, une structure claire, un développement solide, un site pensé pour durer."}',
    true
  )
ON CONFLICT DO NOTHING;
