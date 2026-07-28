# 🚀 Blog App - Modern Multi-User Blog with RBAC & Audit Logging

A production-ready, fully responsive multi-page blog application built with vanilla JavaScript, HTML, CSS, Vite, Bootstrap, and Supabase. Features role-based access control (RBAC), audit logging for compliance, file management, and JWT token refresh strategy.

## ✨ Key Features

### 🔐 **Advanced Authentication & Authorization**
- Supabase-based user authentication with JWT tokens
- Automatic JWT token refresh (30 min before expiration)
- Role-based access control (RBAC) with 2 roles: `user` and `admin`
- Dynamic role loading from database (roles can be updated by admins)
- Session persistence with automatic restoration on page load
- Protected routes with automatic redirects

### 📝 **Blog & Content Management**
- Create, read, update, delete (CRUD) posts
- File upload/download for post attachments (Supabase Storage)
- Tag system for post categorization
- Author attribution and timestamps
- Image support with URL-based upload
- Draft/published status management

### 👥 **User Management**
- User registration and login
- User profiles with display names
- Admin panel for user management
- User activation/deactivation (account suspend without delete)
- Role assignment by admins (promote users to admin or demote admins to users)
- User search and filtering

### 📊 **Admin Dashboard**
- **Dashboard Stats**: Posts count, views, active users, comments
- **Content Tab**: Full post management table with edit/delete actions
- **Users Tab**: Searchable user management with role and status controls
- **Audit Logs Tab**: Complete audit trail with filtering and CSV export
- **Settings Tab**: Site configuration options

### 📁 **File Management**
- Upload files to Supabase Storage
- Per-user file storage with usage tracking (5GB default limit)
- File visibility control (public/private)
- Download with signed URLs (1-hour expiry)
- Copy file URL to clipboard
- File type icons and metadata display
- Storage usage visualization

### 📋 **Audit Logging & Compliance**
- Automatic logging of all admin actions
- Tracks: user, action, resource type, IP address, timestamp, details
- Admin-only access to audit logs
- Filtering by user, action, resource type, and date range
- CSV export for compliance reporting
- Security monitoring and incident investigation

### 🎨 **User Experience**
- Role-based navigation menu
- Admin badge in user dropdown
- Responsive design (desktop, tablet, mobile)
- Smooth animations and transitions
- Loading spinners and progress tracking
- Alert notifications with auto-dismiss
- Empty state illustrations
- Modal dialogs for forms
- Confirmation dialogs for destructive actions

### 🛡️ **Security**
- Row-Level Security (RLS) policies in PostgreSQL
- Client-side validation
- Protected routes with auth checks
- Session timeout handling
- Secure file access with signed URLs
- Admin-only access to sensitive features

## 📁 Project Structure

```
capstone-project-blog/
├── src/
│   ├── main.js                      # Application entry point
│   ├── style.css                    # Global styles (850+ lines)
│   ├── pages/
│   │   ├── homePage.js              # Home page
│   │   ├── loginPage.js             # Login page
│   │   ├── registerPage.js          # Registration page
│   │   ├── postsPage.js             # Posts list, detail view, file management
│   │   ├── filesPage.js             # My Files - user file management
│   │   └── adminPage.js             # Admin dashboard (posts, users, audit logs, settings)
│   └── js/
│       ├── router.js                # Client-side routing
│       ├── auth.js                  # Authentication with JWT refresh strategy
│       ├── postService.js           # Post CRUD operations
│       ├── roleService.js           # Role management (user roles, admin functions)
│       ├── auditService.js          # Audit logging for compliance
│       ├── fileService.js           # File uploads/downloads with Supabase Storage
│       ├── supabaseClient.js        # Supabase client configuration
│       └── utils.js                 # Utility functions
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql           # Core tables (users, posts, tags, comments)
│   │   ├── 002_rls_policies.sql            # Row-level security policies
│   │   ├── 003_seed_data.sql               # Sample data and views
│   │   ├── 004_user_roles.sql              # Role management table and policies
│   │   ├── 005_audit_logs.sql              # Audit logging table
│   │   ├── 006_user_files.sql              # File management table
│   │   └── 007_update_rls_for_roles.sql    # Update RLS for 2-role system
│   ├── DATABASE_SCHEMA.md                   # Detailed schema documentation
│   ├── MIGRATIONS.md                        # Migration guide
│   └── README.md                            # Supabase setup instructions
├── index.html                               # Main HTML entry
├── vite.config.js                           # Vite configuration
├── package.json                             # Project dependencies
├── .env.example                             # Environment variables template
├── README.md                                # This file (you are here)
├── START_HERE.md                            # Quick start guide
└── PROJECT_SUMMARY.md                       # Project overview
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd capstone-project-blog
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_public_anon_key
```

