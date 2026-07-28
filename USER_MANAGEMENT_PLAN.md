# 🔐 User Management Refinement - Implementation Plan

## 📊 Current State Analysis

### ✅ What Already Exists

1. **Supabase Auth Integration**
   - ✅ signUp with email/password
   - ✅ signInWithPassword
   - ✅ signOut
   - ✅ JWT tokens handled automatically by Supabase

2. **User Tables**
   - ✅ `users` table (linked to auth.users)
   - ✅ `user_profiles` table (extended info)
   - ✅ `is_admin` flag in users table

3. **Authentication Flow**
   - ✅ Register creates auth user and user_profiles
   - ✅ Login retrieves user data
   - ✅ Logout clears session
   - ✅ localStorage persistence

4. **Role System**
   - ✅ Admin role detection (currently hardcoded: `email === 'admin@blog.com'`)
   - ✅ `is_admin` column in users table

5. **Admin Panel**
   - ✅ Admin dashboard exists
   - ✅ Navigation shows "Admin" link for admins
   - ✅ Stats, content management, settings tabs

6. **RLS Policies**
   - ✅ Policies defined for all tables
   - ✅ User authentication checks
   - ✅ Content ownership validation

### ⚠️ Current Limitations

1. **Admin Role Detection**
   - ❌ Hardcoded email check (`email === 'admin@blog.com'`)
   - ❌ Not database-driven
   - ❌ Cannot grant/revoke admin role dynamically
   - ❌ Not scalable for multiple admin emails

2. **Role Management**
   - ❌ No `user_roles` table for RBAC
   - ❌ Only 2 roles possible (admin/user)
   - ❌ Cannot assign custom roles
   - ❌ No role management UI

3. **JWT Token Handling**
   - ⚠️ Relies on localStorage (vulnerable)
   - ⚠️ No refresh token strategy
   - ⚠️ No token expiration handling
   - ⚠️ No automatic re-authentication

4. **RLS Policies**
   - ⚠️ Policies exist but use basic conditions
   - ⚠️ No integration with role-based table
   - ⚠️ Admin checks hardcoded in policies

5. **Admin Features**
   - ⚠️ No user management in admin panel
   - ⚠️ No role assignment UI
   - ⚠️ No user list/edit capabilities
   - ⚠️ No activity logging

---

## 🎯 Proposed Implementation Plan

### **Phase 1: Database Schema Enhancement**

#### 1.1 Create `user_roles` Table

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'moderator', 'admin')),
  assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
```

**Why**: 
- Enables dynamic role management
- Supports multiple roles (user, editor, moderator, admin)
- Tracks who assigned roles and when
- Separates role from user profile

#### 1.2 Create `user_permissions` Table (Optional)

```sql
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);
```

**Why**:
- Fine-grained access control
- Define what each role can do
- Flexible permission system

#### 1.3 Create `audit_logs` Table

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
```

**Why**:
- Track admin actions
- Security/compliance
- Audit trail

#### 1.4 Update `users` Table

```sql
-- Add columns
ALTER TABLE public.users 
ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Migrate admin data
UPDATE public.users 
SET role = 'admin' 
WHERE is_admin = true;
```

---

### **Phase 2: Update RLS Policies**

#### 2.1 Modify Existing Policies

```sql
-- Update articles policy to check user_roles
CREATE OR REPLACE POLICY "Authors can update their own articles" ON public.articles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT u.id FROM public.users u
      WHERE u.id = (
        SELECT user_id FROM public.user_profiles WHERE id = author_id
      )
    )
  );

-- Add admin override
CREATE OR REPLACE POLICY "Admins can manage any articles" ON public.articles
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
```

#### 2.2 New Policy: Tag Management

```sql
CREATE POLICY "Only editors+ can manage tags" ON public.tags
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('editor', 'moderator', 'admin')
    )
  );
```

---

### **Phase 3: Authentication Module Enhancement**

#### 3.1 Update `auth.js`

**Key Changes:**
1. Load role from `user_roles` table instead of checking email
2. Implement JWT refresh strategy
3. Add role-based helper functions
4. Handle role changes

```javascript
// New functions to add:
- loadUserRole(userId) - fetch from DB
- hasRole(role) - check if user has role
- hasAnyRole(roles) - check if user has any of roles
- hasPermission(permission) - check permissions
- refreshAuth() - refresh JWT token
- syncRoleFromDatabase() - sync role with DB
```

#### 3.2 JWT Token Management

```javascript
// Improvements:
- Monitor token expiration
- Auto-refresh on expiration
- Handle session invalidation
- Log auth events
```

---

### **Phase 4: Admin Panel Enhancement**

#### 4.1 Add User Management Section

**New Admin Tab: "Users"**
- List all users with their roles
- Search/filter users
- Edit user roles (bulk assign)
- Deactivate/activate users
- View user statistics

