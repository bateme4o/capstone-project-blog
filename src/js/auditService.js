import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const auditService = {
  // Log admin action to audit_logs table
  log: async (action, resourceType, resourceId, details = {}) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      const ipAddress = await auditService.getClientIp();

      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userData.user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: ipAddress
        })
        .select()
        .single();

      if (error) {
        console.error('Audit log error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging audit action:', error);
      return null;
    }
  },

  // Get audit logs with filtering (admin only)
  getLogs: async (filters = {}) => {
    if (!hasSupabaseConfig) return [];

    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          id,
          user_id,
          action,
          resource_type,
          resource_id,
          details,
          ip_address,
          created_at,
          users (email),
          user_profiles (display_name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        userId: log.user_id,
        userEmail: log.users?.email || 'Unknown',
        userName: log.user_profiles?.[0]?.display_name || 'Unknown',
        action: log.action,
        resourceType: log.resource_type,
        resourceId: log.resource_id,
        details: log.details,
        ipAddress: log.ip_address,
        createdAt: log.created_at
      }));
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  },

  // Get logs for a specific user
  getUserLogs: async (userId, limit = 50) => {
    return await auditService.getLogs({
      userId,
      limit
    });
  },

  // Get logs for a specific action
  getActionLogs: async (action, limit = 50) => {
    return await auditService.getLogs({
      action,
      limit
    });
  },

  // Get logs for a specific resource
  getResourceLogs: async (resourceType, resourceId) => {
    return await auditService.getLogs({
      resourceType,
      limit: 100
    }).then(logs => logs.filter(log => log.resourceId === resourceId));
  },

  // Get recent admin actions
  getRecentActions: async (limit = 20) => {
    return await auditService.getLogs({
      limit
    });
  },

  // Common logging shortcuts
  logPostCreated: async (postId, postTitle) => {
    const { data: userData } = await supabase.auth.getUser();
    return await auditService.log(
      'CREATE_POST',
      'article',
      postId,
      { title: postTitle }
    );
  },

  logPostDeleted: async (postId, postTitle) => {
    return await auditService.log(
      'DELETE_POST',
      'article',
      postId,
      { title: postTitle }
    );
  },

  logFileUploaded: async (fileId, fileName) => {
    return await auditService.log(
      'UPLOAD_FILE',
      'file',
      fileId,
      { fileName }
    );
  },

  logFileDeleted: async (fileId, fileName) => {
    return await auditService.log(
      'DELETE_FILE',
      'file',
      fileId,
      { fileName }
    );
  },

  logUserCreated: async (userId, email) => {
    return await auditService.log(
      'CREATE_USER',
      'user',
      userId,
      { email }
    );
  },

  // Get client IP address (best effort)
  getClientIp: async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        timeout: 3000
      });
      if (!response.ok) throw new Error('IP fetch failed');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.debug('Could not fetch client IP:', error);
      return 'unknown';
    }
  },

  // Export logs as CSV (admin utility)
  exportLogsAsCSV: async (filters = {}) => {
    const logs = await auditService.getLogs(filters);

    if (logs.length === 0) {
      return '';
    }

    const headers = ['ID', 'DateTime', 'User', 'Email', 'Action', 'Resource Type', 'Resource ID', 'IP Address'];
    const rows = logs.map(log => [
      log.id,
      new Date(log.createdAt).toISOString(),
      log.userName,
      log.userEmail,
      log.action,
      log.resourceType || '',
      log.resourceId || '',
      log.ipAddress
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csv;
  }
};
