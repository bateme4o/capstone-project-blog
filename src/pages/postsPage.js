import { auth } from '../js/auth.js';
import { postService } from '../js/postService.js';
import { fileService } from '../js/fileService.js';
import { utils } from '../js/utils.js';

export const postsPage = async (params) => {
  const appContainer = document.getElementById('app');
  const user = auth.getCurrentUser();

  // Check if viewing a single post
  const postId = params.get('id');
  if (postId) {
    await viewSinglePost(postId);
    return;
  }

  const editPostId = params.get('edit');

  // List all posts
  let html = `
    <div class="page-content">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h1><i class="bi bi-book me-2"></i>All Posts</h1>
          </div>
          <div class="col-md-6 text-md-end">
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">
              <i class="bi bi-plus-circle"></i>Create New Post
            </button>
          </div>
        </div>

        <div id="postsContainer"></div>
      </div>
    </div>

    <!-- Create/Edit Post Modal -->
    <div class="modal fade" id="postModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Create Post</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="postForm">
              <div class="mb-3">
                <label for="postTitle" class="form-label">
                  <i class="bi bi-type me-1"></i>Post Title
                </label>
                <input type="text" class="form-control" id="postTitle" placeholder="Enter post title" required>
              </div>

              <div class="mb-3">
                <label for="postExcerpt" class="form-label">
                  <i class="bi bi-chat-left-quote me-1"></i>Excerpt
                </label>
                <textarea class="form-control" id="postExcerpt" rows="2"
                          placeholder="Brief summary of the post" required></textarea>
              </div>

              <div class="mb-3">
                <label for="postContent" class="form-label">
                  <i class="bi bi-file-text me-1"></i>Content
                </label>
                <textarea class="form-control" id="postContent" rows="6"
                          placeholder="Write your post content here..." required></textarea>
              </div>

              <div class="mb-3">
                <label for="postImage" class="form-label">
                  <i class="bi bi-image me-1"></i>Image URL
                </label>
                <input type="url" class="form-control" id="postImage"
                       placeholder="https://via.placeholder.com/600x300?text=Post" required>
              </div>

              <div class="mb-3">
                <label for="postTags" class="form-label">
                  <i class="bi bi-tags me-1"></i>Tags (comma-separated)
                </label>
                <input type="text" class="form-control" id="postTags"
                       placeholder="JavaScript, Web, Tutorial">
              </div>

              <div class="mb-3">
                <label for="postFiles" class="form-label">
                  <i class="bi bi-file-earmark-arrow-up me-1"></i>Upload Files
                </label>
                <input type="file" class="form-control" id="postFiles" multiple>
                <small class="text-muted d-block mt-2">Upload images, documents, or other files to attach to this post</small>
                <div id="uploadedFilesList" class="mt-2"></div>
              </div>

              <input type="hidden" id="postId">
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="savePostBtn">
              <i class="bi bi-check-circle me-1"></i>Save Post
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  // Load and display posts
  await loadPosts();

  if (editPostId) {
    await editPost(editPostId);
  }

  // Setup modal save handler
  const saveBtn = document.getElementById('savePostBtn');
  saveBtn.addEventListener('click', savePost);

  // Setup file upload handler
  const filesInput = document.getElementById('postFiles');
  if (filesInput) {
    filesInput.addEventListener('change', handleFileUpload);
  }
};

function getPostModal() {
  const modalElement = document.getElementById('postModal');
  if (!modalElement) return null;

  let modal = bootstrap.Modal.getInstance(modalElement);
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }
  return modal;
}

function resetPostModal() {
  const modalTitle = document.querySelector('#postModal .modal-title');
  if (modalTitle) {
    modalTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Create Post';
  }
}

async function loadPosts() {
  try {
    utils.showSpinner('postsContainer');
    const posts = await postService.getPosts();

    if (posts.length === 0) {
      utils.showEmptyState('postsContainer', 'No posts yet', 'book');
      return;
    }

    const user = auth.getCurrentUser();
    let html = '<div class="posts-grid">';

    posts.forEach(post => {
      const editBtn = user ? `
        <button class="btn btn-sm btn-warning" onclick="editPost('${post.id}')">
          <i class="bi bi-pencil"></i>
        </button>
      ` : '';

      const deleteBtn = user ? `
        <button class="btn btn-sm btn-danger" onclick="deletePost('${post.id}')">
          <i class="bi bi-trash"></i>
        </button>
      ` : '';

      html += `
        <div class="card post-card">
          <img src="${post.image}" class="post-card-image" alt="${post.title}">
          <div class="post-card-content">
            <h5 class="post-card-title">${post.title}</h5>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <div class="mb-2">
              ${post.tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join(' ')}
            </div>
            <div class="post-meta">
              <span><i class="bi bi-person"></i>${post.author}</span>
              <span><i class="bi bi-calendar"></i>${utils.formatDateShort(post.createdAt)}</span>
            </div>
            <div class="mt-3 action-icons">
              <a href="#posts?id=${post.id}" class="btn btn-sm btn-primary">
                <i class="bi bi-eye"></i>View
              </a>
              ${editBtn}
              ${deleteBtn}
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    document.getElementById('postsContainer').innerHTML = html;
  } catch (error) {
    console.error('Error loading posts:', error);
    utils.showAlert('Error loading posts', 'danger');
  }
}

