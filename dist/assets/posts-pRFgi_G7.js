import{r as l}from"./layout-BCOD6sox.js";import{r as d}from"./post-card-DzSWXvM_.js";import{l as p}from"./posts-service-z_18iu8_.js";import"./content-CeYgp_3t.js";const o=document.querySelector("#app"),m=l(o,{title:"All Posts",activePage:"posts"});m.innerHTML=`
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
`;const n=o.querySelector("[data-post-search]"),a=o.querySelector("[data-post-list]"),i=o.querySelector("[data-post-count]");let s=[];function c(t){if(i.textContent=`${t.length} post${t.length===1?"":"s"}`,!t.length){a.innerHTML=`
      <div class="col-12">
        <div class="empty-state rounded-4 p-5 text-center border">
          <h2 class="h4 mb-2">No matching posts</h2>
          <p class="text-secondary mb-0">Try a different search term or create a new article.</p>
        </div>
      </div>
    `;return}a.innerHTML=t.map(r=>`
        <div class="col-md-6 col-xl-4">
          ${d(r)}
        </div>
      `).join("")}function v(){const t=n.value.trim().toLowerCase();if(!t){c(s);return}const r=s.filter(e=>[e.title,e.excerpt,e.content,e.category,e.author_name].join(" ").toLowerCase().includes(t));c(r)}async function h(){try{s=await p(),c(s)}catch(t){a.innerHTML=`
      <div class="col-12">
        <div class="alert alert-danger border-0">Unable to load posts: ${t.message}</div>
      </div>
    `,i.textContent="0 posts"}}n.addEventListener("input",v);h();
