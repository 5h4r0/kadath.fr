-- ============================================================
-- seed.sql — Données de test kadath.fr
-- ============================================================
-- UUIDs de référence
-- admin@kadath.fr     → 501f1bd9-127e-4515-9434-269ce3ae8bb7
-- editor@kadath.fr    → d859c080-d0b3-407d-8efd-22ac5528beed
-- client1@test.fr     → 9472471e-bc06-4992-93c3-b31065347fdb
-- client2@test.fr     → c09430c1-c1e8-4676-b1d7-e6b6c7c850a2
-- client3@test.fr     → (pas de compte auth)
-- ============================================================

-- ─── Auth users (requis avant admin_users et clients — FK auth.users) ─────
-- Inséré directement ici car supabase start exécute seed.sql avant
-- que scripts/seed-auth.ts ait pu créer les utilisateurs via l'API.
-- Mots de passe en clair dans scripts/seed-auth.ts — même valeurs.
-- GoTrue requires several string columns to be '' (not NULL) and instance_id
-- to be the default '00000000-0000-0000-0000-000000000000'. Use cost factor 10
-- for bcrypt (gen_salt default is 6, which GoTrue local rejects).
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token,
  email_change, email_change_token_new, email_change_token_current,
  phone_change, phone_change_token, reauthentication_token,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user, is_anonymous
) VALUES
  ('501f1bd9-127e-4515-9434-269ce3ae8bb7',
   '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated',
   'admin@kadath.fr', crypt('Admin0000!', gen_salt('bf', 10)),
   now(), '', '', '', '', '', '', '', '',
   now(), now(), '{}', '{}', false, false, false),
  ('d859c080-d0b3-407d-8efd-22ac5528beed',
   '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated',
   'editor@kadath.fr', crypt('Editor1111!', gen_salt('bf', 10)),
   now(), '', '', '', '', '', '', '', '',
   now(), now(), '{}', '{}', false, false, false),
  ('9472471e-bc06-4992-93c3-b31065347fdb',
   '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated',
   'client1@test.fr', crypt('Client3333!', gen_salt('bf', 10)),
   now(), '', '', '', '', '', '', '', '',
   now(), now(), '{}', '{}', false, false, false),
  ('c09430c1-c1e8-4676-b1d7-e6b6c7c850a2',
   '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated',
   'client2@test.fr', crypt('Client4444!', gen_salt('bf', 10)),
   now(), '', '', '', '', '', '', '', '',
   now(), now(), '{}', '{}', false, false, false)
ON CONFLICT (id) DO NOTHING;

-- ─── Settings globaux ────────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('quote_prefix',       'DEVIS')               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('invoice_prefix',     'FACT')                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('currency',           'EUR')                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('payment_terms_days', '30')                  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('default_tjm',        '500')                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('legal_name',         'Steph Dev')           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('legal_address',      '75000 Paris, France') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('legal_siret',        '000 000 000 00000')   ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO settings (key, value) VALUES
  ('legal_vat',          'FR00000000000')       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ─── Admin users ─────────────────────────────────────────────────────────
INSERT INTO admin_users (id, role, first_name, last_name, email) VALUES
  ('501f1bd9-127e-4515-9434-269ce3ae8bb7', 'admin',  'Steph',   'Dev',     'admin@kadath.fr'),
  ('d859c080-d0b3-407d-8efd-22ac5528beed', 'editor', 'Éditeur', 'Test',    'editor@kadath.fr')
ON CONFLICT (id) DO NOTHING;

-- ─── Sync app_metadata role → auth.users ─────────────────────────────────
UPDATE auth.users
SET raw_app_meta_data = jsonb_build_object('role', au.role)
FROM public.admin_users au
WHERE auth.users.id = au.id;

-- ─── Tags CMS ────────────────────────────────────────────────────────────
INSERT INTO tags (id, name, slug) VALUES
  ('00000010-0000-0000-0000-000000000001', 'Next.js',    'nextjs'),
  ('00000010-0000-0000-0000-000000000002', 'Supabase',   'supabase'),
  ('00000010-0000-0000-0000-000000000003', 'TypeScript', 'typescript'),
  ('00000010-0000-0000-0000-000000000004', 'Freelance',  'freelance')
ON CONFLICT (slug) DO NOTHING;

