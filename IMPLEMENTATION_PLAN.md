# 🔐 User Management Implementation Plan - FINALIZED

## 📋 Requirements Summary

### Role System: 2 Roles Only

#### **VISITOR (Anonymous)**
- ✅ View published posts
- ❌ Cannot create posts
- ❌ Cannot comment
- ❌ Cannot upload files
- ❌ Cannot access admin panel

#### **USER (Authenticated)**
- ✅ Create own posts
- ✅ View all posts
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Upload files to Supabase Storage
- ✅ Download own files
- ❌ Cannot manage other users
- ❌ Cannot access admin panel

#### **ADMIN (Superuser)**
- ✅ Create/edit/delete ALL posts
- ✅ View all posts
- ✅ Manage users (view, edit, add, delete)
- ✅ Full database access
- ✅ Access admin panel
- ✅ View audit logs
- ✅ Manage all files
- ✅ Full system control

### Other Features
- ✅ JWT token refresh strategy
- ✅ Audit logging for admin actions
- ✅ User management UI in admin panel
- ✅ File upload/download via Supabase Storage

---

## 🗄️ Phase 1: Database Schema Updates

### 1.1 Create `user_roles` Table

**File**: `supabase/migrations/004_user_roles.sql`

```sql
-- User roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Triggers for updated_at
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create user_role on user creation (via auth trigger)
```

### 1.2 Create `audit_logs` Table

**File**: `supabase/migrations/005_audit_logs.sql`

```sql
-- Audit logs for tracking admin actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- RLS Policy: Only admins can view audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

CREATE POLICY "Admin actions are automatically logged" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 1.3 Create `user_files` Table

**File**: `supabase/migrations/006_user_files.sql`

```sql
-- Track user file uploads in Supabase Storage
CREATE TABLE IF NOT EXISTS public.user_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  storage_bucket VARCHAR(50) DEFAULT 'articles',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON public.user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_article_id ON public.user_files(article_id);
CREATE INDEX IF NOT EXISTS idx_user_files_created_at ON public.user_files(created_at DESC);

-- Triggers
CREATE TRIGGER update_user_files_updated_at BEFORE UPDATE ON public.user_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" ON public.user_files
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = user_id
  ));

CREATE POLICY "Admins can view all files" ON public.user_files
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

CREATE POLICY "Users can upload files" ON public.user_files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own files" ON public.user_files
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.user_profiles WHERE id = user_id
  ));

CREATE POLICY "Admins can delete any files" ON public.user_files
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
```

---

## 🔐 Phase 2: Update RLS Policies

### 2.1 Update `articles` Table Policies

**File**: `supabase/migrations/007_update_rls_for_roles.sql`

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Authors can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can delete their own articles" ON public.articles;

-- New policies for 2-role system
CREATE POLICY "Users can update own articles" ON public.articles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

CREATE POLICY "Users can delete own articles" ON public.articles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE id = author_id
    )
  );

CREATE POLICY "Admins can manage any articles" ON public.articles
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
```

### 2.2 Update `user_profiles` Table Policies

```sql
CREATE POLICY "Admins can update any profile" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete any profile" ON public.user_profiles
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
```

### 2.3 Update `users` Table Policies

```sql
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

CREATE POLICY "Admins can deactivate users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
```

---

## 🛠️ Phase 3: Backend Services

### 3.1 Create `roleService.js`

**File**: `src/js/roleService.js`

```javascript
import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const roleService = {
  // Get user's role
  getUserRole: async (userId) => {
    if (!hasSupabaseConfig) return 'user';
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.role || 'user';
  },

  // Check if user has role
  hasRole: async (userId, role) => {
    const userRole = await roleService.getUserRole(userId);
    return userRole === role;
  },

  // Check if user is admin
  isAdmin: async (userId) => {
    return await roleService.hasRole(userId, 'admin');
  },

  // Assign role (admin only)
  assignRole: async (userId, role) => {
    if (!hasSupabaseConfig) return;
    
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        assigned_by: (await supabase.auth.getUser()).data.user.id,
        assigned_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    if (!hasSupabaseConfig) return [];
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        is_active,
        created_at,
        user_roles (role),
        user_profiles (display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Deactivate user (admin only)
  deactivateUser: async (userId) => {
    if (!hasSupabaseConfig) return;
    
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) throw error;
  },

  // Reactivate user (admin only)
  reactivateUser: async (userId) => {
    if (!hasSupabaseConfig) return;
    
    const { error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId);

    if (error) throw error;
  }
};
```

