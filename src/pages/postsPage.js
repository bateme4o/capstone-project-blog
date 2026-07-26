import { auth } from '../js/auth.js';
import { postService } from '../js/postService.js';
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

  // Setup modal save handler
  const saveBtn = document.getElementById('savePostBtn');
  saveBtn.addEventListener('click', savePost);
};

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
    const modal = bootstrap.Modal.getInstance(document.getElementById('postModal'));
    modal.hide();
    await loadPosts();
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

    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();
  } catch (error) {
    console.error('Error loading post for edit:', error);
    utils.showAlert('Error loading post', 'danger');
  }
}

// Make functions global for onclick handlers
window.editPost = editPost;
window.deletePost = deletePost;