-- ─── Pages CMS ───────────────────────────────────────────────────────────
INSERT INTO cms_pages (
  id, author_id, slug, title, resume, template, lang,
  sections, galerie, published, published_at,
  show_in_menu, menu_order, robots
) VALUES
  ('00000020-0000-0000-0000-000000000001','501f1bd9-127e-4515-9434-269ce3ae8bb7','homepage','Accueil','Développeur freelance Next.js & Supabase','landing','fr','[]','[]',true,now(),true,1,'index,follow'),
  ('00000020-0000-0000-0000-000000000002','501f1bd9-127e-4515-9434-269ce3ae8bb7','services','Services','Mes prestations de développement web','default','fr','[]','[]',true,now(),true,2,'index,follow'),
  ('00000020-0000-0000-0000-000000000003','501f1bd9-127e-4515-9434-269ce3ae8bb7','contact','Contact','Parlons de votre projet','contact','fr','[]','[]',true,now(),true,3,'index,follow'),
  ('00000020-0000-0000-0000-000000000004','501f1bd9-127e-4515-9434-269ce3ae8bb7','mentions-legales','Mentions légales',null,'default','fr','[]','[]',true,now(),false,0,'noindex,nofollow')
ON CONFLICT (slug) DO NOTHING;

-- ─── Clients ─────────────────────────────────────────────────────────────
INSERT INTO clients (id, auth_user_id, first_name, last_name, email, phone, activity, status, source, notes) VALUES
  ('00000030-0000-0000-0000-000000000001','9472471e-bc06-4992-93c3-b31065347fdb','Marie','Dupont','client1@test.fr','06 01 02 03 04','E-commerce mode','active','portfolio','Cliente très réactive, préfère les échanges par message.'),
  ('00000030-0000-0000-0000-000000000002','c09430c1-c1e8-4676-b1d7-e6b6c7c850a2','Thomas','Martin','client2@test.fr','06 05 06 07 08','SaaS B2B','active','referral','Projet ambitieux, budget confortable.'),
  ('00000030-0000-0000-0000-000000000003',null,'Sophie','Bernard','client3@test.fr','06 09 10 11 12','Restaurant gastronomique','prospect','linkedin','Intéressée par une refonte complète. Pas encore de compte client.')
ON CONFLICT (id) DO NOTHING;

-- ─── Projets ─────────────────────────────────────────────────────────────
INSERT INTO projects (id, client_id, title, description, status, start_date, end_date) VALUES
  ('00000040-0000-0000-0000-000000000001','00000030-0000-0000-0000-000000000001','Refonte boutique en ligne','Migration Shopify vers Next.js + Supabase avec espace client personnalisé.','active','2026-01-15','2026-04-30'),
  ('00000040-0000-0000-0000-000000000002','00000030-0000-0000-0000-000000000001','Maintenance mensuelle','Contrat de maintenance et évolutions mineures.','active','2026-05-01',null),
  ('00000040-0000-0000-0000-000000000003','00000030-0000-0000-0000-000000000002','Dashboard SaaS','Développement tableau de bord analytique avec authentification multi-tenant.','active','2026-02-01','2026-06-30'),
  ('00000040-0000-0000-0000-000000000004','00000030-0000-0000-0000-000000000003','Site vitrine restaurant','Site one-page avec menu, réservation et galerie photo.','draft',null,null)
ON CONFLICT (id) DO NOTHING;

-- ─── Devis ───────────────────────────────────────────────────────────────
INSERT INTO quotes (id, project_id, number, status, amount_ht, tva_rate, issued_at, valid_until) VALUES
  ('00000050-0000-0000-0000-000000000001','00000040-0000-0000-0000-000000000001','DEVIS-2026-0001','accepted',4800.00,20.00,'2026-01-10','2026-02-10'),
  ('00000050-0000-0000-0000-000000000002','00000040-0000-0000-0000-000000000003','DEVIS-2026-0002','sent',12000.00,20.00,'2026-01-25','2026-02-25'),
  ('00000050-0000-0000-0000-000000000003','00000040-0000-0000-0000-000000000004','DEVIS-2026-0003','draft',2400.00,20.00,'2026-03-01','2026-04-01')
ON CONFLICT (id) DO NOTHING;

