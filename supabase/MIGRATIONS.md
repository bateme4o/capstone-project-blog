# Database Migrations History

This document tracks all database migrations applied to the Supabase database. Each migration is versioned and can be rolled back if needed.

## Migration Overview

| # | File | Status | Date | Description |
|---|------|--------|------|-------------|
| 001 | `001_initial_schema.sql` | ✅ Applied | 2024-01-15 | Initial schema with core tables |
| 002 | `002_rls_policies.sql` | ✅ Applied | 2024-01-15 | Row Level Security policies |
| 003 | `003_seed_data.sql` | ✅ Applied | 2024-01-15 | Seed data and views |

---

## Migration Details

### Migration 001: Initial Schema
**File**: `001_initial_schema.sql`  
**Status**: Active  
**Purpose**: Create the core database structure

**Tables Created**:
- `users` - User accounts linked to auth.users
- `user_profiles` - Extended user information
- `articles` - Blog posts content
- `photos` - Image storage references
- `tags` - Article categories
- `article_tags` - Many-to-many junction table
- `comments` - User comments on articles

**Indexes Created**: 24 indexes on frequently queried columns

**Functions Created**:
- `update_updated_at_column()` - Automatically updates `updated_at` timestamp

**Triggers Created**: 5 triggers for automatic timestamp management

**Key Features**:
- UUID generation for distributed systems
- Foreign key constraints with cascading deletes
- Automatic timestamp management
- CHECK constraints for status values
- UNIQUE constraints for email and slug

**Rollback**: Not applicable (first migration)

---

### Migration 002: Row Level Security Policies
**File**: `002_rls_policies.sql`  
**Status**: Active  
**Purpose**: Implement security policies for data access control

**RLS Enabled On**:
- `users` table - User account data
- `user_profiles` table - Profile information
- `articles` table - Blog posts
- `photos` table - Image metadata
- `tags` table - Article categories
- `article_tags` table - Tag relationships
- `comments` table - User comments

**Policies by Table**:

**users**:
- View own user data
- Update own user data
- Public can view active users

**user_profiles**:
- Public can view all profiles
- Users can update own profile
- Authenticated users can insert profile

**articles**:
- Public can view published articles
- Authors can view own articles
- Authenticated users can create articles
- Authors can update own articles
- Authors can delete own articles

**photos**:
- Public can view all photos
- Authenticated users can upload
- Users can delete own photos

**tags**:
- Public can view all tags
- Admins can manage tags

**article_tags**:
- Public can view tag relationships
- Authors can manage their article tags

**comments**:
- Public can view approved comments
- Comment authors can view own
- Authenticated users can create comments
- Users can update/delete own comments

**Security Model**:
- Anonymous: Read-only on published content
- Authenticated: Can create/edit own content
- Admin: Full access to all content

---

### Migration 003: Seed Data and Views
**File**: `003_seed_data.sql`  
**Status**: Active  
**Purpose**: Add sample data and create useful database views

**Sample Data Inserted**:
- 10 sample tags for article categorization
- Sample tag descriptions

**Views Created**:

**1. published_articles_with_authors**
- Joins articles with author information
- Aggregates tags, comments, and photo counts
- Filters for published articles only
- Use Case: Homepage article listings

**2. user_statistics**
- Aggregates per-user statistics
- Counts articles, views, comments
- Shows last article date
- Use Case: User profile pages

**3. trending_articles**
- Calculates trending score based on views and comments
- Filters for recent articles (30 days)
- Orders by popularity
- Use Case: Trending section

**Sample Tags**:
```
JavaScript         - JavaScript programming tutorials
Web Development    - Web development best practices
Vite              - Vite build tool and bundler
Bootstrap         - Bootstrap CSS framework
Supabase          - Supabase backend as a service
Database          - Database design and optimization
Authentication    - User authentication and security
Design            - UI/UX design principles
Performance       - Web performance optimization
Tutorial          - Step-by-step tutorials
```

---

## Migration Process

### Applying Migrations

#### Option 1: Supabase Dashboard
1. Go to SQL Editor
2. Click "New Query"
3. Copy-paste migration SQL
4. Click "Run"
5. Verify success

