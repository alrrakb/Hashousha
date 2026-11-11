-- Migration: Add variants column to dishes and seed 6 official categories
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS variants JSONB;

-- Replace categories with the 6 sovereign categories
DELETE FROM categories;
INSERT INTO categories (id, name, english_name, slug, sort_order, is_active) VALUES
  ('plain-dough-babka', 'البابكا بعجين ساده', 'Plain Dough Babka', 'plain-dough-babka', 10, true),
  ('cocoa-dough-babka', 'البابكا بعجين كاكاو', 'Cocoa Dough Babka', 'cocoa-dough-babka', 20, true),
  ('sweet-babka', 'البابكا الحلوه', 'Sweet Babka', 'sweet-babka', 30, true),
  ('savory-babka', 'البابكا المالحة', 'Savory Babka', 'savory-babka', 40, true),
  ('babka-boxes', 'بوكسات البابكا', 'Babka Boxes', 'babka-boxes', 50, true),
  ('cookies', 'الكوكيز', 'Artisanal Cookies', 'cookies', 60, true);