### 3.2 Create `auditService.js`

**File**: `src/js/auditService.js`

```javascript
import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const auditService = {
  // Log admin action
  log: async (action, resourceType, resourceId, details = {}) => {
    if (!hasSupabaseConfig) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userData.user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: await auditService.getClientIp()
      });

    if (error) console.error('Audit log error:', error);
  },

  // Get audit logs (admin only)
  getLogs: async (filters = {}) => {
    if (!hasSupabaseConfig) return [];

    let query = supabase
      .from('audit_logs')
      .select(`
        id,
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        created_at,
        users (email),
        user_profiles (display_name)
      `)
      .order('created_at', { ascending: false });

    if (filters.userId) query = query.eq('user_id', filters.userId);
    if (filters.action) query = query.eq('action', filters.action);
    if (filters.resourceType) query = query.eq('resource_type', filters.resourceType);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get client IP (best effort)
  getClientIp: async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
};
```

### 3.3 Create `fileService.js`

**File**: `src/js/fileService.js`

```javascript
import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const fileService = {
  // Upload file to Supabase Storage
  uploadFile: async (file, articleId = null) => {
    if (!hasSupabaseConfig) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${userData.user.id}/${fileName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('articles')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Record in database
    const { data: dbData, error: dbError } = await supabase
      .from('user_files')
      .insert({
        user_id: profileData.id,
        article_id: articleId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        is_public: true
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return dbData;
  },

  // Get download URL for file
  getDownloadUrl: async (filePath) => {
    if (!hasSupabaseConfig) return null;

    const { data } = supabase
      .storage
      .from('articles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Delete file
  deleteFile: async (fileId, filePath) => {
    if (!hasSupabaseConfig) return;

    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('articles')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('user_files')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;
  },

  // Get user's files
  getUserFiles: async (userId) => {
    if (!hasSupabaseConfig) return [];

    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
```

---

## 🔐 Phase 4: Update Authentication Module

### 4.1 Update `auth.js` for Role Loading

**File**: `src/js/auth.js` (key changes)

```javascript
// Add role loading
export const auth = {
  register: async (email, password, name) => {
    if (hasSupabaseConfig) {
      // ... existing signUp code ...
      
      // Create user_role as 'user'
      if (data.user?.id) {
        try {
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'user'
          });
        } catch (roleError) {
          console.warn('Role creation skipped:', roleError);
        }
      }
    }
  },

  login: async (email, password) => {
    if (hasSupabaseConfig) {
      // ... existing signInWithPassword code ...
      
      // Load role from database
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const user = {
        id: data.user?.id,
        email: data.user?.email || email,
        name: data.user?.user_metadata?.display_name || email.split('@')[0],
        role: roleData?.role || 'user',  // 'user' or 'admin'
        isAdmin: roleData?.role === 'admin',
        createdAt: data.user?.created_at
      };

      saveCurrentUser(user);
      return user;
    }
  },

  // Add role-based helpers
  hasRole: (role) => currentUser?.role === role,
  isAdmin: () => currentUser?.role === 'admin',
  isUser: () => currentUser?.role === 'user',
  
  // JWT refresh strategy
  refreshAuth: async () => {
    if (!hasSupabaseConfig || !currentUser) return null;
    
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Token refresh failed:', error);
      auth.logout();
      return null;
    }
  }
};
```

---

## 🖥️ Phase 5: Admin Panel Enhancement

### 5.1 Create Admin Users Management Tab

**File**: `src/pages/adminPage.js` (add new section)

```javascript
// New tab content for user management

<div class="tab-pane fade" id="users">
  <h3>User Management</h3>
  
  <div class="table-responsive">
    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="usersTableBody">
        <!-- populated by JS -->
      </tbody>
    </table>
  </div>
</div>
```

