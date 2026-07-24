import '../bootstrap.js';
import { renderShell } from '../components/layout.js';
import { listPosts, getPostBySlug } from '../services/posts-service.js';
import { formatDate, paragraphs, readingTime } from '../utils/content.js';

const root = document.querySelector('#app');
const slot = renderShell(root, { title: 'Post details', activePage: 'posts' });

slot.innerHTML = `
  <section data-post-detail>
    <div class="text-center py-5 text-secondary">Loading post…</div>
  </section>
`;

const detailContainer = root.querySelector('[data-post-detail]');

function getQueryValue(key) {
  return new URLSearchParams(window.location.search).get(key);
}

async function initialize() {
  const slug = getQueryValue('slug');
  const id = getQueryValue('id');
  const post = slug ? await getPostBySlug(slug) : null;
  const selectedPost = post || (id ? await listPosts({ publishedOnly: false }).then((posts) => posts.find((item) => item.id === String(id))) : null);

  if (!selectedPost) {
    detailContainer.innerHTML = `
      <div class="empty-state rounded-4 p-5 text-center border">
        <h1 class="h3 mb-2">Post not found</h1>
        <p class="text-secondary mb-4">The article you requested is not available.</p>
        <a class="btn btn-primary" href="posts.html">Back to posts</a>
      </div>
    `;
    return;
  }

  const relatedPosts = (await listPosts({ publishedOnly: true }))
    .filter((item) => item.slug !== selectedPost.slug)
    .filter((item) => item.category === selectedPost.category)
    .slice(0, 3);

  detailContainer.innerHTML = `
    <article class="row g-4">
      <div class="col-lg-8">
        <a class="text-decoration-none" href="posts.html">&larr; Back to posts</a>
        <div class="mt-3 mb-4">
          <span class="badge text-bg-secondary mb-3">${selectedPost.category}</span>
          <h1 class="display-6 fw-bold mb-3">${selectedPost.title}</h1>
          <div class="d-flex flex-wrap gap-3 text-secondary">
            <span>By ${selectedPost.author_name}</span>
            <span>${formatDate(selectedPost.created_at)}</span>
            <span>${readingTime(selectedPost.content)} min read</span>
          </div>
        </div>

        ${selectedPost.cover_image ? `<img class="img-fluid rounded-4 shadow-sm mb-4" src="${selectedPost.cover_image}" alt="${selectedPost.title}">` : ''}

        <div class="article-body fs-5 lh-lg">
          ${paragraphs(selectedPost.content)}
        </div>

        <div class="d-flex flex-wrap gap-2 mt-4">
          <a class="btn btn-outline-primary" href="editor.html?id=${encodeURIComponent(selectedPost.id)}">Edit this post</a>
          <a class="btn btn-outline-secondary" href="editor.html">Create another post</a>
        </div>
      </div>

      <aside class="col-lg-4">
        <div class="sticky-lg-top detail-sidebar rounded-4 p-4 border">
          <h2 class="h5">Article details</h2>
          <dl class="row mb-4">
            <dt class="col-5 text-secondary fw-normal">Category</dt>
            <dd class="col-7">${selectedPost.category}</dd>
            <dt class="col-5 text-secondary fw-normal">Published</dt>
            <dd class="col-7">${formatDate(selectedPost.created_at)}</dd>
            <dt class="col-5 text-secondary fw-normal">Updated</dt>
            <dd class="col-7">${formatDate(selectedPost.updated_at)}</dd>
          </dl>

          <h3 class="h6 text-uppercase text-secondary letter-spacing">Related posts</h3>
          ${relatedPosts.length ? relatedPosts.map((item) => `
            <a class="related-link d-block text-decoration-none mb-3" href="post.html?slug=${encodeURIComponent(item.slug)}">
              <strong class="d-block text-dark">${item.title}</strong>
              <span class="text-secondary small">${item.category}</span>
            </a>
          `).join('') : '<p class="text-secondary mb-0">No related posts yet.</p>'}
        </div>
      </aside>
    </article>
  `;
}

initialize();