5. Apply database migrations (see START_HERE.md for detailed instructions)

### Running the Application

**Development server:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 📄 Pages & Features

### 1. Home Page (`#home`)
- Welcome hero section
- Featured posts showcase
- Call-to-action buttons
- Responsive layout

### 2. Login Page (`#login`)
- Supabase email/password authentication
- Form validation
- Link to registration
- Error handling with alerts

### 3. Register Page (`#register`)
- Create new user account
- Email validation
- Password strength requirements
- Profile setup (display name)

### 4. Posts Page (`#posts`)
- **List View**: Grid of all posts with cards
- **Create Post**: Modal form with file upload
- **View Post**: Detailed article view
- **Edit Post**: Update existing posts (own posts only)
- **Delete Post**: Remove posts (own posts or admin)
- **File Management**: Upload/download files attached to posts
- Tag filtering and display
- Author and date metadata
- RLS-enforced permissions

### 5. My Files Page (`#files`) - NEW
- **Storage Dashboard**: 
  - Usage visualization (5GB limit)
  - File count and total size statistics
- **Upload Section**: 
  - Multi-file upload
  - Progress tracking
- **Files Table**:
  - File name, size, type, upload date
  - File type icons (image, PDF, document, etc.)
  - Visibility badges (public/private)
  - Actions: Download, Copy URL, Toggle visibility, Delete
- **One-Click Download**: Signed URLs with 1-hour expiry

### 6. Admin Panel (`#admin`) - ENHANCED
#### Dashboard Tab
- Statistics: Posts, Views, Active Users, Comments
- Responsive stat cards with icons

#### Content Tab
- Posts management table
- Quick actions: View, Edit, Delete
- Status badges
- Author and date information

#### Users Tab - NEW
- **User Management Table**:
  - Email, Name, Role, Status, Joined Date
  - Search by email/name
  - Filter by role (admin/user)
  - Edit user: Change role between admin and user
  - Toggle status: Activate/Deactivate accounts
  - Delete user: Permanently remove user
  - Refresh button
- **Permissions**: Admin-only access with automatic audit logging

#### Audit Logs Tab - NEW
- **Audit Trail Table**:
  - Timestamp, User, Action, Resource Type, IP Address
  - Click details to view action metadata in modal
- **Filtering**:
  - Filter by action (CREATE_POST, ASSIGN_ROLE, etc.)
  - Filter by user name/email
  - Filter by resource type (user, article, file)
  - Clear all filters button
- **Export**:
  - Download as CSV with formatted headers
  - Includes timestamp, user, email, action, resource, IP
- **Refresh button** to reload latest logs

#### Settings Tab
- Site name configuration
- Site description
- Posts per page setting
- Comment toggle

## 🏗️ Architecture & Backend Services

### Authentication System (`auth.js`)
- **JWT Token Management**:
  - Automatic token refresh 30 minutes before expiration
  - Prevents session timeouts for active users
  - Automatic logout if refresh fails
- **Dynamic Role Loading**:
  - Fetches user role from `user_roles` table
  - Syncs role changes without re-login
  - `refreshUserRole()` method for live updates
- **Session Restoration**:
  - Auto-restores session on page load
  - Validates token before restoring
  - Fallback to login if session invalid
- **Public Methods**:
  - `register()`, `login()`, `logout()`
  - `getCurrentUser()`, `isLoggedIn()`, `isAdmin()`
  - `refreshUserRole()`, `refreshToken()`

### Role Service (`roleService.js`)
Manages user roles and permissions:
- `getUserRole(userId)` - Get user's role from database
- `hasRole(userId, role)` - Check if user has specific role
- `isAdmin(userId)` - Check if user is admin
- `assignRole(userId, role)` - Change user's role (admin only, auto-logged)
- `getAllUsers()` - List all users with roles (admin only)
- `deactivateUser(userId)` - Suspend user account (admin only, auto-logged)
- `reactivateUser(userId)` - Reactivate suspended user (admin only, auto-logged)
- `deleteUser(userId)` - Permanently delete user (admin only, auto-logged)
- `getPermissionLevel(userId)` - Get user's permission flags for frontend

