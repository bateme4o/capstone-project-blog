# Supabase Database Schema Documentation

## Overview

This document describes the complete database schema for the Blog App built on Supabase. The schema follows relational database best practices with proper normalization, indexing, and security considerations.

## Database Design Principles

- **Normalization**: Tables are normalized to reduce redundancy and maintain data integrity
- **Relationships**: Foreign keys establish relationships between tables with cascading deletes
- **Indexing**: Strategic indexes on frequently queried columns for performance
- **Security**: Row Level Security (RLS) policies control data access
- **Timestamps**: All tables include `created_at` and `updated_at` for audit trails
- **UUIDs**: Primary keys use UUIDs for distributed system compatibility

## Tables

### 1. **users** (Linked to Supabase auth.users)

Stores core user account information linked to Supabase authentication.

```sql
id              UUID            PRIMARY KEY (references auth.users)
email           VARCHAR(255)    UNIQUE NOT NULL
is_admin        BOOLEAN         DEFAULT FALSE
is_active       BOOLEAN         DEFAULT TRUE
created_at      TIMESTAMP       DEFAULT now()
updated_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Core user records tied to Supabase Auth
**Relationships**: 
- One-to-One with `user_profiles`
- One-to-Many with `articles` (as author)
- One-to-Many with `photos` (as uploader)
- One-to-Many with `comments` (as author)

**Indexes**:
- `idx_users_email` - Email lookups
- `idx_users_is_admin` - Admin user queries
- `idx_users_is_active` - Active user filtering

---

### 2. **user_profiles** (Extended User Information)

Contains extended profile information for users.

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
user_id         UUID            NOT NULL UNIQUE (refs users.id)
display_name    VARCHAR(255)    NOT NULL
bio             TEXT            NULLABLE
avatar_url      VARCHAR(500)    NULLABLE
location        VARCHAR(255)    NULLABLE
website         VARCHAR(500)    NULLABLE
twitter_handle  VARCHAR(100)    NULLABLE
github_handle   VARCHAR(100)    NULLABLE
total_posts     INTEGER         DEFAULT 0
total_views     INTEGER         DEFAULT 0
created_at      TIMESTAMP       DEFAULT now()
updated_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Extended user metadata and public profile information
**Relationships**:
- One-to-One with `users` (inverse relationship)
- One-to-Many with `articles` (as author)
- One-to-Many with `photos` (as uploader)
- One-to-Many with `comments` (as author)

**Indexes**:
- `idx_user_profiles_user_id` - User lookup
- `idx_user_profiles_display_name` - Profile search by name

**Example Data**:
```
id: 123e4567-e89b-12d3-a456-426614174000
user_id: 987f6543-e21c-98d3-b789-123456789000
display_name: John Doe
bio: Full-stack developer and tech enthusiast
avatar_url: https://storage.supabase.com/avatars/user1.jpg
website: https://johndoe.com
```

---

### 3. **articles** (Blog Posts)

Stores blog articles/posts created by users.

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
author_id       UUID            NOT NULL (refs user_profiles.id)
title           VARCHAR(500)    NOT NULL
slug            VARCHAR(500)    UNIQUE NOT NULL
excerpt         VARCHAR(1000)   NULLABLE
content         TEXT            NOT NULL
featured_image_url VARCHAR(500) NULLABLE
status          VARCHAR(50)     DEFAULT 'draft'
                                CHECK (draft|published|archived)
view_count      INTEGER         DEFAULT 0
is_featured     BOOLEAN         DEFAULT FALSE
published_at    TIMESTAMP       NULLABLE
created_at      TIMESTAMP       DEFAULT now()
updated_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Main content table for blog articles
**Relationships**:
- Many-to-One with `user_profiles` (author)
- One-to-Many with `photos`
- One-to-Many with `comments`
- Many-to-Many with `tags` (via article_tags)

**Status Values**:
- `draft` - Not published
- `published` - Publicly visible
- `archived` - Removed from public view

**Indexes**:
- `idx_articles_author_id` - Author's articles
- `idx_articles_slug` - Article lookup by slug
- `idx_articles_status` - Filter by status
- `idx_articles_published_at` - Chronological ordering
- `idx_articles_is_featured` - Featured articles
- `idx_articles_created_at` - Recent articles

**Example Data**:
```
id: 223e4567-e89b-12d3-a456-426614174001
author_id: 123e4567-e89b-12d3-a456-426614174000
title: Getting Started with Vite
slug: getting-started-with-vite
excerpt: Learn how to build fast modern web applications
content: [Full article content...]
status: published
published_at: 2024-01-15 10:30:00
```

---

### 4. **photos** (Image Storage References)

Stores references to photos/images uploaded to Supabase Storage.

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
article_id      UUID            NULLABLE (refs articles.id)
user_id         UUID            NOT NULL (refs user_profiles.id)
file_name       VARCHAR(255)    NOT NULL
file_path       VARCHAR(500)    NOT NULL
file_size       INTEGER         NULLABLE
file_type       VARCHAR(50)     NULLABLE
storage_url     VARCHAR(500)    NOT NULL
alt_text        VARCHAR(500)    NULLABLE
is_featured     BOOLEAN         DEFAULT FALSE
created_at      TIMESTAMP       DEFAULT now()
updated_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Track uploaded images and their metadata
**Relationships**:
- Many-to-One with `articles` (optional, for article images)
- Many-to-One with `user_profiles` (uploader)

**File Types Examples**:
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`

