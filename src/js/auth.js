import { hasSupabaseConfig, supabase } from './supabaseClient.js';

let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
let tokenRefreshInterval = null;

const saveCurrentUser = (user) => {
  currentUser = user;
  localStorage.setItem('user', JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem('user');
  currentUser = null;
};

// Get user role from user_roles table
const fetchUserRole = async (userId) => {
  if (!hasSupabaseConfig) return 'user';

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }

    return data?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

// Refresh JWT token before expiration
const refreshToken = async () => {
  if (!hasSupabaseConfig) return;

  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.warn('Token refresh failed:', error);
      return false;
    }

    if (data.session) {
      console.debug('Token refreshed successfully');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Setup automatic token refresh (30 min before expiration)
const setupTokenRefresh = (expiresIn = 3600) => {
  if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);

  // Refresh 30 minutes before expiration (1800 seconds before)
  const refreshDelay = Math.max((expiresIn - 1800) * 1000, 60000);

  tokenRefreshInterval = setInterval(async () => {
    const refreshed = await refreshToken();
    if (!refreshed) {
      // Token refresh failed, clear user and redirect to login
      await auth.logout();
      window.location.hash = '#login';
    }
  }, refreshDelay);
};

// Clear token refresh interval
const clearTokenRefresh = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
};

export const auth = {
  register: async (email, password, name) => {
    if (hasSupabaseConfig) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      // Get session and setup token refresh
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setupTokenRefresh(sessionData.session.expires_in);
      }

      // Fetch role from user_roles table
      let role = 'user';
      if (data.user?.id) {
        role = await fetchUserRole(data.user.id);
      }

      const user = {
        id: data.user?.id || Date.now().toString(),
        email,
        name,
        role,
        isAdmin: role === 'admin',
        createdAt: data.user?.created_at || new Date().toISOString()
      };

      saveCurrentUser(user);

      if (data.user?.id) {
        try {
          await supabase.from('user_profiles').upsert(
            {
              user_id: data.user.id,
              display_name: name
            },
            { onConflict: 'user_id' }
          );
        } catch (profileError) {
          console.warn('User profile bootstrap skipped:', profileError);
        }
      }

      return user;
    }

    const user = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    saveCurrentUser(user);
    return user;
  },

  login: async (email, password) => {
    if (hasSupabaseConfig) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Setup automatic token refresh
      if (data.session) {
        setupTokenRefresh(data.session.expires_in);
      }

      // Fetch role dynamically from user_roles table
      let role = 'user';
      if (data.user?.id) {
        role = await fetchUserRole(data.user.id);
      }

      const user = {
        id: data.user?.id || Date.now().toString(),
        email: data.user?.email || email,
        name: data.user?.user_metadata?.display_name || data.user?.user_metadata?.name || email.split('@')[0],
        role,
        isAdmin: role === 'admin',
        createdAt: data.user?.created_at || new Date().toISOString()
      };

      saveCurrentUser(user);
      return user;
    }

    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role: 'user',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    saveCurrentUser(user);
    return user;
  },

  logout: async () => {
    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }

    clearTokenRefresh();
    clearCurrentUser();
  },

  getCurrentUser: () => currentUser,

  isLoggedIn: () => !!currentUser,

  isAdmin: () => currentUser?.isAdmin || false,

  // Refresh user's role from database (useful when admin changes user's role)
  refreshUserRole: async () => {
    if (!currentUser?.id) return false;

    try {
      const role = await fetchUserRole(currentUser.id);
      if (currentUser) {
        currentUser.role = role;
        currentUser.isAdmin = role === 'admin';
        saveCurrentUser(currentUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing user role:', error);
      return false;
    }
  },

  // Manually refresh token
  refreshToken: async () => {
    return await refreshToken();
  }
};

export const checkAuth = async () => {
  // Try to restore session from Supabase
  if (hasSupabaseConfig) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session) {
        // Session exists, setup token refresh
        setupTokenRefresh(sessionData.session.expires_in);

        // Restore user from localStorage or fetch from auth
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
          // Refresh role to ensure it's up to date
          const role = await fetchUserRole(currentUser.id);
          currentUser.role = role;
          currentUser.isAdmin = role === 'admin';
          saveCurrentUser(currentUser);
        }
      } else {
        // No session, clear user
        clearCurrentUser();
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
      // Fallback to localStorage
      currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    }
  } else {
    // No Supabase config, just use localStorage
    currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  }

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

document.addEventListener('click', async (e) => {
  if (e.target.closest('a[href="#logout"]')) {
    e.preventDefault();
    await auth.logout();
    updateNavigation();
    window.location.hash = '#home';
  }
});
