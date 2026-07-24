import{f as a,r as t,e as r}from"./content-CeYgp_3t.js";function c(e){return`
    <article class="card h-100 shadow-sm border-0 overflow-hidden post-card">
      ${e.cover_image?`<img src="${e.cover_image}" class="card-img-top post-card-image" alt="${e.title}">`:""}
      <div class="card-body d-flex flex-column gap-3">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="badge text-bg-secondary">${e.category}</span>
          <span class="text-secondary small">${a(e.created_at)}</span>
          <span class="text-secondary small">${t(e.content)} min read</span>
        </div>
        <h3 class="h5 card-title mb-0">
          <a class="text-decoration-none text-dark stretched-link" href="post.html?slug=${encodeURIComponent(e.slug)}">${e.title}</a>
        </h3>
        <p class="card-text text-secondary mb-0">${r(e.excerpt||e.content,140)}</p>
        <p class="small text-uppercase letter-spacing text-secondary mb-0">By ${e.author_name}</p>
      </div>
    </article>
  `}export{c as r};
