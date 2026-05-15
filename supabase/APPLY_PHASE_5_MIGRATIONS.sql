-- ============================================================
-- PHASE 5 — APPLY MIGRATIONS 0013 → 0017
-- ============================================================
-- Run this whole file once in Supabase SQL Editor:
--   https://app.supabase.com/project/qhjnfwizkvvjbbmtpxha/sql/new
-- Paste, click "Run", expect "Success. No rows returned."
-- Idempotent — safe to run twice if interrupted.
-- ============================================================

-- ─── 0013 — rename samina_quote → agent_quote ─────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='communities' AND column_name='samina_quote'
  ) THEN
    ALTER TABLE communities RENAME COLUMN samina_quote TO agent_quote;
  END IF;
END $$;

-- ─── 0014 — page_blocks ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_blocks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key     text NOT NULL,
  block_type   text NOT NULL,
  position     integer NOT NULL DEFAULT 0,
  enabled      boolean NOT NULL DEFAULT true,
  data         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_position ON page_blocks (page_key, position);
CREATE INDEX IF NOT EXISTS idx_page_blocks_enabled ON page_blocks (page_key, enabled, position);
CREATE OR REPLACE FUNCTION set_page_blocks_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_page_blocks_updated_at ON page_blocks;
CREATE TRIGGER trg_page_blocks_updated_at BEFORE UPDATE ON page_blocks
  FOR EACH ROW EXECUTE FUNCTION set_page_blocks_updated_at();
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team can read page_blocks" ON page_blocks;
CREATE POLICY "team can read page_blocks" ON page_blocks FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "team can write page_blocks" ON page_blocks;
CREATE POLICY "team can write page_blocks" ON page_blocks TO authenticated USING (true) WITH CHECK (true);

-- ─── 0015 — custom pages ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  slug          text PRIMARY KEY,
  title         text NOT NULL,
  description   text,
  published     boolean NOT NULL DEFAULT false,
  show_in_nav   boolean NOT NULL DEFAULT false,
  nav_order     integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pages_nav ON pages (show_in_nav, nav_order) WHERE published = true;
CREATE OR REPLACE FUNCTION set_pages_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_pages_updated_at ON pages;
CREATE TRIGGER trg_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION set_pages_updated_at();
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team can read pages" ON pages;
CREATE POLICY "team can read pages" ON pages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "team can write pages" ON pages;
CREATE POLICY "team can write pages" ON pages TO authenticated USING (true) WITH CHECK (true);

-- ─── 0016 — site_settings + page_meta (Samina-seeded) ─────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                              integer PRIMARY KEY DEFAULT 1,
  phone                           text,
  phone_href                      text,
  email                           text,
  email_href                      text,
  brokerage_office_name           text,
  brokerage_office_street         text,
  brokerage_office_city_state_zip text,
  brokerage_office_phone          text,
  brokerage_office_phone_href     text,
  license_va                      text,
  license_md                      text,
  license_dc                      text,
  instagram_url                   text,
  facebook_url                    text,
  tiktok_url                      text,
  youtube_url                     text,
  linkedin_url                    text,
  fixed_nav                       jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

UPDATE site_settings
SET
  phone                           = COALESCE(phone, '(703) 973-7036'),
  phone_href                      = COALESCE(phone_href, 'tel:+17039737036'),
  email                           = COALESCE(email, 'samina@saminarealtor.com'),
  email_href                      = COALESCE(email_href, 'mailto:samina@saminarealtor.com'),
  brokerage_office_name           = COALESCE(brokerage_office_name, 'RE/MAX Galaxy'),
  brokerage_office_street         = COALESCE(brokerage_office_street, '12781 Darby Brook Court, Suite 102'),
  brokerage_office_city_state_zip = COALESCE(brokerage_office_city_state_zip, 'Woodbridge, VA 22192'),
  brokerage_office_phone          = COALESCE(brokerage_office_phone, '(703) 491-9570'),
  brokerage_office_phone_href     = COALESCE(brokerage_office_phone_href, 'tel:+17034919570'),
  license_va                      = COALESCE(license_va, '0225256757'),
  license_md                      = COALESCE(license_md, '[license pending]'),
  instagram_url                   = COALESCE(instagram_url, 'https://www.instagram.com/homewithsamina/'),
  facebook_url                    = COALESCE(facebook_url, 'https://www.facebook.com/SaminaBilalRealtor/'),
  tiktok_url                      = COALESCE(tiktok_url, 'https://www.tiktok.com/@samina.realtor')
WHERE id = 1;

