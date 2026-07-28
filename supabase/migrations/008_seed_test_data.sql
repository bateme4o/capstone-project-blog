-- Migration 008: Seed Test Data
-- Purpose: Create test posts for development/testing
-- Created: 2026-07-28

-- IMPORTANT SCHEMA NOTE:
-- public.articles.author_id references public.user_profiles(id) -- NOT
-- public.users(id) and NOT the Supabase auth user id. user_profiles.id is
-- an independently generated UUID (DEFAULT uuid_generate_v4()); the auth
-- user id is stored separately in user_profiles.user_id.
--
-- This migration resolves the admin's user_profiles.id from their known
-- auth user id (eeb82ae8-9102-4bf7-a9b5-58b0107c5848) via a DO block, so
-- no manual UUID copy/paste is needed. If no matching user_profiles row
-- exists yet (e.g. the admin registered without the profile bootstrap
-- succeeding), the block raises a clear error instead of silently
-- inserting NULL/wrong ids.

DO $$
DECLARE
  admin_profile_id UUID;
BEGIN
  SELECT id INTO admin_profile_id
  FROM public.user_profiles
  WHERE user_id = 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848';

  IF admin_profile_id IS NULL THEN
    RAISE EXCEPTION 'No user_profiles row found for auth user eeb82ae8-9102-4bf7-a9b5-58b0107c5848. Register/login with that account first so its profile row is created, then re-run this migration.';
  END IF;

  -- ============================================================
  -- TEST ARTICLES (POSTS)
  -- All posts seeded under the admin's profile. Reassign author_id
  -- later once additional test users + profiles exist.
  -- ============================================================

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'getting-started-with-web-dev',
    'Getting Started with Web Development',
    'A beginner''s guide to starting your web development journey.',
    'Web development is an exciting field with endless opportunities. Whether you want to build websites, web applications, or web-based tools, this guide will help you get started.

We''ll cover the fundamentals of HTML, CSS, and JavaScript - the three pillars of web development. By the end of this guide, you''ll have a solid foundation to build upon.',
    'https://via.placeholder.com/600x300?text=Web+Development',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111112',
    'mastering-javascript-async-await',
    'Mastering JavaScript Async/Await',
    'Learn how to write clean, efficient asynchronous JavaScript code using async/await.',
    'Asynchronous programming is a crucial skill for modern JavaScript developers. With async/await, you can write asynchronous code that looks and behaves like synchronous code, making it easier to understand and maintain.

In this article, we''ll explore async/await syntax, error handling, and best practices for using this powerful feature.',
    'https://via.placeholder.com/600x300?text=JavaScript+Async',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111113',
    'database-design-best-practices',
    'Database Design Best Practices',
    'Essential tips for designing scalable and maintainable databases.',
    'Good database design is the foundation of any robust application. In this comprehensive guide, we''ll explore normalization, indexing, and optimization techniques that will help you build databases that perform well and scale gracefully.

We''ll also discuss common pitfalls and how to avoid them.',
    'https://via.placeholder.com/600x300?text=Database+Design',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111114',
    'api-design-patterns',
    'API Design Patterns That Work',
    'Explore proven patterns for designing RESTful APIs that are intuitive and maintainable.',
    'Designing a good API is both an art and a science. It requires understanding your users, thinking about consistency, and planning for the future. This article covers the most important patterns and principles for API design.

From naming conventions to versioning strategies, you''ll learn how to design APIs that stand the test of time.',
    'https://via.placeholder.com/600x300?text=API+Design',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111115',
    'testing-strategies-for-quality-code',
    'Testing Strategies for Quality Code',
    'Comprehensive approaches to testing that ensure your code is reliable and maintainable.',
    'Testing is not just about finding bugs - it''s about building confidence in your code. In this guide, we''ll explore unit testing, integration testing, and end-to-end testing strategies.

We''ll also discuss test-driven development (TDD) and how it can improve your code quality and design.',
    'https://via.placeholder.com/600x300?text=Testing+Strategies',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111116',
    'css-grid-layout-guide',
    'Complete Guide to CSS Grid Layout',
    'Master modern layout techniques with CSS Grid - the most powerful layout tool in CSS.',
    'CSS Grid has revolutionized the way we approach web layout. Unlike Flexbox, which is one-dimensional, Grid is truly two-dimensional, allowing you to control both rows and columns simultaneously.

This guide will take you from CSS Grid basics to advanced techniques, with practical examples you can use in your projects.',
    'https://via.placeholder.com/600x300?text=CSS+Grid',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111117',
    'responsive-web-design-2024',
    'Responsive Web Design in 2024',
    'Modern approaches to building websites that work beautifully on all devices.',
    'Responsive web design is no longer optional - it''s essential. With the majority of web traffic coming from mobile devices, creating responsive experiences is critical.

