# Supabase Project Setup & Configuration

## Your Project Details

**Project URL**: https://ugbvucelkovciaenodee.supabase.com

## Step 1: Get Your API Keys

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **capstone-project-blog**
3. Go to **Project Settings** → **API**
4. Copy the following keys:

   - **Anon Key** (Public, safe for frontend)
   - **Service Role Key** (Secret, for server-side only)
   - **Project URL** (already provided above)

## Step 2: Update Environment Variables

Update your `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ugbvucelkovciaenodee.supabase.com
VITE_SUPABASE_KEY=your-anon-key-here
```

**Important**: 
- Use the **Anon Key** for the frontend (VITE_SUPABASE_KEY)
- Never commit `.env` to Git (already in .gitignore)
- Service Role Key should only be used server-side

## Step 3: Apply Database Migrations

### Via Supabase Dashboard (Easiest)

1. Go to https://app.supabase.com → Your Project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy-paste the content of each migration file in order:

**Migration 1**: `supabase/migrations/001_initial_schema.sql`
- Click **Run**
- Verify success

**Migration 2**: `supabase/migrations/002_rls_policies.sql`
- Click **Run**
- Verify success

**Migration 3**: `supabase/migrations/003_seed_data.sql`
- Click **Run**
- Verify success

### Verify Migrations Applied

In SQL Editor, run this query:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- article_tags
- articles
- comments
- photos
- tags
- user_profiles
- users

## Step 4: Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**

**Bucket 1: articles**
- Name: `articles`
- Privacy: **Public**
- Click **Create bucket**

**Bucket 2: avatars**
- Name: `avatars`
- Privacy: **Public**
- Click **Create bucket**

### Set Bucket Policies (Optional but Recommended)

For public read access, storage buckets allow anyone to read but require auth to write.

## Step 5: Configure Authentication Providers

1. Go to **Authentication** → **Providers** in the left sidebar
2. **Email** should already be enabled (default)

### Optional: Enable Social Providers

To enable social login (Google, GitHub, etc.):

1. **Google OAuth**:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Copy Client ID and Secret
   - Paste in Supabase Auth → Providers → Google

2. **GitHub OAuth**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Copy Client ID and Secret
   - Paste in Supabase Auth → Providers → GitHub

## Step 6: Test the Connection

After setting up .env, your app will automatically connect to Supabase.

### Test in Browser Console

Once the app loads, you'll see:
```
✅ Supabase configured and ready
```

Or if not configured:
```
⚠️ Supabase not configured. Using mock data...
```

### Test Registration

1. Go to http://localhost:3000
2. Click "Register"
3. Create an account with any email and password
4. Should create user in Supabase Auth
5. Should create user_profile in database

### Test Login

1. Log out
2. Click "Login"
3. Login with the registered email
4. Should work with Supabase Auth

### Test Article Creation

1. Login as user
2. Click "Posts" in navbar
3. Click "Create New Post"
4. Fill in details and save
5. Should create article in Supabase database
6. Should create tags if provided

## Step 7: Verify Database Functions

### Check for Users

In SQL Editor, run:
```sql
SELECT id, email, is_admin, created_at FROM public.users LIMIT 10;
```

### Check for User Profiles

```sql
SELECT id, user_id, display_name, created_at FROM public.user_profiles LIMIT 10;
```

### Check for Articles

```sql
SELECT id, title, slug, author_id, status, published_at FROM public.articles LIMIT 10;
```

### Check for Tags

```sql
SELECT id, name, slug FROM public.tags LIMIT 10;
```

### Check Published Articles View

```sql
SELECT * FROM published_articles_with_authors LIMIT 5;
```

## Step 8: Enable Realtime (Optional)

For live updates on comments and articles:

1. Go to **Database** → **Replication** in the left sidebar
2. Check tables for realtime:
   - ✅ articles
   - ✅ comments
   - ✅ user_profiles
3. Click **Update replication settings**

## Troubleshooting

### "Supabase not configured" Message

**Issue**: App shows warning but no error
**Solution**: Check .env file has correct URL and key

```bash
# Check if .env exists
ls .env

# Verify contents (don't share publicly!)
cat .env
```

### RLS Policy Errors

**Issue**: "row level security violated" when creating content
**Solution**: This is expected for anonymous users. Users must be logged in to create content.

### Auth Errors

**Issue**: "invalid api key" or authentication fails
**Solution**: 
- Verify VITE_SUPABASE_KEY is the Anon Key (not Service Role)
- Restart dev server: `npm run dev`
- Check Supabase Auth is enabled in providers

### Database Connection Errors

**Issue**: Database query fails with timeout
**Solution**:
- Verify migrations were applied successfully
- Check tables exist: Run verify query in SQL Editor
- Check RLS policies: Go to Authentication → Policies

### Storage Upload Errors

**Issue**: Upload fails or returns 403
**Solution**:
- Verify bucket exists and is public
- Check bucket policies allow uploads
- Verify user is authenticated

## Common Tasks

### Create a Test User Manually

```sql
-- This creates a user in the database, but not in auth
-- In production, use Supabase Auth API
INSERT INTO public.users (id, email, is_admin, is_active)
VALUES ('test-id-uuid', 'test@example.com', false, true);

INSERT INTO public.user_profiles (user_id, display_name)
VALUES ('test-id-uuid', 'Test User');
```

### Reset All Data (Development Only)

```sql
-- DELETE user data (cascades to all related tables)
DELETE FROM public.users;

-- Reset sequences if using serial IDs
-- TRUNCATE public.articles CASCADE;
```

### Check Active Users

```sql
SELECT 
  u.id,
  u.email,
  up.display_name,
  COUNT(a.id) as article_count,
  u.is_admin,
  u.created_at
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.articles a ON up.id = a.author_id
GROUP BY u.id, up.display_name;
```

### Get Trending Articles

```sql
SELECT * FROM trending_articles LIMIT 10;
```

### Find Articles by Author

```sql
SELECT 
  a.title,
  a.slug,
  a.published_at,
  COUNT(c.id) as comment_count,
  a.view_count
FROM public.articles a
LEFT JOIN public.comments c ON a.id = c.article_id
WHERE a.author_id = 'author-profile-id'
GROUP BY a.id
ORDER BY a.published_at DESC;
```

## Next Steps

1. ✅ Create Supabase Project (Done)
2. ✅ Get API Keys (In progress)
3. ⬜ Update .env with credentials
4. ⬜ Apply migrations via SQL Editor
5. ⬜ Create storage buckets
6. ⬜ Test registration & login
7. ⬜ Test article CRUD
8. ⬜ Deploy to production

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues:
1. Check Supabase Status: https://status.supabase.com
2. Review Supabase Docs
3. Check browser console for errors
4. Check .env configuration
5. Verify migrations applied in SQL Editor

