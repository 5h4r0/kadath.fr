-- ============================================================
-- 022_site_settings_footer.sql
-- Clés site_settings pour le footer public
-- ============================================================

INSERT INTO settings (key, value) VALUES
  ('footer_copyright_fr', '"©2026 thinktwice. Tous droits réservés."'),
  ('footer_copyright_en', '"©2026 thinktwice. All rights reserved."'),
  ('footer_legal_links',  '[
    {"label_fr":"Mentions légales","label_en":"Legal notice","href_fr":"/fr/mentions-legales","href_en":"/en/legal"},
    {"label_fr":"Conditions d''utilisation","label_en":"Terms of use","href_fr":"/fr/conditions-utilisation","href_en":"/en/terms"},
    {"label_fr":"Politique de confidentialité","label_en":"Privacy policy","href_fr":"/fr/politique-confidentialite","href_en":"/en/privacy"}
  ]')
ON CONFLICT (key) DO NOTHING;

-- Lecture publique des clés footer (pas besoin d'être authentifié)
CREATE POLICY "settings_public_footer_read"
  ON settings
  FOR SELECT
  USING (key LIKE 'footer_%');
