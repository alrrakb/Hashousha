-- Migration: Add highlights and preparation tip columns to dishes table
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS highlights TEXT[];
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS preparation_tip TEXT;
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS show_preparation_tip BOOLEAN DEFAULT true;
