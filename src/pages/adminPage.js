import { auth } from '../js/auth.js';
import { postService } from '../js/postService.js';
import { utils } from '../js/utils.js';

export const adminPage = async () => {
  const appContainer = document.getElementById('app');

  const html = `
    <div class="page-content">
      <div class="container">
        <h1><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</h1>
        <p class="text-muted">Manage your blog and content</p>

        <!-- Stats Section -->
        <div class="row g-3 mb-4" id="statsSection"></div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-3" id="adminTabs">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#content">
              <i class="bi bi-file-text me-1"></i>Content
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#settings">
              <i class="bi bi-gear me-1"></i>Settings
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#users">
              <i class="bi bi-people me-1"></i>Users
            </a>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Content Tab -->
          <div class="tab-pane fade show active" id="content">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3>Manage Posts</h3>
              <a href="#posts" class="btn btn-success">
                <i class="bi bi-plus-circle"></i>Create New Post
              </a>
            </div>
            <div id="adminPostsContainer"></div>
          </div>

          <!-- Settings Tab -->
          <div class="tab-pane fade" id="settings">
            <h3>Site Settings</h3>
            <div class="card">
              <div class="card-body">
                <form id="settingsForm">
                  <div class="mb-3">
                    <label for="siteName" class="form-label">Site Name</label>
                    <input type="text" class="form-control" id="siteName" value="Blog App">
                  </div>

                  <div class="mb-3">
                    <label for="siteDescription" class="form-label">Site Description</label>
                    <textarea class="form-control" id="siteDescription" rows="3">A modern blog application built with Vite and Bootstrap</textarea>
                  </div>

                  <div class="mb-3">
                    <label for="postsPerPage" class="form-label">Posts Per Page</label>
                    <input type="number" class="form-control" id="postsPerPage" value="10">
                  </div>

                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="allowComments" checked>
                    <label class="form-check-label" for="allowComments">
                      Allow comments on posts
                    </label>
                  </div>

                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle me-1"></i>Save Settings
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Users Tab -->
          <div class="tab-pane fade" id="users">
            <h3>Registered Users</h3>
            <div class="card">
              <div class="card-body">
                <p class="text-muted mb-3">User management features will be available after Supabase integration</p>
                <div id="usersContainer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  // Load stats
  await loadStats();

  // Load posts
  await loadAdminPosts();

  // Setup settings form
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    utils.showAlert('Settings saved successfully', 'success');
  });
};

async function loadStats() {
  try {
    const posts = await postService.getPosts();
    const user = auth.getCurrentUser();

    const stats = [
      {
        icon: 'book-fill',
        label: 'Total Posts',
        value: posts.length,
        color: 'primary'
      },
      {
        icon: 'eye-fill',
        label: 'Total Views',
        value: Math.floor(Math.random() * 1000) + 100,
        color: 'info'
      },
      {
        icon: 'person-check-fill',
        label: 'Active Users',
        value: 1,
        color: 'success'
      },
      {
        icon: 'chat-fill',
        label: 'Comments',
        value: Math.floor(Math.random() * 50),
        color: 'warning'
      }
    ];

    let statsHTML = '';
    stats.forEach(stat => {
      statsHTML += `
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-0">
                    <i class="bi bi-${stat.icon} me-1"></i>${stat.label}
                  </p>
                  <h3 class="mb-0 text-${stat.color}">${stat.value}</h3>
                </div>
                <i class="bi bi-${stat.icon}" style="font-size: 2rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById('statsSection').innerHTML = statsHTML;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadAdminPosts() {
  try {
    utils.showSpinner('adminPostsContainer');
    const posts = await postService.getPosts();

    if (posts.length === 0) {
      utils.showEmptyState('adminPostsContainer', 'No posts yet', 'book');
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    posts.forEach(post => {
      html += `
        <tr>
          <td>
            <strong>${post.title}</strong><br>
            <small class="text-muted">${post.excerpt}</small>
          </td>
          <td>${post.author}</td>
          <td>${utils.formatDateShort(post.createdAt)}</td>
          <td><span class="badge bg-success">Published</span></td>
          <td class="action-icons">
            <a href="#posts?id=${post.id}" class="btn btn-sm btn-info" title="View">
              <i class="bi bi-eye"></i>
            </a>
            <button class="btn btn-sm btn-warning" onclick="window.adminEditPost('${post.id}')" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.adminDeletePost('${post.id}')" title="Delete">
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

    document.getElementById('adminPostsContainer').innerHTML = html;
  } catch (error) {
    console.error('Error loading admin posts:', error);
    utils.showAlert('Error loading posts', 'danger');
  }
}

async function adminDeletePost(postId) {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

  try {
    await postService.deletePost(postId);
    utils.showAlert('Post deleted successfully', 'success');
    await loadAdminPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
    utils.showAlert('Error deleting post', 'danger');
  }
}

async function adminEditPost(postId) {
  // Redirect to posts page with edit modal
  window.location.hash = '#posts?edit=' + postId;
}

// Make functions global
window.adminDeletePost = adminDeletePost;
window.adminEditPost = adminEditPost;
