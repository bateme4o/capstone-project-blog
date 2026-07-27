# Supabase Backend Setup

This directory contains the database schema, migrations, and configuration for the Blog App's Supabase backend.

## Directory Structure

```
supabase/
├── migrations/              # Database migrations
│   ├── 001_initial_schema.sql    # Core tables and indexes
│   ├── 002_rls_policies.sql      # Row Level Security
│   └── 003_seed_data.sql         # Sample data and views
├── DATABASE_SCHEMA.md       # Complete schema documentation
├── README.md                # This file
└── config.toml              # Supabase local development config (optional)
```

## Getting Started with Supabase

### Prerequisites
- Supabase account (https://supabase.com)
- Project created on Supabase
- Supabase CLI (optional, for local development)

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: capstone-project-blog
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
4. Wait for project initialization
5. Copy your project credentials:
   - **Project URL**: `https://[project-id].supabase.co`
   - **Anon Key**: Found in Project Settings → API
   - **Service Role Key**: Found in Project Settings → API (keep secret!)

### Step 2: Set Up Local Environment Variables

Update `.env` in the project root:

```env
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

### Step 3: Apply Database Migrations

#### Option A: Using Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy-paste the content of each migration file in order:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_rls_policies.sql`
   - `migrations/003_seed_data.sql`
4. Execute each migration
5. Verify tables are created

#### Option B: Using Supabase CLI (Local Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref [your-project-id]

# Push migrations to Supabase
supabase push

# Pull migrations from Supabase (after creating schema in dashboard)
supabase pull
```

### Step 4: Enable Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable desired providers:
   - Email (default)
   - Google
   - GitHub
   - Others as needed

### Step 5: Set Up Storage Buckets

1. Go to Supabase Dashboard → Storage
2. Create bucket: `articles`
   - Make public for easier access
3. Create bucket: `avatars`
   - For user profile photos

### Step 6: Enable Realtime (Optional)

For live updates on comments and articles:

1. Go to Supabase Dashboard → Database → Replication
2. Enable tables: `articles`, `comments`, `user_profiles`
3. Restart publish services

## Database Tables

### Core Tables (4+)

1. **users** - Linked to Supabase auth.users
2. **user_profiles** - Extended user information
3. **articles** - Blog posts
4. **photos** - Image storage references

### Bonus Tables

5. **tags** - Article categories
6. **article_tags** - Many-to-many relationships
7. **comments** - User comments on articles

## Key Features

### Authentication
- Supabase Auth handles user registration, login, logout
- Token-based JWT authentication
- Session management

### Database
- PostgreSQL with UUID primary keys
- Foreign key relationships
- Row Level Security (RLS) policies
- Automatic timestamps with triggers

### Storage
- Supabase Storage for image uploads
- Organize by buckets (articles, avatars)
- Public/private file access control

### Realtime (Optional)
- Listen to database changes in real-time
- Useful for comments, notifications

## RLS Security Model

### Anonymous Users (Not Authenticated)
- Can view published articles
- Can view public user profiles
- Can view tags
- Cannot create/edit/delete content

### Authenticated Users
- Can create articles and comments
- Can upload photos
- Can update own profile
- Cannot modify others' content

### Admin Users
- Can manage tags
- Can moderate comments
- Can feature articles
- Full access to content management

## API Endpoints (via Supabase)

All interactions go through Supabase JavaScript client:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

// Examples
await supabase.from('articles').select();
await supabase.from('articles').insert({ ... });
await supabase.auth.signUp({ email, password });
```

## Common Tasks

### Create a New Article
```javascript
const { data, error } = await supabase
  .from('articles')
  .insert({
    author_id: userProfileId,
    title: 'My Article',
    slug: 'my-article',
    excerpt: '...',
    content: '...',
    status: 'published'
  });
```

### Upload an Image
```javascript
const { data, error } = await supabase
  .storage
  .from('articles')
  .upload(`${articleId}/image.jpg`, file);
```

### Get Published Articles with Authors
```javascript
const { data } = await supabase
  .from('published_articles_with_authors')
  .select('*')
  .order('published_at', { ascending: false });
```

### Add a Comment
```javascript
const { data, error } = await supabase
  .from('comments')
  .insert({
    article_id: articleId,
    author_id: userProfileId,
    content: 'Great article!'
  });
```

## Troubleshooting

### RLS Policy Errors
- Ensure user is authenticated
- Check that your user_id matches policy conditions
- Verify RLS is enabled on the table

### Foreign Key Errors
- Ensure parent record exists before inserting child
- Check table names and column references

### Storage Errors
- Verify bucket exists
- Check file path syntax
- Ensure storage bucket RLS policies are correct

### Auth Errors
- Verify VITE_SUPABASE_KEY is valid anon key
- Check email/password format
- Ensure provider is enabled

## Migrations Management

### Adding New Migrations

1. Create new file: `migrations/004_your_migration.sql`
2. Write SQL changes
3. Test locally if using CLI
4. Execute in Supabase Dashboard
5. Commit to Git

### Migration Naming Convention

```
NNN_description.sql

Where NNN is sequential number:
001_initial_schema.sql
002_rls_policies.sql
003_seed_data.sql
004_add_likes_table.sql
```

## Best Practices

1. ✅ Always use migrations for schema changes
2. ✅ Enable RLS on all tables
3. ✅ Use meaningful column names
4. ✅ Add indexes on frequently queried fields
5. ✅ Keep migrations small and focused
6. ✅ Document complex queries and views
7. ✅ Test RLS policies thoroughly
8. ✅ Use transactions for multi-step operations
9. ✅ Never commit secrets (.env files)
10. ✅ Regularly backup production data

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

For issues with Supabase:
- Check [Supabase Status Page](https://status.supabase.com)
- Read [Supabase Docs](https://supabase.com/docs)
- Visit [Supabase Community](https://discord.supabase.com)

For issues with this project:
- Check GitHub Issues
- Create a new issue with details

