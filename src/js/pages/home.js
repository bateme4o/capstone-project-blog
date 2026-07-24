import '../bootstrap.js';
import { renderShell } from '../components/layout.js';
import { renderPostCard } from '../components/post-card.js';
import { listPosts } from '../services/posts-service.js';
import { appName } from '../config.js';

const root = document.querySelector('#app');
const slot = renderShell(root, { title: 'Home', activePage: 'home' });

slot.innerHTML = `
  <section class="hero-panel rounded-4 p-4 p-lg-5 mb-5 text-white shadow-lg">
    <div class="row align-items-center g-4">
      <div class="col-lg-7">
        <p class="text-uppercase fw-semibold letter-spacing mb-2 text-warning">Capstone blog</p>
        <h1 class="display-5 fw-bold mb-3">A modular blog app built with Vite, Bootstrap, and Supabase REST.</h1>
        <p class="lead text-white-75 mb-4">Separate pages handle browsing, reading, and editing. Shared services keep API calls isolated, so the UI stays readable and easy to extend.</p>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-warning btn-lg fw-semibold" href="posts.html">Browse posts</a>
          <a class="btn btn-outline-light btn-lg" href="editor.html">Create a post</a>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="glass-card rounded-4 p-4 border border-white border-opacity-10">
          <p class="text-uppercase small text-warning mb-1">Architecture</p>
          <ul class="list-unstyled mb-0 d-grid gap-3">
            <li><strong>Pages:</strong> separate HTML entry points for every screen.</li>
            <li><strong>Components:</strong> reusable card, layout, and banner modules.</li>
            <li><strong>Services:</strong> a Supabase REST client wrapped in one file.</li>
            <li><strong>Utils:</strong> formatting helpers shared across pages.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="mb-5">
    <div class="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-3">
      <div>
        <p class="text-uppercase fw-semibold text-secondary mb-1 letter-spacing">Latest posts</p>
        <h2 class="h1 mb-0">Fresh articles from the editorial feed</h2>
      </div>
      <a class="btn btn-outline-secondary" href="posts.html">View all posts</a>
    </div>
    <div class="row g-4" data-featured-posts>
      <div class="col-12">
        <div class="text-center py-5 text-secondary">Loading posts…</div>
      </div>
    </div>
  </section>

  <section class="row g-4">
    <div class="col-md-4">
      <div class="info-card h-100 p-4 rounded-4 border">
        <p class="badge text-bg-dark mb-3">Multi-page</p>
        <h3 class="h4">Clear navigation between key views</h3>
        <p class="mb-0 text-secondary">Home, listing, detail, editor, and about each have their own HTML file and JavaScript entry point.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="info-card h-100 p-4 rounded-4 border">
        <p class="badge text-bg-dark mb-3">REST API</p>
        <h3 class="h4">Supabase handles the data layer</h3>
        <p class="mb-0 text-secondary">The client talks directly to Supabase table endpoints through fetch, which keeps the backend integration lightweight.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="info-card h-100 p-4 rounded-4 border">
        <p class="badge text-bg-dark mb-3">Maintenance</p>
        <h3 class="h4">Small files with focused responsibilities</h3>
        <p class="mb-0 text-secondary">UI rendering, content formatting, and persistence logic stay separated so future contributors can work locally.</p>
      </div>
    </div>
  </section>
`;

const featuredPosts = root.querySelector('[data-featured-posts]');

async function initialize() {
  try {
    const posts = await listPosts({ limit: 3 });

    if (!posts.length) {
      featuredPosts.innerHTML = `
        <div class="col-12">
          <div class="empty-state rounded-4 p-5 text-center border">
            <h3 class="h4 mb-2">No posts yet</h3>
            <p class="text-secondary mb-0">Add a post from the editor or connect Supabase to load content from your backend.</p>
          </div>
        </div>
      `;
      return;
    }

    featuredPosts.innerHTML = posts
      .map((post) => `
        <div class="col-md-6 col-xl-4">
          ${renderPostCard(post)}
        </div>
      `)
      .join('');
  } catch (error) {
    featuredPosts.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger border-0">Unable to load posts: ${error.message}</div>
      </div>
    `;
  }
}

initialize();

document.title = `${appName} | Home`;