async function viewSinglePost(postId) {
  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      document.getElementById('app').innerHTML = '<div class="container"><h1>Post not found</h1></div>';
      return;
    }

    const user = auth.getCurrentUser();
    let actionBtns = '';
    if (user) {
      actionBtns = `
        <div class="btn-group-custom mt-3">
          <button class="btn btn-warning" onclick="editPost('${post.id}')">
            <i class="bi bi-pencil"></i>Edit
          </button>
          <button class="btn btn-danger" onclick="deletePost('${post.id}')">
            <i class="bi bi-trash"></i>Delete
          </button>
          <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#postFilesModal" onclick="window.loadPostFiles('${post.id}')">
            <i class="bi bi-file-earmark"></i>Files
          </button>
        </div>
      `;
    }

    const html = `
      <div class="page-content">
        <div class="container" style="max-width: 800px;">
          <a href="#posts" class="btn btn-secondary mb-3">
            <i class="bi bi-arrow-left"></i>Back to Posts
          </a>

          <article>
            <img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 0.5rem; margin-bottom: 2rem;">
            <h1>${post.title}</h1>

            <div class="post-meta mb-4 pb-3 border-bottom">
              <span><i class="bi bi-person"></i>${post.author}</span>
              <span class="ms-3"><i class="bi bi-calendar"></i>${utils.formatDate(post.createdAt)}</span>
            </div>

            <div class="mb-3">
              ${post.tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join(' ')}
            </div>

            <div style="line-height: 1.8; font-size: 1.05rem;">
              ${post.content.split('\n').map(para => `<p>${para}</p>`).join('')}
            </div>

            ${actionBtns}
          </article>
        </div>
      </div>

      <!-- Post Files Modal -->
      <div class="modal fade" id="postFilesModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-file-earmark me-2"></i>Post Files</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div id="postFilesContainer"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = html;
  } catch (error) {
    console.error('Error loading post:', error);
    utils.showAlert('Error loading post', 'danger');
  }
}

async function savePost() {
  const postId = document.getElementById('postId').value;
  const title = document.getElementById('postTitle').value;
  const excerpt = document.getElementById('postExcerpt').value;
  const content = document.getElementById('postContent').value;
  const image = document.getElementById('postImage').value;
  const tags = document.getElementById('postTags').value
    .split(',')
    .map(t => t.trim())
    .filter(t => t);

  if (!title || !excerpt || !content || !image) {
    utils.showAlert('Please fill in all required fields', 'danger');
    return;
  }

  try {
    const user = auth.getCurrentUser();
    const postData = {
      title,
      excerpt,
      content,
      image,
      tags,
      author: user.name
    };

    if (postId) {
      await postService.updatePost(postId, postData);
      utils.showAlert('Post updated successfully', 'success');
    } else {
      await postService.createPost(postData);
      utils.showAlert('Post created successfully', 'success');
    }

    // Reset form and reload
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    resetPostModal();

    const modal = getPostModal();
    if (modal) {
      modal.hide();
    }

    await loadPosts();
    window.location.hash = '#posts';
  } catch (error) {
    console.error('Error saving post:', error);
    utils.showAlert('Error saving post', 'danger');
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await postService.deletePost(postId);
    utils.showAlert('Post deleted successfully', 'success');
    window.location.hash = '#posts';
  } catch (error) {
    console.error('Error deleting post:', error);
    utils.showAlert('Error deleting post', 'danger');
  }
}

async function editPost(postId) {
  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      utils.showAlert('Post not found', 'danger');
      return;
    }

    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postImage').value = post.image;
    document.getElementById('postTags').value = post.tags.join(', ');

    document.querySelector('#postModal .modal-title').innerHTML =
      '<i class="bi bi-pencil-square me-2"></i>Edit Post';

    const modal = getPostModal();
    if (modal) {
      modal.show();
    }
  } catch (error) {
    console.error('Error loading post for edit:', error);
    utils.showAlert('Error loading post', 'danger');
  }
}

async function handleFileUpload(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  const postId = document.getElementById('postId').value;
  const uploadedFilesList = document.getElementById('uploadedFilesList');

  if (!uploadedFilesList) return;

  let html = '<div class="uploaded-files"><small class="text-muted">Uploading files...</small></div>';
  uploadedFilesList.innerHTML = html;

  const uploadedFiles = [];

  for (const file of files) {
    try {
      const result = await fileService.uploadFile(file, postId || null);
      if (result) {
        uploadedFiles.push(result);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      utils.showAlert(`Error uploading ${file.name}`, 'danger');
    }
  }

  if (uploadedFiles.length > 0) {
    html = `
      <div class="uploaded-files">
        <small class="text-success"><i class="bi bi-check-circle"></i> ${uploadedFiles.length} file(s) uploaded</small>
        <ul class="list-unstyled mt-2">
    `;

    uploadedFiles.forEach(file => {
      html += `
        <li class="d-flex justify-content-between align-items-center py-1">
          <span><i class="bi bi-file-earmark"></i> ${file.name}</span>
          <small class="text-muted">${(file.size / 1024).toFixed(0)} KB</small>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
    uploadedFilesList.innerHTML = html;

    utils.showAlert('Files uploaded successfully', 'success');

    // Store uploaded files for later reference
    window.currentPostFiles = uploadedFiles;
  } else {
    uploadedFilesList.innerHTML = '';
  }

  // Clear file input
  event.target.value = '';
}