### Audit Service (`auditService.js`)
Logs all admin actions for compliance:
- `log(action, resourceType, resourceId, details)` - Core logging function
- `getLogs(filters)` - Retrieve logs with filtering by user/action/resource/date
- `getUserLogs(userId)` - Get logs for specific user
- `getActionLogs(action)` - Get logs for specific action type
- `getResourceLogs(resourceType, resourceId)` - Get logs for resource
- `exportLogsAsCSV(filters)` - Export logs as CSV for compliance
- Convenience methods: `logPostCreated()`, `logPostDeleted()`, `logFileUploaded()`, `logFileDeleted()`, `logUserCreated()`
- `getClientIp()` - Capture IP address for security audit trail

### File Service (`fileService.js`)
Manages file uploads/downloads with Supabase Storage:
- `uploadFile(file, articleId)` - Upload to Supabase Storage + log action
- `getDownloadUrl(filePath, expiresIn)` - Get signed download URL (default 1 hour)
- `getPublicUrl(filePath)` - Get public URL for public files
- `deleteFile(fileId, filePath)` - Delete from storage + database + log
- `getUserFiles(userId)` - List user's files with pagination
- `getArticleFiles(articleId)` - List files attached to specific article
- `getFile(fileId)` - Get file metadata
- `updateFile(fileId, updates)` - Update file metadata
- `canDownloadFile(fileId, userId)` - Check download permissions
- `getStorageUsage(userId)` - Get user's storage stats

### Post Service (`postService.js`)
CRUD operations for blog posts:
- `getPosts()` - List all posts
- `getPostById(id)` - Get single post
- `createPost(postData)` - Create new post
- `updatePost(id, postData)` - Update existing post
- `deletePost(id)` - Delete post

## 📊 Database Schema

### Core Tables
- **users** - Supabase Auth users
- **user_profiles** - User metadata (display name)
- **user_roles** - Role assignments (user or admin)
- **articles** - Blog posts
- **tags** - Post categories
- **article_tags** - Post-tag relationships
- **comments** - Post comments
- **user_files** - File tracking
- **audit_logs** - Admin action audit trail

### Row-Level Security (RLS)
All tables use RLS policies:
- Users see their own data
- Admins see and manage all data
- Public articles visible to all
- Authenticated users can create content

See `supabase/DATABASE_SCHEMA.md` for complete details.

## 🔐 Security Features

### Authentication & Authorization
- JWT tokens with automatic refresh
- Role-based access control (2 roles: user, admin)
- Protected routes (posts, files, admin require login)
- Admin routes require admin role
- Session restoration with token validation

### Data Protection
- Row-Level Security (RLS) policies in PostgreSQL
- Column-level security for sensitive data
- Signed URLs for file downloads (1-hour expiry)
- Client-side form validation
- SQL injection prevention via Supabase client

### Audit & Compliance
- Automatic logging of admin actions
- IP address tracking for security investigation
- Immutable audit logs (cannot be edited)
- Admin-only access to audit logs
- CSV export for compliance reporting
- Action details stored in JSON for flexibility

## 💾 Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | UI and interactivity |
| **Build** | Vite | Fast development and production builds |
| **UI Framework** | Bootstrap 5 | Responsive components |
| **Icons** | Bootstrap Icons | Visual enhancements |
| **Backend** | Supabase (PostgreSQL + Auth) | Database and authentication |
| **Storage** | Supabase Storage (S3-compatible) | File management |
| **Router** | Client-side hash routing | Single-page app navigation |

## 📝 Demo/Test Accounts

Since we use Supabase Auth, create test accounts:

**Regular User:**
- Email: `user@example.com`
- Password: Any password (6+ characters)
- Role: User (can create/edit/delete own posts, upload files)

**Admin User:**
- Email: `admin@example.com`
- Password: Any password (6+ characters)
- Role: Admin (full system access, manage users, view audit logs)

## 🎨 Design & Styling

