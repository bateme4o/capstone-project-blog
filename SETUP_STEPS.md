# Complete Supabase Integration Setup - Step by Step

## Current Status
✅ Supabase project created: https://ugbvucelkovciaenodee.supabase.com  
✅ Supabase client installed  
✅ supabaseClient.js created  
✅ VITE_SUPABASE_URL configured in .env  
⏳ VITE_SUPABASE_KEY: **PENDING** (needs your API key)

---

## 🔑 Step 1: Get Your Anon API Key

1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project (should see it in the list)
3. Click **Project Settings** in the left sidebar (gear icon)
4. Click **API** tab
5. Find the **"anon"** key under "Project API keys"
6. Click the copy icon to copy the key

**Your URL is already set to:**
```
https://ugbvucelkovciaenodee.supabase.com
```

---

## ✏️ Step 2: Add Your API Key to .env

Once you have the Anon key:

1. Open `.env` file in the project root
2. Find this line:
```env
VITE_SUPABASE_KEY=
```

3. Paste your API key after the `=`:
```env
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
```

4. **DO NOT commit this to Git** (already protected by .gitignore)
5. **DO NOT share this key** (it's still safe for frontend use)

---

## 🗄️ Step 3: Apply Database Migrations

The migrations create all 7 tables with relationships, indexes, and security policies.

### via Supabase Dashboard (Recommended for First Time)

1. Go to your Supabase project: https://app.supabase.com
2. Click **SQL Editor** in the left sidebar
3. Click **New Query** button
4. Copy the entire content of: `supabase/migrations/001_initial_schema.sql`
5. Paste into the query editor
6. Click the **Run** button (or press Ctrl+Enter)
7. Wait for success message
8. Check the **Query Result** shows success

**Repeat for the other 2 migrations:**
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_seed_data.sql`

### Verify Migrations Worked

In SQL Editor, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- ✅ article_tags
- ✅ articles
- ✅ comments
- ✅ photos
- ✅ tags
- ✅ user_profiles
- ✅ users

---

## 📁 Step 4: Create Storage Buckets

Storage buckets hold uploaded images for articles and user avatars.

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket**

### Create "articles" bucket:
- **Bucket name**: `articles`
- **Privacy**: Select **Public** (anyone can view)
- Click **Create bucket**

### Create "avatars" bucket:
- **Bucket name**: `avatars`
- **Privacy**: Select **Public** (anyone can view)
- Click **Create bucket**

You should now see both buckets in the Storage list.

---

## 🔐 Step 5: Enable Authentication

Email authentication is enabled by default. Optional social login:

### Email (Default - Already Enabled)
- Users can register with email/password
- Built-in

### Optional: Google OAuth

If you want to enable Google login:

1. Create OAuth credentials at https://console.cloud.google.com
2. In Supabase: **Authentication** → **Providers** → **Google**
3. Paste your Google OAuth credentials
4. Enable and save

(Similar process for GitHub, etc.)

---

## 🧪 Step 6: Test Everything Works

### Restart Dev Server

```bash
# Stop current server (Ctrl+C if running)
# Then:
npm run dev
```

### Check Browser Console

Open DevTools (F12) → Console tab

You should see:
```
✅ Supabase configured and ready
```

If you see warning instead, double-check .env values.

### Test User Registration

1. Go to http://localhost:3000
2. Click **Register** in navbar
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
4. Click "Create Account"
5. Should show: "Account created successfully!"

**What happens:**
- User created in Supabase Auth
- User profile created in database
- User logged in automatically

### Test User Login/Logout

1. Should still be logged in
2. Click your name in navbar → Logout
3. Click **Login**
4. Login with test@example.com / TestPassword123
5. Should show success message

### Test Create Article

1. Logged in as your user
2. Click **Posts** in navbar
3. Click **Create New Post** button
4. Fill in:
   - Title: "My First Article"
   - Excerpt: "Testing the Supabase integration"
   - Content: "This is a test article..."
   - Image URL: https://via.placeholder.com/600x300?text=Test
   - Tags: JavaScript, Testing
5. Click **Save Post**
6. Should show: "Post created successfully"

**What happens:**
- Article created in database
- Tags created/linked
- View count initialized
- Published timestamp set

### Test View Article

1. Back on Posts page
2. Click the new article card or **View** button
3. Should display full article content
4. Click **Edit** button
5. Modify content
6. Click **Save Post**
7. Should update successfully

### Test Delete Article

1. On article page
2. Click **Delete** button
3. Confirm deletion
4. Should be removed from list

---

## 🔍 Step 7: Verify Database Content

After creating articles, verify they're in the database:

### In SQL Editor, run:

**See all users:**
```sql
SELECT id, email, is_admin, created_at FROM public.users;
```

**See all user profiles:**
```sql
SELECT id, user_id, display_name FROM public.user_profiles;
```

**See all articles:**
```sql
SELECT id, title, slug, status, published_at FROM public.articles;
```

**See all tags:**
```sql
SELECT id, name, slug FROM public.tags;
```

**See article-tag relationships:**
```sql
SELECT at.article_id, a.title, t.name 
FROM public.article_tags at
JOIN public.articles a ON at.article_id = a.id
JOIN public.tags t ON at.tag_id = t.id;
```

**View published articles (using the view):**
```sql
SELECT * FROM published_articles_with_authors LIMIT 5;
```

---

## 📊 Step 8: Verify Security Policies

RLS policies control who can see/edit what content.

### Test Anonymous Access

1. Open browser incognito/private window
2. Go to http://localhost:3000
3. Click **Posts**
4. Should see published articles (if any exist)
5. Cannot see **Edit** or **Delete** buttons (not logged in)
6. Cannot create new posts (must login)

### Test User-Only Features

1. Create account in private window
2. Click **Create New Post**
3. Fill in form and save
4. Article should be created and published
5. Should see **Edit** and **Delete** buttons on own articles
6. Cannot edit other users' articles

---

## ✅ Completed Checklist

After all steps, you should have:

- ✅ Supabase project connected
- ✅ API key in .env
- ✅ All 7 database tables created
- ✅ Indexes for performance
- ✅ RLS security policies
- ✅ 3 database views
- ✅ Storage buckets for images
- ✅ Email authentication enabled
- ✅ User registration working
- ✅ User login/logout working
- ✅ Article creation working
- ✅ Article editing working
- ✅ Article deletion working
- ✅ Tag system working
- ✅ Database content verified
- ✅ Security policies verified

---

## 🐛 Troubleshooting

### "Supabase not configured" in console

**Problem**: App shows warning instead of success message

**Solutions**:
1. Check .env file exists
2. Verify both lines are filled:
   ```env
   VITE_SUPABASE_URL=https://ugbvucelkovciaenodee.supabase.com
   VITE_SUPABASE_KEY=eyJ... (your actual key)
   ```
3. Restart dev server: `npm run dev`
4. Clear browser cache: Ctrl+Shift+Delete

### "row level security violated" when creating article

**Problem**: Error when trying to save article

**Solutions**:
1. Ensure you're logged in
2. User profile might not exist:
   - Check user_profiles table has entry for your user_id
   - If missing, migration 001 creates trigger but may need manual insert

### "invalid api key" error

**Problem**: Authentication fails

**Solutions**:
1. Verify key is **Anon Key** (not Service Role Key)
2. Copy key again from Supabase Dashboard
3. Make sure no extra spaces in .env

### "no relation" or table not found

**Problem**: Database queries fail with table errors

**Solutions**:
1. Verify all 3 migrations ran successfully
2. Check tables exist in SQL Editor
3. Restart dev server after migrations

### Image upload not working

**Problem**: Cannot upload images

**Solutions**:
1. Verify storage buckets created
2. Check buckets are Public (not Private)
3. Verify bucket names match exactly:
   - `articles` for article images
   - `avatars` for profile pictures

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `.env` | Credentials (DO NOT commit) |
| `src/js/supabaseClient.js` | Supabase initialization |
| `src/js/auth.js` | Authentication logic (now uses Supabase) |
| `src/js/postService.js` | Article CRUD (now uses Supabase) |
| `supabase/migrations/` | Database schema files |
| `SUPABASE_SETUP.md` | Detailed setup guide |

---

## 🚀 Next Steps After Verification

1. ✅ Test all features work
2. ✅ Verify database has data
3. ✅ Check security policies work
4. 📝 Add comments feature (optional)
5. 📝 Add user profiles (optional)
6. 📝 Deploy to production

---

## 💡 Pro Tips

1. **Backup your Supabase project** before major changes
2. **Use incognito window** to test anonymous access
3. **Check RLS policies** if getting permission errors
4. **Monitor queries** in Supabase Dashboard → Database → Queries
5. **Enable realtime** for live updates (optional)

---

**Setup Complete! Your blog is now connected to Supabase!** 🎉

