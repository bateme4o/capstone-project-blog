import{r as p}from"./layout-BCOD6sox.js";import{a as m,l as d}from"./posts-service-z_18iu8_.js";import{f as e,r as g,p as h}from"./content-CeYgp_3t.js";const c=document.querySelector("#app"),u=p(c,{title:"Post details",activePage:"posts"});u.innerHTML=`
  <section data-post-detail>
    <div class="text-center py-5 text-secondary">Loading post…</div>
  </section>
`;const r=c.querySelector("[data-post-detail]");function n(a){return new URLSearchParams(window.location.search).get(a)}async function y(){const a=n("slug"),l=n("id"),t=(a?await m(a):null)||(l?await d({publishedOnly:!1}).then(s=>s.find(i=>i.id===String(l))):null);if(!t){r.innerHTML=`
      <div class="empty-state rounded-4 p-5 text-center border">
        <h1 class="h3 mb-2">Post not found</h1>
        <p class="text-secondary mb-4">The article you requested is not available.</p>
        <a class="btn btn-primary" href="posts.html">Back to posts</a>
      </div>
    `;return}const o=(await d({publishedOnly:!0})).filter(s=>s.slug!==t.slug).filter(s=>s.category===t.category).slice(0,3);r.innerHTML=`
    <article class="row g-4">
      <div class="col-lg-8">
        <a class="text-decoration-none" href="posts.html">&larr; Back to posts</a>
        <div class="mt-3 mb-4">
          <span class="badge text-bg-secondary mb-3">${t.category}</span>
          <h1 class="display-6 fw-bold mb-3">${t.title}</h1>
          <div class="d-flex flex-wrap gap-3 text-secondary">
            <span>By ${t.author_name}</span>
            <span>${e(t.created_at)}</span>
            <span>${g(t.content)} min read</span>
          </div>
        </div>

        ${t.cover_image?`<img class="img-fluid rounded-4 shadow-sm mb-4" src="${t.cover_image}" alt="${t.title}">`:""}

        <div class="article-body fs-5 lh-lg">
          ${h(t.content)}
        </div>

        <div class="d-flex flex-wrap gap-2 mt-4">
          <a class="btn btn-outline-primary" href="editor.html?id=${encodeURIComponent(t.id)}">Edit this post</a>
          <a class="btn btn-outline-secondary" href="editor.html">Create another post</a>
        </div>
      </div>

      <aside class="col-lg-4">
        <div class="sticky-lg-top detail-sidebar rounded-4 p-4 border">
          <h2 class="h5">Article details</h2>
          <dl class="row mb-4">
            <dt class="col-5 text-secondary fw-normal">Category</dt>
            <dd class="col-7">${t.category}</dd>
            <dt class="col-5 text-secondary fw-normal">Published</dt>
            <dd class="col-7">${e(t.created_at)}</dd>
            <dt class="col-5 text-secondary fw-normal">Updated</dt>
            <dd class="col-7">${e(t.updated_at)}</dd>
          </dl>

          <h3 class="h6 text-uppercase text-secondary letter-spacing">Related posts</h3>
          ${o.length?o.map(s=>`
            <a class="related-link d-block text-decoration-none mb-3" href="post.html?slug=${encodeURIComponent(s.slug)}">
              <strong class="d-block text-dark">${s.title}</strong>
              <span class="text-secondary small">${s.category}</span>
            </a>
          `).join(""):'<p class="text-secondary mb-0">No related posts yet.</p>'}
        </div>
      </aside>
    </article>
  `}y();
