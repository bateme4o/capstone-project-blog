import { homePage } from '../pages/homePage.js';
import { loginPage } from '../pages/loginPage.js';
import { registerPage } from '../pages/registerPage.js';
import { postsPage } from '../pages/postsPage.js';
import { adminPage } from '../pages/adminPage.js';
import { auth } from './auth.js';

const routes = {
  home: homePage,
  login: loginPage,
  register: registerPage,
  posts: postsPage,
  admin: adminPage
};

export const router = async () => {
  const hash = window.location.hash.slice(1) || 'home';
  const page = hash.split('?')[0];
  const params = new URLSearchParams(hash.split('?')[1]);

  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Check authentication for protected routes
  if (['posts', 'admin'].includes(page) && !auth.isLoggedIn()) {
    window.location.hash = '#login';
    return;
  }

  if (page === 'admin' && !auth.isAdmin()) {
    window.location.hash = '#home';
    return;
  }

  const route = routes[page];
  if (route) {
    appContainer.innerHTML = '';
    await route(params);
  } else {
    appContainer.innerHTML = '<div class="container"><h1>Page not found</h1></div>';
  }
};
