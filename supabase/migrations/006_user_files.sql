-- Migration 006: User Files Table
-- Purpose: Track user file uploads to Supabase Storage
-- Created: 2026-07-28

-- User files table for tracking uploads to Supabase Storage
CREATE TABLE IF NOT EXISTS public.user_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  storage_bucket VARCHAR(50) DEFAULT 'articles',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON public.user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_article_id ON public.user_files(article_id);
CREATE INDEX IF NOT EXISTS idx_user_files_created_at ON public.user_files(created_at DESC);

-- Trigger for automatic updated_at timestamp
CREATE TRIGGER update_user_files_updated_at BEFORE UPDATE ON public.user_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on user_files table
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_files

-- Users can view their own files
CREATE POLICY "Users can view their own files" ON public.user_files
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = user_id
    )
  );

-- Admins can view all files
CREATE POLICY "Admins can view all files" ON public.user_files
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files" ON public.user_files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own files
CREATE POLICY "Users can delete their own files" ON public.user_files
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = user_id
    )
  );

-- Admins can delete any files
CREATE POLICY "Admins can delete any files" ON public.user_files
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Notes:
-- file_path format: {user_id}/{filename} - stored in Supabase Storage
-- is_public: true means file is accessible via public URL
-- article_id: optional, links file to an article if it's an article cover image
