# ⚡ Quick Start Checklist

**Time to complete: 30 minutes**

---

## ✏️ Step 1: Add API Key (2 min)

1. Go to https://app.supabase.com
2. Select your project
3. Click Settings → API
4. Copy the **anon** key
5. Open `.env` in project root
6. Paste after `VITE_SUPABASE_KEY=`

```env
VITE_SUPABASE_URL=https://ugbvucelkovciaenodee.supabase.co
VITE_SUPABASE_KEY=eyJ... (your key)
```

✅ **Done?** Move to Step 2

---

## 🗄️ Step 2: Apply Migrations (10 min)

### Migration 1:
1. Open Supabase Dashboard
2. Click **SQL Editor** → **New Query**
3. Open `supabase/migrations/001_initial_schema.sql`
4. Copy all content
5. Paste into SQL Editor
6. Click **Run**
7. Wait for success ✓

### Migration 2:
1. Click **New Query**
2. Open `supabase/migrations/002_rls_policies.sql`
3. Copy, paste, run ✓

### Migration 3:
1. Click **New Query**
2. Open `supabase/migrations/003_seed_data.sql`
3. Copy, paste, run ✓

✅ **Done?** Verify: SQL Editor → Write this query:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```
Should see: users, user_profiles, articles, photos, tags, article_tags, comments

---

## 📁 Step 3: Create Storage Buckets (3 min)

1. Go to Supabase → **Storage**
2. Click **Create a new bucket**
3. Name: `articles`, Privacy: **Public**, Create
4. Click **Create a new bucket**
5. Name: `avatars`, Privacy: **Public**, Create

✅ **Done?** Move to Step 4

---

## ▶️ Step 4: Run the App (1 min)

```bash
npm run dev
```

Open http://localhost:3000 in browser

Check console (F12) → Should see:
```
✅ Supabase configured and ready
```

✅ **Done?** Move to Step 5

---

## 🧪 Step 5: Test Registration (2 min)

1. Click **Register** in navbar
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234
3. Click **Create Account**
4. Should see success ✓

✅ **Done?** Move to Step 6

---

## 📝 Step 6: Test Create Article (3 min)

1. Click **Posts** in navbar
2. Click **Create New Post**
3. Fill in:
   - Title: My First Article
   - Excerpt: Testing Supabase
   - Content: This is a test...
   - Image: https://via.placeholder.com/600x300?text=Test
   - Tags: JavaScript, Test
4. Click **Save Post**
5. Should see success ✓

✅ **Done?** Move to Step 7

---

## 🔍 Step 7: Test Other Features (5 min)

- [ ] View article (click View button)
- [ ] Edit article (click Edit, change title, save)
- [ ] Go back to Posts list
- [ ] Delete article (click Delete, confirm)
- [ ] Logout (click name → Logout)
- [ ] Login again (use test@example.com / Test1234)
- [ ] View anonymous (private window, should see no Edit/Delete buttons)

✅ **All working?** YOU'RE DONE! 🎉

---

## 📞 If Something Fails

| Problem | Solution |
|---------|----------|
| "Supabase not configured" | Check .env has both URL and KEY |
| "row level security violated" | Make sure you're logged in |
| "no relation" error | Check all 3 migrations ran (verify in SQL) |
| Article won't create | Check form fields are filled, reload page |
| Buckets not created | Make sure privacy is "Public" not "Private" |

See **SETUP_STEPS.md** for detailed troubleshooting

---

## 📚 Documentation

| Need Help? | Read This |
|-----------|-----------|
| Detailed instructions | SETUP_STEPS.md |
| Supabase specific | SUPABASE_SETUP.md |
| Database info | DATABASE_SCHEMA.md |
| Full overview | FINAL_SUMMARY.md |
| Code explanation | README.md |

---

## ✅ Final Checklist

- [ ] API key added to .env
- [ ] All 3 migrations applied
- [ ] Storage buckets created (articles, avatars)
- [ ] Dev server running (`npm run dev`)
- [ ] Console shows "✅ Supabase configured"
- [ ] Can register new user
- [ ] Can create article
- [ ] Can edit article
- [ ] Can delete article
- [ ] Can login/logout
- [ ] Anonymous view works

**All checked? Congratulations! 🎉**

---

## 🚀 What's Next?

Now that everything works:

1. **Explore the app** - Try all features
2. **Check database** - Run verification queries in SQL Editor
3. **Add more test data** - Create several articles
4. **Test security** - Open private window, verify RLS works
5. **Review code** - Check how Supabase is integrated
6. **Plan deployment** - When ready to go live

---

## 💻 Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Remember

✨ Your app works **offline** (uses mock data) if Supabase isn't configured
✨ Once .env is set, it automatically uses Supabase
✨ Data is always saved to your database
✨ Everything is documented in the repo

**Happy coding! 🚀**
