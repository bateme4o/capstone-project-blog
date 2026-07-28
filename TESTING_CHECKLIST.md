# ✅ Quick Testing Checklist

**Server**: http://localhost:3000  
**Status**: Dev server running

---

## 🚀 **Start Testing Now**

### Step 1: Open Browser
```
http://localhost:3000
```

### Step 2: Check Console (F12)
Should see:
```
✅ Supabase configured and ready
```

---

## 📋 **5-Minute Quick Tests**

### ✅ Test 1: Home Page
- [ ] Homepage loads
- [ ] See "Featured Posts"
- [ ] See Register/Login buttons
- [ ] Navigation bar visible

### ✅ Test 2: Register
- [ ] Click Register
- [ ] Fill form (name, email, password)
- [ ] Account created ✓
- [ ] Auto-logged in ✓
- [ ] See username in navbar ✓

### ✅ Test 3: Create Article
- [ ] Click "Posts" in navbar
- [ ] Click "Create New Post"
- [ ] Fill form:
  - Title: "Test Article"
  - Excerpt: "Testing Supabase"
  - Content: "Article content"
  - Image: https://via.placeholder.com/600x300?text=Test
  - Tags: "Supabase, Testing"
- [ ] Click Save ✓
- [ ] Article appears in grid ✓

### ✅ Test 4: View & Edit
- [ ] Click "View" on your article
- [ ] Article detail page loads ✓
- [ ] Click "Edit" button ✓
- [ ] Change title to "UPDATED"
- [ ] Save ✓
- [ ] Change saved ✓

### ✅ Test 5: Delete
- [ ] Create another article: "Delete Me"
- [ ] Click Delete ✓
- [ ] Confirm deletion ✓
- [ ] Article removed ✓

### ✅ Test 6: Logout & Verify RLS
- [ ] Click name → Logout ✓
- [ ] Back on home page ✓
- [ ] Can see posts (published articles)
- [ ] **NO Edit/Delete buttons** ✓
- [ ] Try clicking article
- [ ] Can view but no edit/delete ✓

---

## 🗄️ **Verify Database Data**

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check users
SELECT COUNT(*) FROM public.users;
-- Should be: 1+ users

-- Check articles
SELECT COUNT(*) FROM public.articles;
-- Should be: 2+ articles

-- Check tags
SELECT COUNT(*) FROM public.tags;
-- Should be: 10+ tags

-- Check views work
SELECT COUNT(*) FROM published_articles_with_authors;
-- Should show your published articles
```

---

## ✅ **Success Indicators**

All these should be TRUE:

- ✅ Supabase configured message in console
- ✅ Can register new user
- ✅ User appears in Supabase users table
- ✅ Can create article
- ✅ Article appears in database
- ✅ Can view article
- ✅ Can edit article
- ✅ Can delete article
- ✅ Anonymous users can see published articles only
- ✅ Edit/delete only visible when logged in
- ✅ Tags are created and linked correctly
- ✅ No major console errors

---

## 🎯 **If Everything Works**

✅ **APP IS PRODUCTION READY!**

Next:
1. Create more test data
2. Test on mobile (responsive)
3. Deploy to production

---

## 🐛 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| "Supabase not configured" | Check .env file has API key |
| Can't register | Check browser console for errors |
| Article won't save | Verify Supabase migrations ran |
| No data showing | Check RLS policies in Supabase |
| 403 errors | Make sure you're logged in |

---

**Ready? Go to http://localhost:3000 and start testing!** 🚀
