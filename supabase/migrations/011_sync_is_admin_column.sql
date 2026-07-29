-- Migration 011: Sync legacy is_admin column with user_roles
-- Purpose: public.users.is_admin (from migration 001) predates the
--          user_roles RBAC system (migration 004+) and is no longer read
--          by any application code or RLS policy - user_roles.role is the
--          sole source of truth for admin status. The column was left
--          stale (FALSE) for bateme4o@gmail.com, which is confusing even
--          though it has no functional effect. Sync it so it can't mislead
--          anyone inspecting the users table directly.
-- Created: 2026-07-29
--
-- Verified via codebase search: no file under src/js or src/pages reads
-- is_admin. The one RLS policy that used to reference it ("Admins can
-- manage tags" in migration 002) was dropped and recreated against
-- user_roles in migration 007.

UPDATE public.users u
SET is_admin = EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = u.id AND ur.role = 'admin'
);

-- Verify: should show is_admin = TRUE only for bateme4o@gmail.com
SELECT email, is_admin FROM public.users ORDER BY is_admin DESC, email;
