import { hasSupabaseConfig, supabase } from './supabaseClient.js';

let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const saveCurrentUser = (user) => {
  currentUser = user;
  localStorage.setItem('user', JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem('user');
  currentUser = null;
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

      const user = {
        id: data.user?.id || Date.now().toString(),
        email,
        name,
        isAdmin: false,
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

      const user = {
        id: data.user?.id || Date.now().toString(),
        email: data.user?.email || email,
        name: data.user?.user_metadata?.display_name || data.user?.user_metadata?.name || email.split('@')[0],
        isAdmin: data.user?.user_metadata?.isAdmin || email === 'admin@blog.com',
        createdAt: data.user?.created_at || new Date().toISOString()
      };

      saveCurrentUser(user);
      return user;
    }

    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      isAdmin: email === 'admin@blog.com',
      createdAt: new Date().toISOString()
    };
    saveCurrentUser(user);
    return user;
  },

  logout: async () => {
    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }

    clearCurrentUser();
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

document.addEventListener('click', async (e) => {
  if (e.target.closest('a[href="#logout"]')) {
    e.preventDefault();
    await auth.logout();
    updateNavigation();
    window.location.hash = '#home';
  }
});
