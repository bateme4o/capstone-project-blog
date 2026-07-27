-- Row Level Security (RLS) Policies for Supabase
-- Enable RLS on all tables

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view active users" ON public.users
  FOR SELECT USING (is_active = true);

-- User profiles table policies
CREATE POLICY "Anyone can view public user profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Articles table policies
CREATE POLICY "Anyone can view published articles" ON public.articles
  FOR SELECT USING (status = 'published' OR (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  )));

CREATE POLICY "Authors can view their own articles" ON public.articles
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  ));

CREATE POLICY "Authenticated users can create articles" ON public.articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their own articles" ON public.articles
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  ));

CREATE POLICY "Authors can delete their own articles" ON public.articles
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  ));

-- Photos table policies
CREATE POLICY "Anyone can view photos" ON public.photos
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload photos" ON public.photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own photos" ON public.photos
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = user_id
  ));

-- Tags table policies
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON public.tags
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = true
  ));

-- Article tags policies
CREATE POLICY "Anyone can view article tags" ON public.article_tags
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage article tags" ON public.article_tags
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id IN (
      SELECT author_id FROM public.articles WHERE id = article_id
    )
  ));

-- Comments table policies
CREATE POLICY "Anyone can view approved comments" ON public.comments
  FOR SELECT USING (is_approved = true OR (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  )));

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  ));

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = author_id
  ));
