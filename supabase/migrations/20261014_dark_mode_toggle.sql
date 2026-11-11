-- Migration: Add dark_mode_enabled column to site_content
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS dark_mode_enabled BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.site_content.dark_mode_enabled IS 'Master platform switch for dark mode availability';