#### Option 2: Supabase CLI
```bash
supabase db push
```

### Verifying Migrations

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Rollback Process

If a migration needs to be reverted:

1. Create a new migration file with opposite changes
2. Document the rollback reason
3. Test in development first
4. Apply rollback migration
5. Update this document

**Note**: For Supabase hosted databases, you cannot undo migrations directly. Create new migrations for corrections.

---

## Future Migrations

### Planned Migrations

- **004_add_likes_table** - User likes/upvotes for articles
- **005_add_followers_table** - User following system
- **006_add_notifications** - User notifications system
- **007_add_search_vectors** - Full-text search optimization
- **008_add_soft_delete** - Soft delete pattern for data recovery

### Migration Template

```sql
-- Migration NNN: Brief description
-- Purpose: What this migration accomplishes
-- Created: YYYY-MM-DD

-- Create new table
CREATE TABLE public.new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- columns...
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_new_table_column ON public.new_table(column);

-- Add RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Policy description" ON public.new_table
  FOR SELECT USING (condition);
```

---

## Performance Optimizations Applied

1. ✅ Strategic indexing on:
   - Foreign keys (article_id, author_id, user_id)
   - Frequently filtered columns (status, published_at, is_featured)
   - Search columns (slug, display_name)

2. ✅ View materialization for:
   - Complex joins
   - Aggregated statistics
   - Trending calculations

3. ✅ Timestamp automation via triggers:
   - Reduces manual updates
   - Ensures data consistency

4. ✅ Cascading deletes:
   - Maintains referential integrity
   - Prevents orphaned records

---

## Data Integrity Measures

| Measure | Implementation | Benefit |
|---------|---|---|
| Foreign Keys | CASCADE DELETE | Auto-cleanup on user deletion |
| Unique Constraints | email, slug | Prevent duplicates |
| NOT NULL | Critical columns | Enforce data requirements |
| CHECK | status values | Valid state enforcement |
| Triggers | updated_at | Automatic audit trails |
| RLS Policies | Per-table rules | Security at database level |

---

## Testing Checklist

Before deploying migrations to production:

- [ ] Run migrations in development environment
- [ ] Verify all tables are created
- [ ] Verify all indexes exist
- [ ] Test RLS policies with different user roles
- [ ] Verify foreign key constraints work
- [ ] Test cascade deletes
- [ ] Verify views return correct data
- [ ] Check trigger functionality
- [ ] Test with realistic data volume
- [ ] Monitor query performance

---

## Common Tasks with Migrations

### Add a New Column to articles

```sql
-- Migration 004: Add category column to articles
ALTER TABLE public.articles
ADD COLUMN category VARCHAR(50) DEFAULT 'general';

CREATE INDEX idx_articles_category ON public.articles(category);
```

### Create a New Table

```sql
-- Migration 005: Create new table
CREATE TABLE public.new_feature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- columns...
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.new_feature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON public.new_feature
  FOR SELECT USING (true);
```

### Modify RLS Policies

```sql
-- Migration 006: Update policy
DROP POLICY IF EXISTS "old_policy" ON public.articles;

CREATE POLICY "new_policy" ON public.articles
  FOR SELECT USING (new_condition);
```

---

## Maintenance

### Regular Tasks

- **Weekly**: Monitor slow queries
- **Monthly**: Analyze table sizes
- **Quarterly**: Reindex large tables
- **Annually**: Backup and test recovery

### Monitoring Queries

```sql
-- Find slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename))
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename) DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## Documentation

- See `DATABASE_SCHEMA.md` for detailed schema information
- See `README.md` for setup instructions
- See individual migration files for SQL syntax

---

## Version Control

All migrations are committed to GitHub in `/supabase/migrations/` directory.

When pulling from GitHub:
```bash
# Sync migrations from repo
git pull origin main

# Apply any new migrations
supabase db push
```

When pushing changes:
```bash
# Create new migration
echo "-- Migration description" > supabase/migrations/NNN_description.sql

# Push to Supabase
supabase db push

# Commit to GitHub
git add supabase/migrations/
git commit -m "Add migration: description"
git push origin main
```

