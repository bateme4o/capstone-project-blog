import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const roleService = {
  // Get user's role from database
  getUserRole: async (userId) => {
    if (!hasSupabaseConfig) return 'user';

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data?.role || 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  },

  // Check if user has a specific role
  hasRole: async (userId, role) => {
    const userRole = await roleService.getUserRole(userId);
    return userRole === role;
  },

  // Check if user is admin
  isAdmin: async (userId) => {
    return await roleService.hasRole(userId, 'admin');
  },

  // Assign role to user (admin only)
  assignRole: async (userId, role) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
          assigned_by: currentUser.user.id,
          assigned_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Log this action
      await import('./auditService.js').then(m =>
        m.auditService.log('ASSIGN_ROLE', 'user', userId, { role })
      );

      return { success: true, role };
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  },

  // Get all users with their roles (admin only)
  getAllUsers: async () => {
    if (!hasSupabaseConfig) return [];

    try {
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

      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        name: user.user_profiles?.[0]?.display_name || 'Unknown',
        role: user.user_roles?.[0]?.role || 'user',
        is_active: user.is_active,
        created_at: user.created_at
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  // Deactivate user (admin only)
  deactivateUser: async (userId) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      // Log this action
      await import('./auditService.js').then(m =>
        m.auditService.log('DEACTIVATE_USER', 'user', userId, {})
      );

      return { success: true, message: 'User deactivated' };
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  // Reactivate user (admin only)
  reactivateUser: async (userId) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      // Log this action
      await import('./auditService.js').then(m =>
        m.auditService.log('REACTIVATE_USER', 'user', userId, {})
      );

      return { success: true, message: 'User reactivated' };
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    if (!hasSupabaseConfig) return null;

    try {
      // Delete via auth admin API (requires service role)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      // Log this action
      await import('./auditService.js').then(m =>
        m.auditService.log('DELETE_USER', 'user', userId, {})
      );

      return { success: true, message: 'User deleted' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user's permission level (for frontend UI decisions)
  getPermissionLevel: async (userId) => {
    const role = await roleService.getUserRole(userId);
    return {
      canViewPosts: true,
      canCreatePosts: true,
      canEditOwnPosts: true,
      canDeleteOwnPosts: true,
      canUploadFiles: true,
      canDeleteOwnFiles: true,
      canViewAllUsers: role === 'admin',
      canManageUsers: role === 'admin',
      canViewAuditLogs: role === 'admin',
      canManageAllPosts: role === 'admin',
      canManageTags: role === 'admin'
    };
  }
};