**Indexes**:
- `idx_photos_article_id` - Images for an article
- `idx_photos_user_id` - User's uploads
- `idx_photos_is_featured` - Featured images

**Example Data**:
```
id: 323e4567-e89b-12d3-a456-426614174002
article_id: 223e4567-e89b-12d3-a456-426614174001
user_id: 123e4567-e89b-12d3-a456-426614174000
file_name: vite-tutorial.jpg
file_path: articles/223e4567/vite-tutorial.jpg
file_size: 245000
storage_url: https://storage.supabase.com/...
alt_text: Vite logo and editor screenshot
```

---

### 5. **tags** (Article Categories)

Categorization tags for organizing articles.

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
name            VARCHAR(100)    UNIQUE NOT NULL
slug            VARCHAR(100)    UNIQUE NOT NULL
description     TEXT            NULLABLE
created_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Define available tags for article categorization
**Relationships**:
- Many-to-Many with `articles` (via article_tags)

**Indexes**:
- `idx_tags_slug` - Tag lookup by slug

**Example Data**:
```
name: JavaScript
slug: javascript
description: JavaScript programming tutorials and tips
```

---

### 6. **article_tags** (Many-to-Many Junction)

Junction table linking articles to tags.

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
article_id      UUID            NOT NULL (refs articles.id)
tag_id          UUID            NOT NULL (refs tags.id)
UNIQUE(article_id, tag_id)
```

**Purpose**: Establish many-to-many relationship between articles and tags
**Relationships**:
- Many-to-One with `articles`
- Many-to-One with `tags`

**Indexes**:
- `idx_article_tags_article_id` - Tags for an article
- `idx_article_tags_tag_id` - Articles with a tag

---

### 7. **comments** (Bonus: Article Comments)

User comments on articles (for engagement/discussion).

```sql
id              UUID            PRIMARY KEY (uuid_generate_v4)
article_id      UUID            NOT NULL (refs articles.id)
author_id       UUID            NOT NULL (refs user_profiles.id)
content         TEXT            NOT NULL
is_approved     BOOLEAN         DEFAULT TRUE
created_at      TIMESTAMP       DEFAULT now()
updated_at      TIMESTAMP       DEFAULT now()
```

**Purpose**: Enable user engagement through comments
**Relationships**:
- Many-to-One with `articles`
- Many-to-One with `user_profiles` (comment author)

**Indexes**:
- `idx_comments_article_id` - Comments on an article
- `idx_comments_author_id` - User's comments
- `idx_comments_is_approved` - Approved comments

---

## Views (Materialized Data)

### 1. **published_articles_with_authors**

Provides articles with author information and aggregated data.

```sql
SELECT
  a.id,
  a.title,
  a.slug,
  a.excerpt,
  a.content,
  a.featured_image_url,
  a.view_count,
  a.is_featured,
  a.published_at,
  a.created_at,
  up.display_name as author_name,
  up.avatar_url as author_avatar,
  ARRAY_AGG(t.name) as tags,
  COUNT(comments) as comment_count,
  COUNT(photos) as photo_count
