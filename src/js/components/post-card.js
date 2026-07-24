import { excerpt, formatDate, readingTime } from '../utils/content.js';

export function renderPostCard(post) {
  return `
    <article class="card h-100 shadow-sm border-0 overflow-hidden post-card">
      ${post.cover_image ? `<img src="${post.cover_image}" class="card-img-top post-card-image" alt="${post.title}">` : ''}
      <div class="card-body d-flex flex-column gap-3">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="badge text-bg-secondary">${post.category}</span>
          <span class="text-secondary small">${formatDate(post.created_at)}</span>
          <span class="text-secondary small">${readingTime(post.content)} min read</span>
        </div>
        <h3 class="h5 card-title mb-0">
          <a class="text-decoration-none text-dark stretched-link" href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a>
        </h3>
        <p class="card-text text-secondary mb-0">${excerpt(post.excerpt || post.content, 140)}</p>
        <p class="small text-uppercase letter-spacing text-secondary mb-0">By ${post.author_name}</p>
      </div>
    </article>
  `;
}