async function loadPostFiles(postId) {
  try {
    const files = await fileService.getArticleFiles(postId);

    if (files.length === 0) {
      document.getElementById('postFilesContainer').innerHTML =
        '<p class="text-muted text-center"><i class="bi bi-inbox"></i> No files attached</p>';
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-sm">
          <thead class="table-light">
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    files.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(0);
      html += `
        <tr>
          <td>
            <i class="bi bi-file-earmark"></i> ${file.name}
          </td>
          <td><small>${sizeKB} KB</small></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="window.downloadFile('${file.path}', '${file.name}')">
              <i class="bi bi-download"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.deletePostFile('${file.id}', '${file.path}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('postFilesContainer').innerHTML = html;
  } catch (error) {
    console.error('Error loading post files:', error);
    utils.showAlert('Error loading files', 'danger');
  }
}

async function downloadFile(filePath, fileName) {
  try {
    const url = await fileService.getDownloadUrl(filePath, 3600);
    if (!url) {
      utils.showAlert('Error generating download link', 'danger');
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    utils.showAlert('Error downloading file', 'danger');
  }
}

async function deletePostFile(fileId, filePath) {
  if (!confirm('Delete this file?')) return;

  try {
    await fileService.deleteFile(fileId, filePath);
    utils.showAlert('File deleted successfully', 'success');

    // Reload files if modal is open
    const currentPostId = document.getElementById('postId')?.value;
    if (currentPostId) {
      await loadPostFiles(currentPostId);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    utils.showAlert('Error deleting file', 'danger');
  }
}

// Make functions global for onclick handlers
window.editPost = editPost;
window.deletePost = deletePost;
window.loadPostFiles = loadPostFiles;
window.downloadFile = downloadFile;
window.deletePostFile = deletePostFile;
