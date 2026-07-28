import { auth } from '../js/auth.js';
import { postService } from '../js/postService.js';
import { roleService } from '../js/roleService.js';
import { auditService } from '../js/auditService.js';
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
            <a class="nav-link" data-bs-toggle="tab" href="#users">
              <i class="bi bi-people me-1"></i>Users
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#auditlogs">
              <i class="bi bi-clock-history me-1"></i>Audit Logs
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#settings">
              <i class="bi bi-gear me-1"></i>Settings
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

          <!-- Users Tab -->
          <div class="tab-pane fade" id="users">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3>User Management</h3>
              <div>
                <button class="btn btn-primary" id="refreshUsersBtn" title="Refresh user list">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>

            <!-- User Filters -->
            <div class="card mb-3">
              <div class="card-body">
                <div class="row g-2">
                  <div class="col-md-6">
                    <input type="text" class="form-control" id="userSearchInput" placeholder="Search by email or name...">
                  </div>
                  <div class="col-md-6">
                    <select class="form-select" id="userRoleFilter">
                      <option value="">All Roles</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div id="usersContainer"></div>
          </div>

          <!-- Audit Logs Tab -->
          <div class="tab-pane fade" id="auditlogs">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3>Audit Logs</h3>
              <div>
                <button class="btn btn-primary" id="refreshLogsBtn" title="Refresh logs">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-success" id="exportLogsBtn" title="Export as CSV">
                  <i class="bi bi-download"></i> Export CSV
                </button>
              </div>
            </div>

            <!-- Audit Log Filters -->
            <div class="card mb-3">
              <div class="card-body">
                <div class="row g-2">
                  <div class="col-md-3">
                    <input type="text" class="form-control" id="logActionFilter" placeholder="Filter by action...">
                  </div>
                  <div class="col-md-3">
                    <input type="text" class="form-control" id="logUserFilter" placeholder="Filter by user...">
                  </div>
                  <div class="col-md-3">
                    <select class="form-select" id="logResourceFilter">
                      <option value="">All Resources</option>
                      <option value="user">User</option>
                      <option value="article">Article</option>
                      <option value="file">File</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <button class="btn btn-secondary w-100" id="clearLogsFilterBtn">Clear Filters</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="auditLogsContainer"></div>
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
        </div>
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  // Load stats
  await loadStats();

  // Load posts
  await loadAdminPosts();

  // Load users
  await loadUsers();

  // Load audit logs
  await loadAuditLogs();

  // Setup settings form
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    utils.showAlert('Settings saved successfully', 'success');
  });

  // User management event listeners
  document.getElementById('refreshUsersBtn').addEventListener('click', loadUsers);
  document.getElementById('userSearchInput').addEventListener('input', filterUsers);
  document.getElementById('userRoleFilter').addEventListener('change', filterUsers);

  // Audit logs event listeners
  document.getElementById('refreshLogsBtn').addEventListener('click', loadAuditLogs);
  document.getElementById('exportLogsBtn').addEventListener('click', exportAuditLogs);
  document.getElementById('clearLogsFilterBtn').addEventListener('click', clearLogsFilters);
  document.getElementById('logActionFilter').addEventListener('input', filterAuditLogs);
  document.getElementById('logUserFilter').addEventListener('input', filterAuditLogs);
  document.getElementById('logResourceFilter').addEventListener('change', filterAuditLogs);
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

async function loadUsers() {
  try {
    utils.showSpinner('usersContainer');
    const users = await roleService.getAllUsers();

    if (users.length === 0) {
      utils.showEmptyState('usersContainer', 'No users found', 'people');
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
    `;

    users.forEach(user => {
      const statusBadge = user.is_active
        ? '<span class="badge bg-success">Active</span>'
        : '<span class="badge bg-secondary">Inactive</span>';

      const roleBadge = user.role === 'admin'
        ? '<span class="badge bg-danger">Admin</span>'
        : '<span class="badge bg-info">User</span>';

      html += `
        <tr data-user-id="${user.id}" data-user-email="${user.email}">
          <td><strong>${user.email}</strong></td>
          <td>${user.name}</td>
          <td>${roleBadge}</td>
          <td>${statusBadge}</td>
          <td>${utils.formatDateShort(user.created_at)}</td>
          <td class="action-icons">
            <button class="btn btn-sm btn-primary edit-user-btn" data-user-id="${user.id}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm ${user.is_active ? 'btn-warning' : 'btn-success'} toggle-user-status-btn" data-user-id="${user.id}" title="${user.is_active ? 'Deactivate' : 'Activate'}">
              <i class="bi bi-${user.is_active ? 'lock' : 'unlock'}"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="Delete">
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

    document.getElementById('usersContainer').innerHTML = html;

    // Store users for filtering
    window.allUsers = users;

    // Setup user action listeners
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => editUser(e.currentTarget.dataset.userId));
    });

    document.querySelectorAll('.toggle-user-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => toggleUserStatus(e.currentTarget.dataset.userId));
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => deleteUser(e.currentTarget.dataset.userId));
    });
  } catch (error) {
    console.error('Error loading users:', error);
    utils.showAlert('Error loading users', 'danger');
  }
}

