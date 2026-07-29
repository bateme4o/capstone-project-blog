-- Migration 010: Fix Role Privilege Escalation
-- Purpose: Close a hole in the user_roles INSERT policy that let ANY
--          authenticated user grant themselves (or anyone) the admin role,
--          then reset roles so only bateme4o@gmail.com is admin.
-- Created: 2026-07-28
--
-- ROOT CAUSE:
-- Migration 004 created this policy:
--   CREATE POLICY "Authenticated users can insert their role" ON public.user_roles
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
--
-- WITH CHECK only verifies the caller is logged in - it never checks that
-- user_id = auth.uid(), and never restricts role to 'user'. Any authenticated
-- user could call supabase.from('user_roles').insert({ user_id: <own id>,
-- role: 'admin' }) directly from the browser and self-grant admin, which is
-- what happened to a newly registered account. Once admin, the existing
-- "Admins can manage any articles" policy legitimately grants full edit/
-- delete on every post, which is what was observed.

-- ============================================================
-- STEP 1: Audit current roles (informational)
-- ============================================================
SELECT u.email, ur.role, ur.assigned_at
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
ORDER BY ur.role DESC, u.email;

-- ============================================================
-- STEP 2: Demote every admin except bateme4o@gmail.com
-- ============================================================
UPDATE public.user_roles
SET role = 'user'
WHERE role = 'admin'
  AND user_id NOT IN (SELECT id FROM public.users WHERE email = 'bateme4o@gmail.com');

-- ============================================================
-- STEP 3: Close the privilege-escalation hole
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert their role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can bootstrap their own default role" ON public.user_roles;

-- Replacement: a user may only insert a role row for THEMSELVES, and only
-- with role = 'user'. Admin-driven role assignment/promotion still works
-- unaffected, via the existing "Admins can assign roles" FOR ALL policy
-- (Postgres RLS policies are OR'ed per command, so the admin's insert is
-- authorized by that policy regardless of this one).
CREATE POLICY "Users can bootstrap their own default role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'user');

-- ============================================================
-- STEP 4: Verify - only bateme4o@gmail.com should be listed
-- ============================================================
SELECT u.email, ur.role
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
