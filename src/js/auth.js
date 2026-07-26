// Mock auth for now - to be replaced with Supabase
let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

export const auth = {
  register: async (email, password, name) => {
    const user = {
      id: Date.now().toString(),
      email,
      name,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(user));
    currentUser = user;
    return user;
  },

  login: async (email, password) => {
    // Mock login - in production this would validate against Supabase
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      isAdmin: email === 'admin@blog.com',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(user));
    currentUser = user;
    return user;
  },

  logout: () => {
    localStorage.removeItem('user');
    currentUser = null;
  },

  getCurrentUser: () => currentUser,

  isLoggedIn: () => !!currentUser,

  isAdmin: () => currentUser?.isAdmin || false
};

export const checkAuth = () => {
  currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  updateNavigation();
};

export const updateNavigation = () => {
  const navHome = document.getElementById('navHome');
  const navPosts = document.getElementById('navPosts');
  const navAdmin = document.getElementById('navAdmin');
  const navAuth = document.getElementById('navAuth');

  if (!navHome || !navPosts || !navAdmin || !navAuth) return;

  if (auth.isLoggedIn()) {
    navPosts.style.display = 'block';
    navAuth.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown">
        <i class="bi bi-person-circle me-1"></i>${currentUser.name}
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <li><a class="dropdown-item" href="#profile">Profile</a></li>
        <li><a class="dropdown-item" href="#settings">Settings</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#logout">Logout</a></li>
      </ul>
    `;

    if (auth.isAdmin()) {
      navAdmin.style.display = 'block';
    } else {
      navAdmin.style.display = 'none';
    }
  } else {
    navPosts.style.display = 'none';
    navAdmin.style.display = 'none';
    navAuth.innerHTML = `
      <a class="nav-link" href="#login">
        <i class="bi bi-box-arrow-in-right me-1"></i>Login
      </a>
    `;
  }
};

// Handle logout
document.addEventListener('click', (e) => {
  if (e.target.closest('a[href="#logout"]')) {
    e.preventDefault();
    auth.logout();
    updateNavigation();
    window.location.hash = '#home';
  }
});