### Color Scheme
| Color | Value | Usage |
|-------|-------|-------|
| Primary | `#0d6efd` (Blue) | Buttons, links, primary actions |
| Secondary | `#6c757d` (Gray) | Neutral elements, text |
| Success | `#198754` (Green) | Positive feedback, approve |
| Danger | `#dc3545` (Red) | Delete, errors, warnings |
| Warning | `#ffc107` (Yellow) | Cautions, edit actions |
| Info | `#0dcaf0` (Cyan) | Informational badges |

### Typography
- System font stack for optimal rendering
- Font sizes: 0.75rem (small) to 2.5rem (headings)
- Line height: 1.6 (body), 1.8 (articles)
- Font weights: 400 (regular), 600 (bold), 700 (strong)

### Responsive Breakpoints
- **Desktop**: ≥ 1200px (3-column grid)
- **Tablet**: 768px - 1199px (2-column grid)
- **Mobile**: < 768px (1-column grid)
- **Small Mobile**: < 576px (optimized layout)

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | This file - complete project documentation |
| `START_HERE.md` | Quick start guide with setup checklist |
| `PROJECT_SUMMARY.md` | High-level project overview |
| `supabase/DATABASE_SCHEMA.md` | Detailed database schema documentation |
| `supabase/MIGRATIONS.md` | Migration files and application guide |
| `SETUP_STEPS.md` | Step-by-step setup instructions |

## 🚀 Future Enhancements

### Planned Features
- [ ] Comment system for posts
- [ ] Search functionality with full-text search
- [ ] Categories for posts
- [ ] User profiles with bio and avatar
- [ ] Email notifications for important actions
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] Social sharing buttons
- [ ] Analytics dashboard
- [ ] Dark mode toggle
- [ ] SEO optimization and sitemaps
- [ ] Image optimization and CDN
- [ ] Rate limiting for API calls
- [ ] Backup and recovery procedures

### Performance Optimizations
- Image lazy loading
- Code splitting for routes
- Service workers for offline support
- CSS optimization and minification
- JavaScript tree shaking
- Database query optimization
- Caching strategies

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: "Supabase not configured" in console

**Solution**:
1. Check `.env` file has both values set
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are correct
3. Restart dev server: `npm run dev`
4. Clear browser cache: Ctrl+Shift+Delete

### Authentication Issues

**Problem**: Cannot login or register

**Solution**:
1. Verify Supabase Auth is enabled in your project
2. Check email format is valid
3. Ensure password is 6+ characters
4. Check browser console for specific errors
5. Verify migrations have been applied

### File Upload Issues

**Problem**: File upload fails

**Solution**:
1. Verify Supabase Storage bucket exists and is public
2. Check file size is within limits
3. Ensure user is authenticated
4. Verify file permissions in Supabase dashboard
5. Check browser console for CORS errors

### Permission Issues

**Problem**: Cannot access admin panel or see other users

**Solution**:
1. Verify your account has admin role (check `user_roles` table)
2. Use admin account to assign admin role to your account
3. Refresh page after role change
4. Check RLS policies in Supabase dashboard

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Bootstrap 5 Guide](https://getbootstrap.com/docs/5.0)
- [Vite Documentation](https://vitejs.dev)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## ✅ Quality Assurance

### Code Quality
- Module-based architecture
- Consistent error handling with try-catch
- Input validation on all forms
- Proper function documentation
- Separation of concerns (services, pages, utils)

### Testing
- Manual testing checklist in `TESTING_CHECKLIST.md`
- RLS policy verification procedures
- Permission testing for different roles
- File upload/download validation

### Browser Support
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

ISC

## 👥 Contributing

Contributions welcome! Please:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Ensure commit messages are clear and descriptive

## 💬 Support

For issues, questions, or suggestions:
1. Check existing documentation files
2. Review `TESTING_CHECKLIST.md` for known issues
3. Check browser console for error messages
4. Open an issue with detailed reproduction steps

---

**Status**: ✅ Production-Ready

All 6 implementation phases complete:
- ✅ Phase 1-2: Database migrations (RBAC, audit logs, file management)
- ✅ Phase 3: Backend services (role, audit, file management)
- ✅ Phase 4: Authentication with JWT refresh strategy
- ✅ Phase 5: Admin panel with user management and audit logs
- ✅ Phase 6: Frontend for file management and role-based navigation

**Last Updated**: July 28, 2026
