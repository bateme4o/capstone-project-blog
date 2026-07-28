-- Migration 009: Sync Test Auth Users + Set Display Names + Assign as Post Authors
-- Purpose: Complete the test-user setup for the 5 accounts created via
--          Supabase Dashboard (Authentication -> Users), which have no
--          public.users / public.user_profiles / public.user_roles rows
--          and no display name yet.
-- Created: 2026-07-28
--
-- Prerequisite: the 5 auth accounts below must already exist in
-- Authentication -> Users (created with "Auto Confirm User" checked):
--   alice@example.com, bob@example.com, carol@example.com,
--   david@example.com, emma@example.com
--
-- This migration is idempotent - safe to re-run.

-- Alice Johnson -> posts 111, 112
DO $$
DECLARE
  auth_id UUID;
  profile_id UUID;
BEGIN
  SELECT id INTO auth_id FROM auth.users WHERE email = 'alice@example.com';
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for alice@example.com. Create it in Authentication -> Users first.';
  END IF;

  INSERT INTO public.users (id, email, is_active, created_at, updated_at)
  VALUES (auth_id, 'alice@example.com', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, display_name, created_at, updated_at)
  VALUES (auth_id, 'Alice Johnson', now(), now())
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now();

  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at, created_at)
  VALUES (auth_id, 'user', 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848', now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO profile_id FROM public.user_profiles WHERE user_id = auth_id;

  UPDATE public.articles SET author_id = profile_id
  WHERE id IN ('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111112');
END $$;

-- Bob Smith -> posts 113, 114, 115
DO $$
DECLARE
  auth_id UUID;
  profile_id UUID;
BEGIN
  SELECT id INTO auth_id FROM auth.users WHERE email = 'bob@example.com';
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for bob@example.com. Create it in Authentication -> Users first.';
  END IF;

  INSERT INTO public.users (id, email, is_active, created_at, updated_at)
  VALUES (auth_id, 'bob@example.com', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, display_name, created_at, updated_at)
  VALUES (auth_id, 'Bob Smith', now(), now())
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now();

  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at, created_at)
  VALUES (auth_id, 'user', 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848', now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO profile_id FROM public.user_profiles WHERE user_id = auth_id;

  UPDATE public.articles SET author_id = profile_id
  WHERE id IN ('a1111111-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111114', 'a1111111-1111-1111-1111-111111111115');
END $$;

-- Carol White -> posts 116, 117
DO $$
DECLARE
  auth_id UUID;
  profile_id UUID;
BEGIN
  SELECT id INTO auth_id FROM auth.users WHERE email = 'carol@example.com';
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for carol@example.com. Create it in Authentication -> Users first.';
  END IF;

  INSERT INTO public.users (id, email, is_active, created_at, updated_at)
  VALUES (auth_id, 'carol@example.com', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, display_name, created_at, updated_at)
  VALUES (auth_id, 'Carol White', now(), now())
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now();

  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at, created_at)
  VALUES (auth_id, 'user', 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848', now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO profile_id FROM public.user_profiles WHERE user_id = auth_id;

  UPDATE public.articles SET author_id = profile_id
  WHERE id IN ('a1111111-1111-1111-1111-111111111116', 'a1111111-1111-1111-1111-111111111117');
END $$;

-- David Brown -> posts 118, 119, 120
DO $$
DECLARE
  auth_id UUID;
  profile_id UUID;
BEGIN
  SELECT id INTO auth_id FROM auth.users WHERE email = 'david@example.com';
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for david@example.com. Create it in Authentication -> Users first.';
  END IF;

  INSERT INTO public.users (id, email, is_active, created_at, updated_at)
  VALUES (auth_id, 'david@example.com', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, display_name, created_at, updated_at)
  VALUES (auth_id, 'David Brown', now(), now())
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now();

  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at, created_at)
  VALUES (auth_id, 'user', 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848', now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO profile_id FROM public.user_profiles WHERE user_id = auth_id;

  UPDATE public.articles SET author_id = profile_id
  WHERE id IN ('a1111111-1111-1111-1111-111111111118', 'a1111111-1111-1111-1111-111111111119', 'a1111111-1111-1111-1111-111111111120');
END $$;

-- Emma Davis -> posts 121, 122
DO $$
DECLARE
  auth_id UUID;
  profile_id UUID;
BEGIN
  SELECT id INTO auth_id FROM auth.users WHERE email = 'emma@example.com';
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for emma@example.com. Create it in Authentication -> Users first.';
  END IF;

  INSERT INTO public.users (id, email, is_active, created_at, updated_at)
  VALUES (auth_id, 'emma@example.com', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, display_name, created_at, updated_at)
  VALUES (auth_id, 'Emma Davis', now(), now())
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now();

  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at, created_at)
  VALUES (auth_id, 'user', 'eeb82ae8-9102-4bf7-a9b5-58b0107c5848', now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO profile_id FROM public.user_profiles WHERE user_id = auth_id;

  UPDATE public.articles SET author_id = profile_id
  WHERE id IN ('a1111111-1111-1111-1111-111111111121', 'a1111111-1111-1111-1111-111111111122');
END $$;

-- Verify results
SELECT u.email, up.display_name, ur.role, count(a.id) as post_count
FROM public.users u
JOIN public.user_profiles up ON up.user_id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.articles a ON a.author_id = up.id
WHERE u.email IN ('alice@example.com', 'bob@example.com', 'carol@example.com', 'david@example.com', 'emma@example.com')
GROUP BY u.email, up.display_name, ur.role
ORDER BY u.email;
