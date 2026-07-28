-- Migration 007: Update RLS Policies for 2-Role System
-- Purpose: Update existing RLS policies to use user_roles table instead of hardcoded email checks
-- Created: 2026-07-28

-- ============================================================
-- ARTICLES TABLE POLICIES (Updated)
-- ============================================================

-- Drop old policies that used hardcoded logic
DROP POLICY IF EXISTS "Authors can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can delete their own articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;

-- New policy: Users can update their own articles
CREATE POLICY "Users can update own articles" ON public.articles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

-- New policy: Users can delete their own articles
CREATE POLICY "Users can delete own articles" ON public.articles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

-- New policy: Admins can manage any articles
CREATE POLICY "Admins can manage any articles" ON public.articles
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- TAGS TABLE POLICIES (Updated)
-- ============================================================

-- Drop old admin policy
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;

-- New policy: Only admins can manage tags
CREATE POLICY "Admins can manage tags" ON public.tags
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- USERS TABLE POLICIES (New)
-- ============================================================

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Admins can update users (e.g., deactivate)
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Admins can delete users
CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- USER_PROFILES TABLE POLICIES (Enhanced)
-- ============================================================

-- Drop old admin policy if it exists
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.user_profiles;

-- Admins can update any user profile
CREATE POLICY "Admins can update any profile" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Admins can delete any user profile (cascades to delete user)
CREATE POLICY "Admins can delete any profile" ON public.user_profiles
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- ARTICLE_TAGS TABLE POLICIES (Updated)
-- ============================================================

-- Drop old policy
DROP POLICY IF EXISTS "Authors can manage article tags" ON public.article_tags;

-- Authors can manage their own article tags
CREATE POLICY "Authors can manage own article tags" ON public.article_tags
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id IN (
        SELECT author_id FROM public.articles WHERE id = article_id
      )
    )
  );

-- Admins can manage any article tags
CREATE POLICY "Admins can manage all article tags" ON public.article_tags
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- COMMENTS TABLE POLICIES (Updated)
-- ============================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

-- Admins can delete any comments
CREATE POLICY "Admins can delete any comments" ON public.comments
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- ============================================================
-- SUMMARY OF CHANGES
-- ============================================================
--
-- 1. Articles: Authors can edit/delete own, admins can do anything
-- 2. Tags: Only admins can manage
-- 3. Users: Only admins can view/edit/delete
-- 4. User Profiles: Admins can manage any profile
-- 5. Article Tags: Authors manage own article tags, admins manage all
-- 6. Comments: Users manage own, admins can delete any
-- 7. Files: Users manage own, admins manage all (migration 006)
-- 8. Audit Logs: Only admins can view (migration 005)
-- 9. User Roles: Users see own, admins see all and can assign (migration 004)
--
-- All policies now use user_roles table for determining admin status
-- No more hardcoded email checks
-- ============================================================