Learn about mobile-first design, viewport settings, media queries, and modern CSS features that make responsive design easier than ever.',
    'https://via.placeholder.com/600x300?text=Responsive+Design',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111118',
    'git-workflow-best-practices',
    'Git Workflow Best Practices',
    'Streamline your development process with effective Git workflows and strategies.',
    'Git is the industry standard for version control, but many developers only scratch the surface of what it can do. In this article, we''ll explore Git workflows that scale from solo projects to large teams.

We''ll cover branching strategies, commit messages, and collaboration patterns that keep your repository clean and your team productive.',
    'https://via.placeholder.com/600x300?text=Git+Workflow',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111119',
    'docker-containerization-guide',
    'Docker Containerization Guide',
    'Learn Docker and containerization to deploy applications consistently across environments.',
    'Docker has become the standard for containerizing applications. By packaging your application and its dependencies into a container, you ensure it runs the same way everywhere - on your laptop, in testing, and in production.

This guide covers Docker basics, working with images and containers, and orchestrating multiple containers.',
    'https://via.placeholder.com/600x300?text=Docker',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111120',
    'kubernetes-orchestration',
    'Kubernetes for Application Orchestration',
    'Orchestrate containerized applications at scale with Kubernetes.',
    'Kubernetes (k8s) is the industry standard for container orchestration. It automates deployment, scaling, and management of containerized applications, allowing you to run applications reliably at massive scale.

Whether you''re just getting started with Kubernetes or looking to deepen your understanding, this guide covers the essentials and beyond.',
    'https://via.placeholder.com/600x300?text=Kubernetes',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111121',
    'machine-learning-introduction',
    'Introduction to Machine Learning',
    'Get started with machine learning concepts and practical applications.',
    'Machine learning is transforming industries and creating new opportunities for developers. But it doesn''t have to be intimidating. In this introduction, we''ll explore fundamental ML concepts in an accessible way.

We''ll cover supervised vs unsupervised learning, training vs testing, and how to get started with popular ML libraries.',
    'https://via.placeholder.com/600x300?text=Machine+Learning',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.articles (id, slug, title, excerpt, content, featured_image_url, status, published_at, author_id, created_at, updated_at)
  VALUES (
    'a1111111-1111-1111-1111-111111111122',
    'web-security-fundamentals',
    'Web Security Fundamentals',
    'Essential security practices to protect your web applications from common threats.',
    'Security is everyone''s responsibility. As a developer, understanding common web vulnerabilities and how to prevent them is crucial. In this article, we''ll cover the OWASP Top 10 vulnerabilities and practical strategies to defend against them.

From SQL injection to cross-site scripting, you''ll learn how to build secure web applications.',
    'https://via.placeholder.com/600x300?text=Web+Security',
    'published',
    now(),
    admin_profile_id,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

END $$;

-- ============================================================
-- LINK POSTS TO TAGS
-- Tag names below match exactly what migration 003_seed_data.sql seeds:
-- JavaScript, Web Development, Vite, Bootstrap, Supabase, Database,
-- Authentication, Design, Performance, Tutorial.
-- ============================================================

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111111', id FROM public.tags WHERE name IN ('Web Development', 'Tutorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111112', id FROM public.tags WHERE name IN ('JavaScript', 'Tutorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111113', id FROM public.tags WHERE name IN ('Database')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111114', id FROM public.tags WHERE name IN ('Supabase', 'Tutorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111115', id FROM public.tags WHERE name IN ('Tutorial', 'Performance')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111116', id FROM public.tags WHERE name IN ('Design', 'Web Development')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111117', id FROM public.tags WHERE name IN ('Design', 'Web Development')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111118', id FROM public.tags WHERE name IN ('Tutorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111119', id FROM public.tags WHERE name IN ('Tutorial', 'Performance')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111120', id FROM public.tags WHERE name IN ('Performance')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111121', id FROM public.tags WHERE name IN ('Tutorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.article_tags (article_id, tag_id)
SELECT 'a1111111-1111-1111-1111-111111111122', id FROM public.tags WHERE name IN ('Authentication')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUMMARY
-- ============================================================
--
-- Creates 12 test articles, all authored by the admin account
-- (eeb82ae8-9102-4bf7-a9b5-58b0107c5848), resolved to its
-- user_profiles.id via subquery inside the DO block above.
--
-- To create additional distinct test users (Alice, Bob, Carol, David,
-- Emma) and attribute posts to them individually:
-- 1. Create each auth account in Supabase Authentication → Users
-- 2. Log in as each once (or manually insert into user_profiles /
--    user_roles referencing their real auth id) so a user_profiles
--    row exists for them
-- 3. UPDATE public.articles SET author_id = '<their user_profiles.id>'
--    WHERE id = '<article id>' to reassign specific posts
--
