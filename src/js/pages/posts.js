import '../bootstrap.js';
import { renderShell } from '../components/layout.js';
import { renderPostCard } from '../components/post-card.js';
import { listPosts } from '../services/posts-service.js';

const root = document.querySelector('#app');
const slot = renderShell(root, { title: 'All Posts', activePage: 'posts' });

slot.innerHTML = `
  <section class="mb-4">
    <div class="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-3">
      <div>
        <p class="text-uppercase fw-semibold text-secondary mb-1 letter-spacing">Browse</p>
        <h1 class="h2 mb-0">All blog posts</h1>
      </div>
      <a class="btn btn-primary" href="editor.html">New post</a>
    </div>
    <div class="row g-3 align-items-center mb-4">
      <div class="col-md-8">
        <input type="search" class="form-control form-control-lg" placeholder="Search posts by title, category, or excerpt" data-post-search>
      </div>
      <div class="col-md-4 text-md-end">
        <span class="badge text-bg-light border text-secondary px-3 py-2" data-post-count>Loading…</span>
      </div>
    </div>
  </section>

  <section>
    <div class="row g-4" data-post-list>
      <div class="col-12 text-center py-5 text-secondary">Loading posts…</div>
    </div>
  </section>
`;

const searchInput = root.querySelector('[data-post-search]');
const postList = root.querySelector('[data-post-list]');
const postCount = root.querySelector('[data-post-count]');

let cachedPosts = [];

function renderPosts(posts) {
  postCount.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}`;

  if (!posts.length) {
    postList.innerHTML = `
      <div class="col-12">
        <div class="empty-state rounded-4 p-5 text-center border">
          <h2 class="h4 mb-2">No matching posts</h2>
          <p class="text-secondary mb-0">Try a different search term or create a new article.</p>
        </div>
      </div>
    `;
    return;
  }

  postList.innerHTML = posts
    .map(
      (post) => `
        <div class="col-md-6 col-xl-4">
          ${renderPostCard(post)}
        </div>
      `
    )
    .join('');
}

function applySearch() {
  const searchValue = searchInput.value.trim().toLowerCase();

  if (!searchValue) {
    renderPosts(cachedPosts);
    return;
  }

  const filteredPosts = cachedPosts.filter((post) =>
    [post.title, post.excerpt, post.content, post.category, post.author_name]
      .join(' ')
      .toLowerCase()
      .includes(searchValue)
  );

  renderPosts(filteredPosts);
}

async function initialize() {
  try {
    cachedPosts = await listPosts();
    renderPosts(cachedPosts);
  } catch (error) {
    postList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger border-0">Unable to load posts: ${error.message}</div>
      </div>
    `;
    postCount.textContent = '0 posts';
  }
}

searchInput.addEventListener('input', applySearch);

initialize();