# 🚀 Apply Supabase Migrations - Step by Step

## ✅ Prerequisites
- ✅ Supabase project created
- ✅ API key added to .env
- ✅ Ready to apply migrations

---

## 📋 Migration 1: Initial Schema

This creates all 7 database tables with relationships, indexes, and triggers.

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query** button

3. **Copy Migration 1**
   - Open file: `supabase/migrations/001_initial_schema.sql`
   - Select ALL content (Ctrl+A)
   - Copy it (Ctrl+C)

4. **Paste into SQL Editor**
   - Click in the SQL query box
   - Paste the content (Ctrl+V)

5. **Run the Migration**
   - Click **Run** button (or Ctrl+Enter)
   - Wait for success message
   - You should see: `Query returned 0 rows` or success notification

6. **Verify Success**
   ```sql
   -- In a new query, check tables were created:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
   
   Should see:
   - article_tags
   - articles
   - comments
   - photos
   - tags
   - user_profiles
   - users

✅ **Migration 1 Complete!** Move to Migration 2

---

## 📋 Migration 2: Row Level Security Policies

This enables RLS on all tables and sets up security policies.

### Steps:

1. **Click New Query** in SQL Editor

2. **Copy Migration 2**
   - Open file: `supabase/migrations/002_rls_policies.sql`
   - Select ALL and copy

3. **Paste into SQL Editor**
   - Paste into new query box

4. **Run the Migration**
   - Click **Run**
   - Wait for success

5. **Verify Success**
   ```sql
   -- Check RLS is enabled on all tables:
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   ORDER BY tablename;
   ```
   
   Should show `rowsecurity = true` for all tables

✅ **Migration 2 Complete!** Move to Migration 3

---

## 📋 Migration 3: Seed Data and Views

This creates sample tags and useful database views.

### Steps:

1. **Click New Query** in SQL Editor

2. **Copy Migration 3**
   - Open file: `supabase/migrations/003_seed_data.sql`
   - Select ALL and copy

3. **Paste into SQL Editor**
   - Paste into new query box

4. **Run the Migration**
   - Click **Run**
   - Wait for success

5. **Verify Success**
   ```sql
   -- Check views were created:
   SELECT table_name FROM information_schema.tables 
   WHERE table_type = 'VIEW' AND table_schema = 'public';
   ```
   
   Should see:
   - published_articles_with_authors
   - trending_articles
   - user_statistics

   ```sql
   -- Check tags were inserted:
   SELECT count(*) as tag_count FROM public.tags;
   ```
   
   Should return: `10` tags

✅ **All 3 Migrations Complete!** 🎉

---

## 🧪 Test the Connection

### Step 1: Restart Dev Server

```bash
# Stop current server (Ctrl+C if running)
# Then restart:
npm run dev
```

### Step 2: Check Console

Open http://localhost:3000 in browser

Press **F12** to open DevTools → **Console** tab

You should see:
```
✅ Supabase configured and ready
```

If you see warning instead:
```
⚠️ Supabase not configured...
```

Then:
1. Check .env has both values filled
2. Restart dev server
3. Clear browser cache (Ctrl+Shift+Delete)

### Step 3: Test Registration

1. Click **Register** in navbar
2. Fill in:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPassword123
3. Click **Create Account**

**Watch for:**
- Success message appears
- User automatically logged in
- Name appears in navbar

**Behind the scenes:**
- User created in Supabase Auth
- User profile created in database
- Session established

### Step 4: Test Create Article

1. Click **Posts** in navbar
2. Click **Create New Post** button
3. Fill in:
   - Title: My First Article
   - Excerpt: Testing Supabase integration
   - Content: This article is stored in Supabase database
   - Image: https://via.placeholder.com/600x300?text=MyArticle
   - Tags: Supabase, Testing, JavaScript
4. Click **Save Post**

**Watch for:**
- Success message
- Article appears in list
- Tags are displayed

**Behind the scenes:**
- Article inserted into `articles` table
- Tags created in `tags` table
- Tag relationships created in `article_tags` table
- Timestamps auto-generated

### Step 5: Verify Database Content

In Supabase Dashboard → **SQL Editor**, run:

```sql
-- See users created
SELECT id, email, created_at FROM public.users ORDER BY created_at DESC;
```

```sql
-- See user profiles
SELECT id, user_id, display_name FROM public.user_profiles ORDER BY created_at DESC;
```

```sql
-- See articles
SELECT id, title, slug, status, published_at FROM public.articles ORDER BY published_at DESC;
```

```sql
-- See tags
SELECT id, name, slug FROM public.tags ORDER BY name;
```

```sql
-- View published articles with authors
SELECT * FROM published_articles_with_authors LIMIT 5;
```

---

## 🔍 Troubleshooting Migrations

### Issue: "Relation already exists"

**Cause:** Migration already applied before

**Solution:** 
- Check if tables already exist in Supabase
- Don't re-run completed migrations
- Continue to next one

### Issue: "Syntax error" in migration

**Cause:** Incomplete copy-paste or corruption

**Solution:**
1. Clear the query box
2. Open migration file fresh
3. Copy entire content again
4. Re-paste and run

### Issue: Migration runs but no tables appear

**Cause:** Query ran but didn't execute properly

**Solution:**
1. Check browser console for errors
2. Try verification query
3. If tables missing, check migration output for errors
4. Re-run the migration

### Issue: Realtime and Storage issues after migration

**Cause:** Normal - these are configured separately

**Solution:**
- Migrations only create tables/policies
- Storage buckets created manually
- Realtime enabled separately if needed

---

## ✅ Verification Checklist

After all migrations:

- [ ] Migration 1 runs without errors
- [ ] Migration 2 runs without errors
- [ ] Migration 3 runs without errors
- [ ] Verification query shows 7 tables created
- [ ] Verification query shows RLS enabled on all
- [ ] Verification query shows 3 views created
- [ ] Dev server shows "✅ Supabase configured"
- [ ] Can register new user
- [ ] Can create article
- [ ] User profile appears in database
- [ ] Article appears in database
- [ ] Tags appear in database

---

## 📊 Database Structure After Migrations

```
public schema
├── users                          (linked to auth.users)
├── user_profiles                  (extended user info)
├── articles                       (blog posts)
├── photos                         (image references)
├── tags                           (categories)
├── article_tags                   (many-to-many)
├── comments                       (user comments)
├── published_articles_with_authors (view)
├── user_statistics               (view)
└── trending_articles             (view)

With:
- 24 indexes for performance
- 25+ RLS policies for security
- Automatic timestamps via triggers
- Cascading delete relationships
```

---

## 🎯 Next Steps After Migrations

1. ✅ Create storage buckets (articles, avatars)
2. ✅ Configure authentication providers
3. ✅ Test all CRUD operations
4. ✅ Verify RLS policies work
5. ✅ Add more test data
6. ✅ Deploy to production

---

## 💡 Tips

1. **Copy entire migration file** - Don't partial copy
2. **Run migrations in order** - 001, 002, 003
3. **Wait for success** - Don't click run twice
4. **Verify after each** - Run verification query
5. **Check errors carefully** - Read error messages
6. **Use SQL Editor frequently** - Explore your data

---

## 📞 Need Help?

If migrations fail:

1. Check error message in Supabase
2. Read error text carefully
3. Try verification query to see current state
4. Check if migration already applied
5. See SETUP_STEPS.md troubleshooting section

---

**Ready? Start with Migration 1!** 🚀