FROM articles
JOIN user_profiles up ON articles.author_id = up.id
LEFT JOIN article_tags, tags
LEFT JOIN comments
LEFT JOIN photos
WHERE status = 'published'
```

**Use Case**: Displaying articles on the home page with all relevant data

---

### 2. **user_statistics**

Provides aggregated statistics for each user.

```sql
SELECT
  up.id,
  up.display_name,
  COUNT(articles) as total_articles,
  SUM(view_count) as total_views,
  COUNT(comments) as total_comments,
  MAX(published_at) as last_article_date
FROM user_profiles up
LEFT JOIN articles
LEFT JOIN comments
GROUP BY up.id
```

**Use Case**: Display user profiles with statistics

---

### 3. **trending_articles**

Calculates trending articles based on views and comments.

```sql
SELECT
  a.id,
  a.title,
  a.view_count,
  COUNT(comments) as comment_count,
  (view_count + comment_count * 10) as trending_score
FROM articles a
LEFT JOIN comments
WHERE status = 'published'
  AND published_at >= now() - interval '30 days'
ORDER BY trending_score DESC
```

**Use Case**: Displaying trending/popular articles

---

## Relationships Diagram

```
auth.users (Supabase)
    ↓ (1:1)
users ──→ user_profiles
    ↓ (1:M)          ↓ (1:M)
  [nothing]    articles ─────→ article_tags ←──── tags
                ↓ (1:M)              ↓ (1:M)
             photos            [linked via junction]
             comments
```

---

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Access
- **articles** (published only)
- **tags** (all)
- **comments** (approved only)
- **photos** (all)
- **user_profiles** (all)

### Authenticated Users
- Can create articles, comments, upload photos
- Can update/delete their own content
- Can update their profile

### Admin Users
- Full access to all tables
- Can manage tags and moderate content

---

## Migrations

### Migration 001: `001_initial_schema.sql`
- Creates all base tables
- Establishes relationships and constraints
- Adds indexes for performance
- Creates `update_updated_at` trigger

### Migration 002: `002_rls_policies.sql`
- Enables RLS on all tables
- Defines security policies for each table
- Controls data access based on user roles

### Migration 003: `003_seed_data.sql`
- Creates sample tags
- Defines useful views
- Adds development/test data structure

---

## Performance Considerations

1. **Indexes**: Strategic indexes on foreign keys, status, and date fields
2. **Views**: Materialized views reduce query complexity
3. **Pagination**: Queries should use LIMIT and OFFSET
4. **Caching**: Consider caching trending articles and user stats
5. **Full Text Search**: Use PostgreSQL FTS on title, excerpt, content for search

---

## Data Integrity

- Foreign key constraints with CASCADE delete
- UNIQUE constraints on email, slug
- CHECK constraints on status values
- NOT NULL constraints on critical fields
- Automatic `updated_at` timestamp management

---

## Scalability Notes

- UUID primary keys support distributed systems
- Proper indexing enables efficient queries at scale
- Denormalized fields (like `total_posts` in user_profiles) can be updated in triggers
- Consider partitioning `articles` and `comments` tables if they grow very large

---

## Future Enhancements

- [ ] Add `likes` or `upvotes` table for articles
- [ ] Add `followers` table for user following system
- [ ] Add `notifications` table for user alerts
- [ ] Add `search_vectors` for full-text search optimization
- [ ] Add `analytics` table for detailed tracking
- [ ] Add soft delete patterns for data recovery
- [ ] Add audit logging table for compliance

