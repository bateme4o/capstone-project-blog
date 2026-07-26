import { auth } from '../js/auth.js';
import { postService } from '../js/postService.js';
import { utils } from '../js/utils.js';

export const homePage = async () => {
  const appContainer = document.getElementById('app');
  const user = auth.getCurrentUser();

  let content = `
    <div class="page-content">
      <div class="hero-section">
        <h1><i class="bi bi-book-fill me-2"></i>Welcome to Blog App</h1>
        <p>Discover amazing stories and share your thoughts</p>
  `;

  if (!user) {
    content += `
      <div class="btn-group-custom justify-content-center">
        <a href="#login" class="btn btn-primary">
          <i class="bi bi-box-arrow-in-right"></i>Login
        </a>
        <a href="#register" class="btn btn-outline-primary">
          <i class="bi bi-person-plus"></i>Register
        </a>
      </div>
    `;
  } else {
    content += `
      <p>Hello, <strong>${user.name}</strong>! 👋</p>
      <a href="#posts" class="btn btn-primary">
        <i class="bi bi-book"></i>View All Posts
      </a>
    `;
  }

  content += `</div>`;

  // Featured posts section
  content += `
    <div class="container">
      <h2 class="mb-4">
        <i class="bi bi-star-fill me-2 text-warning"></i>Featured Posts
      </h2>
      <div id="featuredPosts"></div>
    </div>
  `;

  appContainer.innerHTML = content;

  // Load featured posts
  try {
    const posts = await postService.getPosts();
    const featured = posts.slice(0, 3);

    if (featured.length === 0) {
      utils.showEmptyState('featuredPosts', 'No posts yet', 'book');
      return;
    }

    let postsHTML = '<div class="posts-grid">';
    featured.forEach(post => {
      postsHTML += `
        <div class="card post-card" onclick="window.location.hash='#posts?id=${post.id}'">
          <img src="${post.image}" class="post-card-image" alt="${post.title}">
          <div class="post-card-content">
            <h5 class="post-card-title">${post.title}</h5>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <div class="post-meta">
              <span><i class="bi bi-person"></i>${post.author}</span>
              <span><i class="bi bi-calendar"></i>${utils.formatDateShort(post.createdAt)}</span>
            </div>
          </div>
        </div>
      `;
    });
    postsHTML += '</div>';

    document.getElementById('featuredPosts').innerHTML = postsHTML;
  } catch (error) {
    console.error('Error loading posts:', error);
    utils.showAlert('Error loading posts', 'danger');
  }
};
