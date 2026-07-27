-- Seed data for testing and development
-- This migration adds sample users, profiles, articles, photos, and tags

-- Note: In production, this should be optional or removed
-- For auth.users, you'll need to use Supabase Auth UI or Admin API

-- Insert sample users (you'll create these through Supabase Auth in production)
-- For now, we're creating placeholder user_profiles

-- Insert tags
INSERT INTO public.tags (name, slug, description) VALUES
  ('JavaScript', 'javascript', 'JavaScript programming language tutorials and tips'),
  ('Web Development', 'web-development', 'Web development best practices and frameworks'),
  ('Vite', 'vite', 'Vite build tool and bundler'),
  ('Bootstrap', 'bootstrap', 'Bootstrap CSS framework'),
  ('Supabase', 'supabase', 'Supabase backend as a service'),
  ('Database', 'database', 'Database design and optimization'),
  ('Authentication', 'authentication', 'User authentication and security'),
  ('Design', 'design', 'UI/UX design principles and patterns'),
  ('Performance', 'performance', 'Web performance optimization'),
  ('Tutorial', 'tutorial', 'Step-by-step tutorials and guides')
ON CONFLICT (slug) DO NOTHING;

-- Note: The actual user data insertion should be done through Supabase Auth
-- The following is a placeholder structure that shows how to organize the data

-- These sample articles will be inserted after users are created via Supabase Auth
-- For now, we're just showing the schema with comments

/*
Example flow after users are created:

1. User registers via Supabase Auth
2. User profile is created via trigger or your app code
3. User can then create articles like this:

INSERT INTO public.articles (author_id, title, slug, excerpt, content, status, published_at)
VALUES (
  '<user_profile_id>',
  'Getting Started with Vite',
  'getting-started-with-vite',
  'Learn how to build fast and modern web applications with Vite.',
  'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects...',
  'published',
  now()
);

4. Articles can be tagged using article_tags table
5. Photos can be uploaded and linked to articles
6. Comments can be added by other users
*/

-- Create a view for published articles with author info
CREATE OR REPLACE VIEW public.published_articles_with_authors AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.excerpt,
  a.content,
  a.featured_image_url,
  a.view_count,
  a.is_featured,
  a.published_at,
  a.created_at,
  a.updated_at,
  up.id as author_id,
  up.display_name as author_name,
  up.avatar_url as author_avatar,
  u.email as author_email,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
  (SELECT COUNT(*) FROM public.comments WHERE article_id = a.id AND is_approved = true) as comment_count,
  (SELECT COUNT(*) FROM public.photos WHERE article_id = a.id) as photo_count
FROM public.articles a
JOIN public.user_profiles up ON a.author_id = up.id
JOIN public.users u ON up.user_id = u.id
LEFT JOIN public.article_tags at ON a.id = at.article_id
LEFT JOIN public.tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, up.id, up.display_name, up.avatar_url, u.email;

-- Create a view for user statistics
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT
  up.id as user_id,
  up.display_name,
  up.avatar_url,
  COUNT(DISTINCT a.id) as total_articles,
  COALESCE(SUM(a.view_count), 0) as total_views,
  COUNT(DISTINCT c.id) as total_comments,
  MAX(a.published_at) as last_article_date
FROM public.user_profiles up
LEFT JOIN public.articles a ON up.id = a.author_id AND a.status = 'published'
LEFT JOIN public.comments c ON up.id = c.author_id AND c.is_approved = true
GROUP BY up.id, up.display_name, up.avatar_url;

-- Create a view for trending articles (by views and recent activity)
CREATE OR REPLACE VIEW public.trending_articles AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.excerpt,
  a.featured_image_url,
  a.view_count,
  a.published_at,
  a.created_at,
  up.display_name as author_name,
  up.avatar_url as author_avatar,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
  (SELECT COUNT(*) FROM public.comments WHERE article_id = a.id AND is_approved = true) as comment_count,
  -- Simple trending score based on views and recency
  (a.view_count + (SELECT COUNT(*) FROM public.comments WHERE article_id = a.id) * 10) as trending_score
FROM public.articles a
JOIN public.user_profiles up ON a.author_id = up.id
LEFT JOIN public.article_tags at ON a.id = at.article_id
LEFT JOIN public.tags t ON at.tag_id = t.id
WHERE a.status = 'published'
  AND a.published_at >= now() - interval '30 days'
GROUP BY a.id, up.display_name, up.avatar_url
ORDER BY trending_score DESC
LIMIT 20;
