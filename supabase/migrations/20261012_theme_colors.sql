-- Migration: Add theme_colors JSONB column to site_content
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS theme_colors JSONB;