-- ─── Lignes de devis ─────────────────────────────────────────────────────
INSERT INTO quote_lines (id, quote_id, description, quantity, unit_price, tva_rate, order_index) VALUES
  ('00000060-0000-0000-0000-000000000001','00000050-0000-0000-0000-000000000001','Développement frontend Next.js',6,500.00,20.00,1),
  ('00000060-0000-0000-0000-000000000002','00000050-0000-0000-0000-000000000001','Intégration Supabase + Auth',2,500.00,20.00,2),
  ('00000060-0000-0000-0000-000000000003','00000050-0000-0000-0000-000000000001','Déploiement Firebase',0.8,500.00,20.00,3),
  ('00000060-0000-0000-0000-000000000004','00000050-0000-0000-0000-000000000002','Architecture & conception',4,500.00,20.00,1),
  ('00000060-0000-0000-0000-000000000005','00000050-0000-0000-0000-000000000002','Développement dashboard',16,500.00,20.00,2),
  ('00000060-0000-0000-0000-000000000006','00000050-0000-0000-0000-000000000002','Tests & déploiement',4,500.00,20.00,3),
  ('00000060-0000-0000-0000-000000000007','00000050-0000-0000-0000-000000000003','Site one-page Next.js',4,500.00,20.00,1),
  ('00000060-0000-0000-0000-000000000008','00000050-0000-0000-0000-000000000003','Formulaire réservation',0.8,500.00,20.00,2)
ON CONFLICT (id) DO NOTHING;

-- ─── Factures ────────────────────────────────────────────────────────────
INSERT INTO invoices (id, project_id, quote_id, number, status, amount_ht, tva_rate, issued_at, due_at) VALUES
  ('00000070-0000-0000-0000-000000000001','00000040-0000-0000-0000-000000000001','00000050-0000-0000-0000-000000000001','FACT-2026-0001','partial',4800.00,20.00,'2026-01-15','2026-02-15'),
  ('00000070-0000-0000-0000-000000000002','00000040-0000-0000-0000-000000000002',null,'FACT-2026-0002','paid',500.00,20.00,'2026-02-01','2026-03-01'),
  ('00000070-0000-0000-0000-000000000003','00000040-0000-0000-0000-000000000002',null,'FACT-2026-0003','overdue',500.00,20.00,'2026-03-01','2026-03-31')
ON CONFLICT (id) DO NOTHING;

-- ─── Lignes de factures ───────────────────────────────────────────────────
INSERT INTO invoice_lines (id, invoice_id, description, quantity, unit_price, tva_rate, order_index) VALUES
  ('00000080-0000-0000-0000-000000000001','00000070-0000-0000-0000-000000000001','Acompte 50% — Refonte boutique',1,2400.00,20.00,1),
  ('00000080-0000-0000-0000-000000000002','00000070-0000-0000-0000-000000000002','Maintenance février 2026',1,500.00,20.00,1),
  ('00000080-0000-0000-0000-000000000003','00000070-0000-0000-0000-000000000003','Maintenance mars 2026',1,500.00,20.00,1)
ON CONFLICT (id) DO NOTHING;

-- ─── Paiements ───────────────────────────────────────────────────────────
INSERT INTO payments (id, invoice_id, type, method, amount, paid_at) VALUES
  ('00000090-0000-0000-0000-000000000001','00000070-0000-0000-0000-000000000001','deposit','stripe',2400.00,'2026-01-16'),
  ('00000090-0000-0000-0000-000000000002','00000070-0000-0000-0000-000000000002','full','bank_transfer',600.00,'2026-02-10')
ON CONFLICT (id) DO NOTHING;

-- ─── Messages ────────────────────────────────────────────────────────────
INSERT INTO messages (id, project_id, author_id, author_type, content) VALUES
  ('000000a0-0000-0000-0000-000000000001','00000040-0000-0000-0000-000000000001','501f1bd9-127e-4515-9434-269ce3ae8bb7','admin','Bonjour Marie, le scaffold du projet est prêt. Je commence l''intégration des maquettes cette semaine.'),
  ('000000a0-0000-0000-0000-000000000002','00000040-0000-0000-0000-000000000001','9472471e-bc06-4992-93c3-b31065347fdb','client','Super, merci ! Est-ce qu''on peut prévoir un point jeudi ?'),
  ('000000a0-0000-0000-0000-000000000003','00000040-0000-0000-0000-000000000003','501f1bd9-127e-4515-9434-269ce3ae8bb7','admin','Thomas, voici le devis pour le dashboard SaaS. N''hésitez pas si vous avez des questions.')
ON CONFLICT (id) DO NOTHING;

-- ─── Numérotation — init compteurs 2026 ──────────────────────────────────
INSERT INTO numbering_counters (doc_type, year, counter) VALUES
  ('quote',   2026, 3),
  ('invoice', 2026, 3)
ON CONFLICT (doc_type, year) DO UPDATE SET counter = EXCLUDED.counter;
