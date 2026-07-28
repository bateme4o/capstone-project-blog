# 🚀 Migration Action Plan - Ready to Execute

## ✅ Current Status
- ✅ Supabase project: https://ugbvucelkovciaenodee.supabase.co
- ✅ API key configured in .env
- ✅ App ready to connect
- ⏳ Migrations ready to apply

---

## 📋 What You Need to Do (Next 20 Minutes)

### **Step 1: Open Supabase SQL Editor** (1 min)

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query** button
5. You now have a blank query box

---

### **Step 2: Apply Migration 001** (5 min)

**File**: `supabase/migrations/001_initial_schema.sql`

This creates all 7 tables + indexes + triggers

1. Open the file in your editor
2. Select ALL content (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into Supabase SQL Editor (Ctrl+V)
5. Click **Run** button
6. Wait for: "Query returned 0 rows" ✅

---

### **Step 3: Apply Migration 002** (5 min)

**File**: `supabase/migrations/002_rls_policies.sql`

This enables RLS + security policies on all tables

1. Click **New Query** in SQL Editor
2. Open the file in your editor
3. Select ALL, Copy
4. Paste into new query
5. Click **Run**
6. Wait for success ✅

---

### **Step 4: Apply Migration 003** (5 min)

**File**: `supabase/migrations/003_seed_data.sql`

This creates sample tags + views

1. Click **New Query** in SQL Editor
2. Open the file in your editor
3. Select ALL, Copy
4. Paste into new query
5. Click **Run**
6. Wait for success ✅

---

### **Step 5: Verify All Tables Created** (2 min)

Run this verification query:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Should see 7 tables:**
- ✅ article_tags
- ✅ articles
- ✅ comments
- ✅ photos
- ✅ tags
- ✅ user_profiles
- ✅ users

---

### **Step 6: Test the Connection** (2 min)

```bash
npm run dev
```

**Check browser console (F12 → Console):**

Should see:
```
✅ Supabase configured and ready
```

---

## 🧪 Quick Test (5 min)

1. Go to http://localhost:3000
2. Click **Register**
3. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234
4. Click **Create Account**
5. Should see success + logged in
6. Click **Posts**
7. Click **Create New Post**
8. Add article:
   - Title: My Test Article
   - Excerpt: Testing migrations
   - Content: This works!
   - Image: https://via.placeholder.com/600x300?text=Test
   - Tags: Supabase, Test
9. Click **Save Post**
10. Should see success + article in list ✅

---

## 📊 Quick Reference

| File | Size | What It Does | Time |
|------|------|---|---|
| 001_initial_schema.sql | 6.2 KB | Creates 7 tables + 24 indexes | 5 min |
| 002_rls_policies.sql | 3.9 KB | Enables RLS + 25+ policies | 5 min |
| 003_seed_data.sql | 4.7 KB | Sample tags + 3 views | 5 min |

**Total Time: 20 minutes**

---

## 🎯 Success Criteria

After all steps, check:

- [ ] All 3 migrations run without errors
- [ ] 7 tables exist in database
- [ ] Console shows "✅ Supabase configured"
- [ ] Can register user
- [ ] Can create article
- [ ] Data appears in database

---

## 🐛 If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| Query fails with "already exists" | Migration already applied - skip to next |
| "Relation not found" | Wait for all migrations to complete |
| Console shows warning | Check .env has both URL and KEY filled |
| Can't create article | Make sure you're logged in |

**See APPLY_MIGRATIONS.md for detailed troubleshooting**

---

## 📝 Commands Quick Copy

### Verify Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

### See Users
```sql
SELECT id, email, created_at FROM public.users;
```

### See Articles
```sql
SELECT id, title, slug, status FROM public.articles;
```

### See Tags
```sql
SELECT id, name, slug FROM public.tags;
```

### Check RLS
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' ORDER BY tablename;
```

---

## ✨ You're Ready!

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy-paste migration files in order
4. Run each one
5. Verify success
6. Test the app

**Estimated time: 30 minutes total**

**Start with Migration 001!** 🚀

