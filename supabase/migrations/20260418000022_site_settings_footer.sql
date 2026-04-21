-- ============================================================
-- 022_site_settings_footer.sql
-- Clés site_settings pour le footer public
-- ============================================================

INSERT INTO settings (key, value) VALUES ('footer_copyright_fr', '"© 2026 ThinkTwice. Tous droits réservés."')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES ('footer_copyright_en', '"© 2026 ThinkTwice. All rights reserved."')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES ('footer_legal_links', '[{"label_fr":"Mentions légales","label_en":"Legal notice","href_fr":"/fr/mentions-legales","href_en":"/en/legal-notices"},{"label_fr":"Politique de confidentialité","label_en":"Privacy policy","href_fr":"/fr/confidentialite","href_en":"/en/privacy"}]')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Lecture publique des clés footer (pas besoin d'être authentifié)
CREATE POLICY "settings_public_footer_read"
  ON settings
  FOR SELECT
  USING (key LIKE 'footer_%');
