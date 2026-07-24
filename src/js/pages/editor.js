import '../bootstrap.js';
import { renderShell } from '../components/layout.js';
import { createPost, getPostById, updatePost } from '../services/posts-service.js';
import { slugify } from '../utils/dom.js';

const root = document.querySelector('#app');
const slot = renderShell(root, { title: 'Editor', activePage: 'editor' });

slot.innerHTML = `
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
`;

const form = root.querySelector('[data-editor-form]');
const feedback = root.querySelector('[data-form-feedback]');
const saveButton = root.querySelector('[data-save-button]');
const modeLabel = root.querySelector('[data-editor-mode]');
const resetButton = root.querySelector('[data-reset-button]');
const fields = Object.fromEntries(Array.from(form.elements).filter((field) => field.name).map((field) => [field.name, field]));

const query = new URLSearchParams(window.location.search);
const postId = query.get('id');
let activePostId = postId || '';
let slugLocked = false;

function setFeedback(type, message) {
  feedback.innerHTML = message ? `<div class="alert alert-${type} border-0 mb-0">${message}</div>` : '';
}

function collectFormData() {
  return {
    title: fields.title.value.trim(),
    slug: fields.slug.value.trim(),
    author_name: fields.author_name.value.trim(),
    category: fields.category.value.trim(),
    cover_image: fields.cover_image.value.trim(),
    excerpt: fields.excerpt.value.trim(),
    content: fields.content.value.trim(),
    published: fields.published.checked
  };
}

function populateForm(post) {
  fields.title.value = post.title || '';
  fields.slug.value = post.slug || '';
  fields.author_name.value = post.author_name || '';
  fields.category.value = post.category || '';
  fields.cover_image.value = post.cover_image || '';
  fields.excerpt.value = post.excerpt || '';
  fields.content.value = post.content || '';
  fields.published.checked = post.published !== false;
  slugLocked = Boolean(post.slug);
}

fields.title.addEventListener('input', () => {
  if (!slugLocked) {
    fields.slug.value = slugify(fields.title.value);
  }
});

fields.slug.addEventListener('input', () => {
  slugLocked = true;
});

resetButton.addEventListener('click', () => {
  form.reset();
  fields.published.checked = true;
  slugLocked = false;
  activePostId = postId || '';
  setFeedback('secondary', 'Form cleared.');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = collectFormData();

  if (!payload.title || !payload.content || !payload.author_name || !payload.category) {
    setFeedback('danger', 'Title, author, category, and content are required.');
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';

  try {
    const savedPost = activePostId ? await updatePost(activePostId, payload) : await createPost(payload);
    activePostId = savedPost.id;
    modeLabel.textContent = 'Saved successfully';
    setFeedback('success', `Post saved. <a href="post.html?slug=${encodeURIComponent(savedPost.slug)}">Open the article</a>.`);
    populateForm(savedPost);
  } catch (error) {
    setFeedback('danger', error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Save post';
  }
});

async function initialize() {
  if (!activePostId) {
    fields.author_name.value = 'Editorial Team';
    fields.category.value = 'General';
    setFeedback('info', 'Create a new post or open an existing one from the post detail page.');
    return;
  }

  try {
    const post = await getPostById(activePostId);

    if (!post) {
      setFeedback('warning', 'The requested post was not found. Starting a new draft instead.');
      activePostId = '';
      return;
    }

    populateForm(post);
    modeLabel.textContent = `Editing ${post.title}`;
  } catch (error) {
    setFeedback('danger', error.message);
  }
}

initialize();