UPDATE site_settings
SET fixed_nav = '[
  {"key":"home","label":"Home","enabled":true,"order":10},
  {"key":"about","label":"About","enabled":true,"order":20},
  {"key":"buyers","label":"Buyers","enabled":true,"order":30},
  {"key":"sellers","label":"Sellers","enabled":true,"order":40},
  {"key":"path-to-ownership","label":"Path to Ownership","enabled":true,"order":50},
  {"key":"communities","label":"Communities","enabled":true,"order":60},
  {"key":"closings","label":"Recent Closings","enabled":true,"order":70},
  {"key":"partners","label":"Trusted Partners","enabled":true,"order":80},
  {"key":"reviews","label":"Reviews","enabled":true,"order":90},
  {"key":"contact","label":"Contact","enabled":true,"order":100}
]'::jsonb
WHERE id = 1 AND (fixed_nav IS NULL OR fixed_nav = '[]'::jsonb);

CREATE TABLE IF NOT EXISTS page_meta (
  page_key    text PRIMARY KEY,
  title       text NOT NULL,
  description text,
  og_image_id uuid REFERENCES media(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO page_meta (page_key, title, description) VALUES
  ('home',              'Samina Bilal | Northern Virginia & Maryland Real Estate',                                  'Make Yourself at Home. Samina Bilal is a licensed Real Estate Specialist with RE/MAX Galaxy, serving Northern Virginia and Maryland from Woodbridge.'),
  ('about',             'About Samina Bilal | RE/MAX Galaxy Real Estate Specialist — VA & MD',                       'Samina Bilal is a Real Estate Specialist with RE/MAX Galaxy, licensed in Virginia and Maryland. Based in Woodbridge, Virginia.'),
  ('buyers',            'Buying a Home | Samina Bilal — Northern Virginia & Maryland Buyer''s Agent',                'First home or fifth — Samina makes the buying process feel calm. Local market knowledge, sharp negotiation, end-to-end representation across Northern Virginia and Maryland.'),
  ('sellers',           'Selling a Home | Samina Bilal — Northern Virginia & Maryland Listing Agent',                'Pricing strategy, professional marketing, and negotiation that protects you. Boutique listing representation across Northern Virginia and Maryland.'),
  ('path-to-ownership', 'Path to Ownership | Samina Bilal',                                                          'Guided pathway to homeownership — credit, mortgage pre-approval, search, offer, close.'),
  ('communities',       'Communities | Northern Virginia Real Estate',                                               'Northern Virginia neighborhoods Samina knows by street name. Real market data for Woodbridge, Dumfries, Ashburn, Lorton, Stafford, and Manassas.'),
  ('closings',          'Recent Closings | Samina Bilal',                                                            'Every home Samina personally represented at the closing table across Northern Virginia and Maryland.'),
  ('reviews',           'Reviews | Samina Bilal',                                                                    'Client reviews and testimonials.'),
  ('partners',          'Trusted Partners | Samina Bilal',                                                           'The lenders, inspectors, insurance agents, and trades Samina trusts with her own clients. Real names, real contact info, no kickbacks.'),
  ('contact',           'Contact | Samina Bilal',                                                                    'Get in touch with Samina Bilal — Real Estate Specialist at RE/MAX Galaxy. Licensed in Virginia and Maryland.'),
  ('privacy',           'Privacy Policy & Disclaimers | Samina Bilal',                                               'Privacy policy, real estate disclaimers, and terms for saminarealtor.com.')
ON CONFLICT (page_key) DO NOTHING;

CREATE OR REPLACE FUNCTION set_site_settings_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_site_settings_updated_at();

CREATE OR REPLACE FUNCTION set_page_meta_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_page_meta_updated_at ON page_meta;
CREATE TRIGGER trg_page_meta_updated_at BEFORE UPDATE ON page_meta
  FOR EACH ROW EXECUTE FUNCTION set_page_meta_updated_at();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_meta     ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team can read site_settings" ON site_settings;
CREATE POLICY "team can read site_settings" ON site_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "team can write site_settings" ON site_settings;
CREATE POLICY "team can write site_settings" ON site_settings TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "team can read page_meta" ON page_meta;
CREATE POLICY "team can read page_meta" ON page_meta FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "team can write page_meta" ON page_meta;
CREATE POLICY "team can write page_meta" ON page_meta TO authenticated USING (true) WITH CHECK (true);

-- ─── 0017 — footer copy + open-house brand color ──────────────
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS footer_copyright           text,
  ADD COLUMN IF NOT EXISTS footer_credit              text,
  ADD COLUMN IF NOT EXISTS footer_newsletter_headline text,
  ADD COLUMN IF NOT EXISTS footer_newsletter_blurb    text;

ALTER TABLE open_houses
  ADD COLUMN IF NOT EXISTS brand_color text;