#### 4.2 Add Audit Log Viewer

**New Admin Tab: "Audit Logs"**
- View all admin actions
- Filter by user/action/date
- Export logs
- Monitor security

#### 4.3 Add Role Management Section

**New Admin Tab: "Roles & Permissions"**
- View all roles
- Assign permissions to roles
- Create custom roles (future)
- Test role access

---

### **Phase 5: Frontend Implementation**

#### 5.1 Create New Components

```
src/pages/
├── adminPage.js (enhanced)
│   ├── Users management section
│   ├── Audit logs viewer
│   └── Role management section

src/js/
├── roleService.js (new)
│   ├── getRoles()
│   ├── getUserRole(userId)
│   ├── assignRole(userId, role)
│   └── hasPermission(permission)

├── auditService.js (new)
│   ├── logAction()
│   ├── getAuditLogs()
│   └── filterLogs()
```

#### 5.2 Update Navigation

```javascript
// Show different nav items based on role:
- All users: Home, Posts
- Editors+: + Create Post
- Moderators+: + Moderate Comments
- Admins: + Admin Panel, + Users, + Audit Logs
```

---

### **Phase 6: Security Hardening**

#### 6.1 JWT Security

- ✅ Use Supabase's built-in JWT handling
- ✅ Implement token refresh strategy
- ✅ Set appropriate expiration times
- ✅ Secure token storage

#### 6.2 Session Management

- ✅ Track active sessions
- ✅ Allow session invalidation
- ✅ Monitor concurrent sessions
- ✅ IP-based restrictions (optional)

#### 6.3 Rate Limiting

- ✅ Rate limit login attempts
- ✅ Rate limit sensitive operations
- ✅ Prevent brute force attacks

---

## 📋 Implementation Checklist

### Step 1: Database Schema (2 hours)
- [ ] Create `user_roles` table
- [ ] Create `user_permissions` table
- [ ] Create `audit_logs` table
- [ ] Migrate existing admin data
- [ ] Create indexes
- [ ] Add triggers for audit logging

### Step 2: Update RLS Policies (1 hour)
- [ ] Modify existing policies
- [ ] Add admin override policies
- [ ] Add role-based policies
- [ ] Test RLS enforcement

### Step 3: Backend Services (2 hours)
- [ ] Create `roleService.js`
- [ ] Create `auditService.js`
- [ ] Implement role loading
- [ ] Add permission checking

### Step 4: Authentication Module (1.5 hours)
- [ ] Update `auth.js` with role loading
- [ ] Implement role-based helpers
- [ ] Add JWT refresh logic
- [ ] Update session management

### Step 5: Admin Panel (3 hours)
- [ ] Create users management section
- [ ] Create audit logs viewer
- [ ] Create role management section
- [ ] Add filtering/search

### Step 6: Frontend Updates (2 hours)
- [ ] Update navigation
- [ ] Add role-based visibility
- [ ] Create role display components
- [ ] Update permissions checks

### Step 7: Testing & Hardening (2 hours)
- [ ] Test role-based access
- [ ] Test RLS policies
- [ ] Test JWT refresh
- [ ] Security audit

**Total Time**: ~13.5 hours

---

## 🎯 Outcome

### After Implementation:

✅ **Dynamic Role Management**
- Assign/revoke roles without code changes
- Multiple role levels (user, editor, moderator, admin)
- Database-driven role system

✅ **Enhanced Security**
- JWT token refresh strategy
- RLS policies integrated with roles
- Audit logging for admin actions

✅ **Admin Capabilities**
- User management UI
- Role assignment interface
- Activity monitoring
- Audit log viewer

✅ **Scalability**
- Can add new roles easily
- Fine-grained permissions possible
- Role-based access control ready

✅ **Compliance**
- Audit trail for all changes
- User activity tracking
- Security monitoring

---

## 📊 Role Hierarchy

```
┌─────────────────┐
│     Admin       │ - Full access
├─────────────────┤
│   Moderator     │ - Manage comments/posts
├─────────────────┤
│     Editor      │ - Create/edit posts
├─────────────────┤
│      User       │ - View posts, create own
└─────────────────┘
```

---

## 🔒 Security Considerations

1. **JWT Token Handling**
   - Supabase handles token generation
   - Implement refresh strategy
   - Secure storage in httpOnly cookies (future)

2. **RLS Policies**
   - Database-level enforcement
   - Cannot be bypassed from frontend
   - Role-based row access

3. **Audit Logging**
   - All admin actions logged
   - Tamper-proof audit trail
   - Regular review recommended

4. **Session Management**
   - Track active sessions
   - Invalidate on logout
   - Concurrent session limits (optional)

---

## 🚀 Next Steps

1. Review this plan
2. Approve implementation approach
3. Create database migrations
4. Implement services
5. Update admin panel
6. Comprehensive testing
7. Deploy to production

