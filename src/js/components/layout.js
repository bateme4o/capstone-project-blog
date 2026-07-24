import { appName, isSupabaseConfigured } from '../config.js';

const navItems = [
  { href: 'index.html', label: 'Home', page: 'home' },
  { href: 'posts.html', label: 'Posts', page: 'posts' },
  { href: 'editor.html', label: 'Editor', page: 'editor' },
  { href: 'about.html', label: 'About', page: 'about' }
];

export function renderShell(root, { title, activePage }) {
  document.title = title ? `${title} | ${appName}` : appName;

  root.innerHTML = `
    <div class="app-frame">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top">
        <div class="container">
          <a class="navbar-brand fw-semibold" href="index.html">${appName}</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-1">
              ${navItems
                .map(
                  (item) => `
                    <li class="nav-item">
                      <a class="nav-link ${item.page === activePage ? 'active' : ''}" href="${item.href}">${item.label}</a>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </div>
      </nav>

      <div class="bg-accent"></div>

      <main class="flex-grow-1">
        <div class="container py-4 py-lg-5">
          <div class="alert alert-info border-0 ${isSupabaseConfigured ? 'd-none' : ''}" data-demo-banner>
            Demo mode is active. Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to connect the pages to Supabase.
          </div>
          <section data-page-slot></section>
        </div>
      </main>

      <footer class="border-top border-secondary bg-dark text-light py-4 mt-auto">
        <div class="container d-flex flex-column flex-md-row justify-content-between gap-3">
          <p class="mb-0 text-secondary">Built with Vite, Bootstrap, and Supabase REST endpoints.</p>
          <p class="mb-0 text-secondary">Client-side pages, shared services, and modular layout components.</p>
        </div>
      </footer>
    </div>
  `;

  return root.querySelector('[data-page-slot]');
}