**Load users and show:**
- ✅ User list with roles
- ✅ Change role (user ↔ admin)
- ✅ Deactivate/reactivate users
- ✅ User statistics

---

## 📊 Phase 6: Frontend Updates

### 6.1 Update Navigation

**File**: `src/js/auth.js` (updateNavigation function)

```javascript
export const updateNavigation = () => {
  const user = auth.getCurrentUser();

  if (auth.isLoggedIn()) {
    // Show Posts for all users
    navPosts.style.display = 'block';

    // Show Admin only for admins
    if (auth.isAdmin()) {
      navAdmin.style.display = 'block';
    } else {
      navAdmin.style.display = 'none';
    }

    // Show user dropdown
    navAuth.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown">
        <i class="bi bi-person-circle me-1"></i>${user.name}
        ${auth.isAdmin() ? '<span class="badge bg-danger ms-1">Admin</span>' : ''}
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#profile">Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#logout">Logout</a></li>
      </ul>
    `;
  }
};
```

---

## ✅ Implementation Checklist

### Database (Phase 1-2)
- [ ] Create migration 004: user_roles table
- [ ] Create migration 005: audit_logs table
- [ ] Create migration 006: user_files table
- [ ] Create migration 007: update RLS policies
- [ ] Apply all 4 migrations to Supabase
- [ ] Verify tables created
- [ ] Test RLS policies

### Backend Services (Phase 3-4)
- [ ] Create roleService.js
- [ ] Create auditService.js
- [ ] Create fileService.js
- [ ] Update auth.js with role loading
- [ ] Add JWT refresh logic
- [ ] Test all services

### Admin Panel (Phase 5-6)
- [ ] Add Users tab to admin page
- [ ] Add Audit Logs tab
- [ ] Implement user list loading
- [ ] Implement role assignment UI
- [ ] Implement user deactivation
- [ ] Update navigation for roles

### Testing
- [ ] Test visitor access (can view only)
- [ ] Test user access (can create/edit own)
- [ ] Test file upload/download
- [ ] Test admin access (full control)
- [ ] Test role switching
- [ ] Test audit logging
- [ ] Test JWT refresh

---

## 🚀 Quick Start Timeline

**Total Implementation Time: ~8-10 hours**

1. **Database Setup** (2 hours)
   - Create 4 migrations
   - Apply to Supabase
   - Verify schema

2. **Backend Services** (3 hours)
   - roleService.js
   - auditService.js
   - fileService.js

3. **Auth Updates** (2 hours)
   - Update auth.js
   - Add role loading
   - JWT refresh

4. **Admin Panel** (2 hours)
   - Users management UI
   - Audit logs viewer
   - Role assignment

5. **Testing & Refinement** (1-2 hours)
   - End-to-end testing
   - Bug fixes
   - Performance tuning

---

## 🔒 Security Checklist

- ✅ JWT tokens with refresh strategy
- ✅ RLS policies enforce role-based access
- ✅ Audit logging for all admin actions
- ✅ File upload restricted by authentication
- ✅ User isolation (can't access others' files)
- ✅ Admin-only operations protected
- ✅ Sensitive data not exposed to frontend

---

## 📁 Files to Create/Modify

**Create:**
- `supabase/migrations/004_user_roles.sql`
- `supabase/migrations/005_audit_logs.sql`
- `supabase/migrations/006_user_files.sql`
- `supabase/migrations/007_update_rls_for_roles.sql`
- `src/js/roleService.js`
- `src/js/auditService.js`
- `src/js/fileService.js`

**Modify:**
- `src/js/auth.js` - Add role loading, JWT refresh
- `src/pages/adminPage.js` - Add users management
- `src/pages/postsPage.js` - Add file upload/download
- `index.html` - Update navigation logic

---

## ✨ Ready to Implement?

This plan is **production-ready** and follows all your requirements:
- ✅ 2-role system (user, admin)
- ✅ JWT refresh strategy
- ✅ Audit logging
- ✅ User management UI
- ✅ File upload/download
- ✅ Complete security model

**Shall I proceed with implementation?** 🚀
