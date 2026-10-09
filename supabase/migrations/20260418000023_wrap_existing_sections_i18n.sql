-- ============================================================
-- 023_wrap_existing_sections_i18n.sql
-- Envelopper le contenu monolingue existant dans { "fr": …, "en": … }
-- À appliquer après vérification manuelle du contenu réel en base
-- ============================================================

-- hero : guard sur tagline_top (champ propre à l'ancienne shape)
UPDATE page_sections
SET content = jsonb_build_object('fr', content, 'en', content)
WHERE page_id = '00000020-0000-0000-0000-000000000001'
  AND type = 'hero'
  AND content ? 'tagline_top';

-- value_prop : guard sur headline
UPDATE page_sections
SET content = jsonb_build_object('fr', content, 'en', content)
WHERE page_id = '00000020-0000-0000-0000-000000000001'
  AND type = 'value_prop'
  AND content ? 'headline';

-- social_proof : guard sur stat_label
UPDATE page_sections
SET content = jsonb_build_object('fr', content, 'en', content)
WHERE page_id = '00000020-0000-0000-0000-000000000001'
  AND type = 'social_proof'
  AND content ? 'stat_label';

-- problem_solution : guard sur problem_headline
UPDATE page_sections
SET content = jsonb_build_object('fr', content, 'en', content)
WHERE page_id = '00000020-0000-0000-0000-000000000001'
  AND type = 'problem_solution'
  AND content ? 'problem_headline';

-- Mettre à jour le contenu EN manuellement via le backoffice CMS après migration