function filterUsers() {
  const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
  const roleFilter = document.getElementById('userRoleFilter').value;
  const rows = document.querySelectorAll('#usersTableBody tr');

  rows.forEach(row => {
    const email = row.dataset.userEmail.toLowerCase();
    const cellText = row.textContent.toLowerCase();
    const roleCell = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

    const matchesSearch = email.includes(searchTerm) || cellText.includes(searchTerm);
    const matchesRole = !roleFilter || roleCell.includes(roleFilter);

    row.style.display = matchesSearch && matchesRole ? '' : 'none';
  });
}

async function editUser(userId) {
  const user = window.allUsers.find(u => u.id === userId);
  if (!user) return;

  const currentRole = user.role;
  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  if (!confirm(`Change ${user.email}'s role from ${currentRole} to ${newRole}?`)) return;

  try {
    utils.showSpinner('usersContainer');
    await roleService.assignRole(userId, newRole);
    utils.showAlert(`User role changed to ${newRole}`, 'success');
    await loadUsers();
  } catch (error) {
    console.error('Error changing user role:', error);
    utils.showAlert('Error changing user role', 'danger');
  }
}

async function toggleUserStatus(userId) {
  const user = window.allUsers.find(u => u.id === userId);
  if (!user) return;

  const action = user.is_active ? 'deactivate' : 'activate';
  if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.email}?`)) return;

  try {
    if (user.is_active) {
      await roleService.deactivateUser(userId);
    } else {
      await roleService.reactivateUser(userId);
    }
    utils.showAlert(`User ${action}d successfully`, 'success');
    await loadUsers();
  } catch (error) {
    console.error('Error toggling user status:', error);
    utils.showAlert(`Error ${action}ing user`, 'danger');
  }
}

async function deleteUser(userId) {
  const user = window.allUsers.find(u => u.id === userId);
  if (!user) return;

  if (!confirm(`Permanently delete ${user.email}? This action cannot be undone.`)) return;

  try {
    utils.showSpinner('usersContainer');
    await roleService.deleteUser(userId);
    utils.showAlert('User deleted successfully', 'success');
    await loadUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    utils.showAlert('Error deleting user', 'danger');
  }
}

async function loadAuditLogs() {
  try {
    utils.showSpinner('auditLogsContainer');
    const logs = await auditService.getLogs({ limit: 100 });

    if (logs.length === 0) {
      utils.showEmptyState('auditLogsContainer', 'No audit logs', 'clock-history');
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-hover table-sm">
          <thead class="table-light">
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody id="auditLogsTableBody">
    `;

    logs.forEach(log => {
      const detailsBtn = log.details && Object.keys(log.details).length > 0
        ? `<button class="btn btn-xs btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#detailsModal" onclick="window.showLogDetails('${JSON.stringify(log.details).replace(/'/g, "&#39;")}')"><i class="bi bi-info-circle"></i></button>`
        : '-';

      html += `
        <tr data-action="${log.action}" data-resource="${log.resourceType || ''}" data-user="${log.userName.toLowerCase()}">
          <td><small>${new Date(log.createdAt).toLocaleString()}</small></td>
          <td>${log.userName}<br><small class="text-muted">${log.userEmail}</small></td>
          <td><span class="badge bg-info">${log.action}</span></td>
          <td>${log.resourceType ? `<span class="badge bg-secondary">${log.resourceType}</span>` : '-'}</td>
          <td><small>${log.ipAddress}</small></td>
          <td>${detailsBtn}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <!-- Details Modal -->
      <div class="modal fade" id="detailsModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Log Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <pre id="detailsContent" class="bg-light p-2"></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('auditLogsContainer').innerHTML = html;

    // Store logs for filtering
    window.allAuditLogs = logs;
  } catch (error) {
    console.error('Error loading audit logs:', error);
    utils.showAlert('Error loading audit logs', 'danger');
  }
}

function filterAuditLogs() {
  const actionFilter = document.getElementById('logActionFilter').value.toLowerCase();
  const userFilter = document.getElementById('logUserFilter').value.toLowerCase();
  const resourceFilter = document.getElementById('logResourceFilter').value;
  const rows = document.querySelectorAll('#auditLogsTableBody tr');

  rows.forEach(row => {
    const action = row.dataset.action.toLowerCase();
    const user = row.dataset.user;
    const resource = row.dataset.resource;

    const matchesAction = !actionFilter || action.includes(actionFilter);
    const matchesUser = !userFilter || user.includes(userFilter);
    const matchesResource = !resourceFilter || resource === resourceFilter;

    row.style.display = matchesAction && matchesUser && matchesResource ? '' : 'none';
  });
}

function clearLogsFilters() {
  document.getElementById('logActionFilter').value = '';
  document.getElementById('logUserFilter').value = '';
  document.getElementById('logResourceFilter').value = '';
  filterAuditLogs();
}

async function exportAuditLogs() {
  try {
    const csv = await auditService.exportLogsAsCSV();

    if (!csv) {
      utils.showAlert('No logs to export', 'info');
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    utils.showAlert('Audit logs exported successfully', 'success');
  } catch (error) {
    console.error('Error exporting logs:', error);
    utils.showAlert('Error exporting logs', 'danger');
  }
}

// Global helper for showing log details
window.showLogDetails = (detailsJson) => {
  try {
    const details = JSON.parse(detailsJson);
    document.getElementById('detailsContent').textContent = JSON.stringify(details, null, 2);
  } catch (error) {
    document.getElementById('detailsContent').textContent = detailsJson;
  }
};

// Make functions global
window.adminDeletePost = adminDeletePost;
window.adminEditPost = adminEditPost;
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
