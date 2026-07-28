import { supabase, hasSupabaseConfig } from './supabaseClient.js';

export const fileService = {
  // Upload file to Supabase Storage
  uploadFile: async (file, articleId = null) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Create unique file name
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${userData.user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      // Record in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('user_files')
        .insert({
          user_id: userData.user.id,
          article_id: articleId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          storage_bucket: 'articles',
          is_public: true
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Log file upload
      await import('./auditService.js').then(m =>
        m.auditService.logFileUploaded(fileRecord.id, file.name)
      );

      return {
        id: fileRecord.id,
        name: file.name,
        path: filePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        createdAt: fileRecord.created_at
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get download URL for a file
  getDownloadUrl: async (filePath, expiresIn = 3600) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data, error } = await supabase.storage
        .from('articles')
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },

  // Get public URL for a file
  getPublicUrl: (filePath) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  },

  // Delete file from storage and database
  deleteFile: async (fileId, filePath) => {
    if (!hasSupabaseConfig) return null;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('articles')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Get file name before deleting
      const { data: fileRecord } = await supabase
        .from('user_files')
        .select('file_name')
        .eq('id', fileId)
        .single();

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // Log file deletion
      if (fileRecord) {
        await import('./auditService.js').then(m =>
          m.auditService.logFileDeleted(fileId, fileRecord.file_name)
        );
      }

      return { success: true, message: 'File deleted' };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get all files for current user
  getUserFiles: async (userId = null) => {
    if (!hasSupabaseConfig) return [];

    try {
      let query = supabase
        .from('user_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(file => ({
        id: file.id,
        name: file.file_name,
        path: file.file_path,
        size: file.file_size,
        type: file.file_type,
        bucket: file.storage_bucket,
        isPublic: file.is_public,
        articleId: file.article_id,
        url: fileService.getPublicUrl(file.file_path),
        createdAt: file.created_at
      }));
    } catch (error) {
      console.error('Error getting user files:', error);
      return [];
    }
  },

  // Get all files for an article
  getArticleFiles: async (articleId) => {
    if (!hasSupabaseConfig) return [];

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(file => ({
        id: file.id,
        name: file.file_name,
        path: file.file_path,
        size: file.file_size,
        type: file.file_type,
        bucket: file.storage_bucket,
        isPublic: file.is_public,
        url: fileService.getPublicUrl(file.file_path),
        createdAt: file.created_at
      }));
    } catch (error) {
      console.error('Error getting article files:', error);
      return [];
    }
  },

  // Get file by ID
  getFile: async (fileId) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.file_name,
        path: data.file_path,
        size: data.file_size,
        type: data.file_type,
        bucket: data.storage_bucket,
        isPublic: data.is_public,
        articleId: data.article_id,
        url: fileService.getPublicUrl(data.file_path),
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  },

  // Update file metadata
  updateFile: async (fileId, updates) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.file_name,
        path: data.file_path,
        size: data.file_size,
        type: data.file_type,
        bucket: data.storage_bucket,
        isPublic: data.is_public,
        url: fileService.getPublicUrl(data.file_path),
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },

  // Check if user can download file
  canDownloadFile: async (fileId, userId) => {
    if (!hasSupabaseConfig) return false;

    try {
      const file = await fileService.getFile(fileId);
      if (!file) return false;

      // Public files can be downloaded
      if (file.isPublic) return true;

      // Check if user is owner
      const fileData = await supabase
        .from('user_files')
        .select('user_id')
        .eq('id', fileId)
        .single();

      if (fileData.data?.user_id === userId) return true;

      // Check if user is admin
      const { roleService } = await import('./roleService.js');
      return await roleService.isAdmin(userId);
    } catch (error) {
      console.error('Error checking download permission:', error);
      return false;
    }
  },

  // Get storage usage for user
  getStorageUsage: async (userId) => {
    if (!hasSupabaseConfig) return null;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('file_size')
        .eq('user_id', userId);

      if (error) throw error;

      const totalSize = (data || []).reduce((sum, file) => sum + (file.file_size || 0), 0);
      const totalFiles = data?.length || 0;

      return {
        totalSize,
        totalFiles,
        totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return null;
    }
  }
};
