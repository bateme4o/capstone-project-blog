import{r as p}from"./layout-BCOD6sox.js";import{s as f,u as b,c as v,g}from"./posts-service-z_18iu8_.js";const r=document.querySelector("#app"),h=p(r,{title:"Editor",activePage:"editor"});h.innerHTML=`
  <section class="mb-4">
    <div class="d-flex justify-content-between align-items-end gap-3 flex-wrap">
      <div>
        <p class="text-uppercase fw-semibold text-secondary mb-1 letter-spacing">Compose</p>
        <h1 class="h2 mb-0">Create or edit a blog post</h1>
      </div>
      <a class="btn btn-outline-secondary" href="posts.html">Back to posts</a>
    </div>
  </section>

  <section class="editor-panel rounded-4 p-4 p-lg-5 border shadow-sm">
    <form class="row g-4" data-editor-form>
      <div class="col-12">
        <label class="form-label" for="title">Title</label>
        <input class="form-control form-control-lg" id="title" name="title" required maxlength="120" placeholder="Write a strong headline">
      </div>

      <div class="col-md-6">
        <label class="form-label" for="slug">Slug</label>
        <input class="form-control" id="slug" name="slug" maxlength="140" placeholder="auto-generated-from-title">
      </div>

      <div class="col-md-6">
        <label class="form-label" for="author_name">Author name</label>
        <input class="form-control" id="author_name" name="author_name" required maxlength="80" placeholder="Editorial Team">
      </div>

      <div class="col-md-6">
        <label class="form-label" for="category">Category</label>
        <input class="form-control" id="category" name="category" required maxlength="50" placeholder="Architecture">
      </div>

      <div class="col-md-6">
        <label class="form-label" for="cover_image">Cover image URL</label>
        <input class="form-control" id="cover_image" name="cover_image" placeholder="https://...">
      </div>

      <div class="col-12">
        <label class="form-label" for="excerpt">Excerpt</label>
        <textarea class="form-control" id="excerpt" name="excerpt" rows="3" maxlength="220" placeholder="Summarize the article in one or two sentences"></textarea>
      </div>

      <div class="col-12">
        <label class="form-label" for="content">Content</label>
        <textarea class="form-control" id="content" name="content" rows="12" required placeholder="Write the main body of the article. Use blank lines to separate paragraphs."></textarea>
      </div>

      <div class="col-12 d-flex flex-wrap gap-3 align-items-center">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="published" name="published" checked>
          <label class="form-check-label" for="published">Publish immediately</label>
        </div>
        <span class="text-secondary small" data-editor-mode>New post mode</span>
      </div>

      <div class="col-12 d-flex flex-wrap gap-2">
        <button class="btn btn-primary btn-lg" type="submit" data-save-button>Save post</button>
        <button class="btn btn-outline-secondary btn-lg" type="button" data-reset-button>Reset</button>
      </div>

      <div class="col-12" data-form-feedback></div>
    </form>
  </section>
`;const i=r.querySelector("[data-editor-form]"),y=r.querySelector("[data-form-feedback]"),n=r.querySelector("[data-save-button]"),d=r.querySelector("[data-editor-mode]"),x=r.querySelector("[data-reset-button]"),t=Object.fromEntries(Array.from(i.elements).filter(e=>e.name).map(e=>[e.name,e])),w=new URLSearchParams(window.location.search),u=w.get("id");let l=u||"",c=!1;function o(e,a){y.innerHTML=a?`<div class="alert alert-${e} border-0 mb-0">${a}</div>`:""}function k(){return{title:t.title.value.trim(),slug:t.slug.value.trim(),author_name:t.author_name.value.trim(),category:t.category.value.trim(),cover_image:t.cover_image.value.trim(),excerpt:t.excerpt.value.trim(),content:t.content.value.trim(),published:t.published.checked}}function m(e){t.title.value=e.title||"",t.slug.value=e.slug||"",t.author_name.value=e.author_name||"",t.category.value=e.category||"",t.cover_image.value=e.cover_image||"",t.excerpt.value=e.excerpt||"",t.content.value=e.content||"",t.published.checked=e.published!==!1,c=!!e.slug}t.title.addEventListener("input",()=>{c||(t.slug.value=f(t.title.value))});t.slug.addEventListener("input",()=>{c=!0});x.addEventListener("click",()=>{i.reset(),t.published.checked=!0,c=!1,l=u||"",o("secondary","Form cleared.")});i.addEventListener("submit",async e=>{e.preventDefault();const a=k();if(!a.title||!a.content||!a.author_name||!a.category){o("danger","Title, author, category, and content are required.");return}n.disabled=!0,n.textContent="Saving...";try{const s=l?await b(l,a):await v(a);l=s.id,d.textContent="Saved successfully",o("success",`Post saved. <a href="post.html?slug=${encodeURIComponent(s.slug)}">Open the article</a>.`),m(s)}catch(s){o("danger",s.message)}finally{n.disabled=!1,n.textContent="Save post"}});async function _(){if(!l){t.author_name.value="Editorial Team",t.category.value="General",o("info","Create a new post or open an existing one from the post detail page.");return}try{const e=await g(l);if(!e){o("warning","The requested post was not found. Starting a new draft instead."),l="";return}m(e),d.textContent=`Editing ${e.title}`}catch(e){o("danger",e.message)}}_();
