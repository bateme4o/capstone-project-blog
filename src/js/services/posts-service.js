import { demoPosts } from '../data/demo-posts.js';
import { hasSupabaseConfig, supabaseRequest } from './supabase.js';
import { slugify } from '../utils/dom.js';

const storageKey = 'capstone-blog-demo-posts';

function getStoredPosts() {
  if (typeof localStorage === 'undefined') {
    return [...demoPosts];
  }

  const savedPosts = localStorage.getItem(storageKey);

  if (!savedPosts) {
    return [...demoPosts];
  }

  try {
    return JSON.parse(savedPosts);
  } catch {
    return [...demoPosts];
  }
}

function storePosts(posts) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(posts));
}

function sortNewestFirst(posts) {
  return [...posts].sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
}

function normalizePost(post) {
  return {
    ...post,
    id: String(post.id),
    slug: post.slug || slugify(post.title),
    excerpt: post.excerpt || '',
    content: post.content || '',
    cover_image: post.cover_image || '',
    author_name: post.author_name || 'Editorial Team',
    category: post.category || 'General',
    published: post.published !== false
  };
}

function uniqueSlug(title, existingSlugs = [], preferredSlug = '') {
  const baseSlug = slugify(preferredSlug || title) || `post-${Date.now()}`;
  let nextSlug = baseSlug;
  let suffix = 2;

  while (existingSlugs.includes(nextSlug)) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return nextSlug;
}

async function loadPostsFromSupabase() {
  const records = await supabaseRequest('/rest/v1/posts', {
    params: {
      select: '*',
      order: 'created_at.desc'
    }
  });

  return Array.isArray(records) ? records.map(normalizePost) : [];
}

export async function listPosts({ limit, search = '', publishedOnly = true } = {}) {
  const posts = hasSupabaseConfig() ? await loadPostsFromSupabase() : sortNewestFirst(getStoredPosts().map(normalizePost));
  const normalizedSearch = search.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const matchesPublished = publishedOnly ? post.published : true;

    if (!matchesPublished) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [post.title, post.excerpt, post.content, post.category, post.author_name]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });

  return limit ? filteredPosts.slice(0, limit) : filteredPosts;
}

export async function getPostBySlug(slug) {
  if (!slug) {
    return null;
  }

  if (hasSupabaseConfig()) {
    const records = await supabaseRequest('/rest/v1/posts', {
      params: {
        select: '*',
        slug: `eq.${slug}`,
        limit: '1'
      }
    });

    return Array.isArray(records) && records.length ? normalizePost(records[0]) : null;
  }

  return sortNewestFirst(getStoredPosts()).map(normalizePost).find((post) => post.slug === slug) || null;
}

export async function getPostById(id) {
  if (!id) {
    return null;
  }

  if (hasSupabaseConfig()) {
    const records = await supabaseRequest('/rest/v1/posts', {
      params: {
        select: '*',
        id: `eq.${id}`,
        limit: '1'
      }
    });

    return Array.isArray(records) && records.length ? normalizePost(records[0]) : null;
  }

  return sortNewestFirst(getStoredPosts()).map(normalizePost).find((post) => post.id === String(id)) || null;
}

export async function createPost(postData) {
  const existingPosts = await listPosts({ publishedOnly: false });
  const slug = uniqueSlug(postData.title, existingPosts.map((post) => post.slug), postData.slug);
  const payload = normalizePost({
    ...postData,
    slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (hasSupabaseConfig()) {
    const records = await supabaseRequest('/rest/v1/posts?select=*', {
      method: 'POST',
      body: payload
    });

    return Array.isArray(records) && records.length ? normalizePost(records[0]) : payload;
  }

  const posts = sortNewestFirst(getStoredPosts());
  posts.unshift(payload);
  storePosts(posts);
  return payload;
}

export async function updatePost(id, postData) {
  const existingPost = await getPostById(id);

  if (!existingPost) {
    throw new Error('The post could not be found.');
  }

  const payload = normalizePost({
    ...existingPost,
    ...postData,
    updated_at: new Date().toISOString()
  });

  if (hasSupabaseConfig()) {
    const records = await supabaseRequest('/rest/v1/posts', {
      method: 'PATCH',
      params: {
        id: `eq.${id}`,
        select: '*'
      },
      body: payload
    });

    return Array.isArray(records) && records.length ? normalizePost(records[0]) : payload;
  }

  const posts = sortNewestFirst(getStoredPosts()).map(normalizePost);
  const nextPosts = posts.map((post) => (post.id === String(id) ? payload : post));
  storePosts(nextPosts);
  return payload;
}

export async function deletePost(id) {
  if (hasSupabaseConfig()) {
    await supabaseRequest('/rest/v1/posts', {
      method: 'DELETE',
      params: {
        id: `eq.${id}`
      }
    });
    return true;
  }

  const nextPosts = getStoredPosts().filter((post) => String(post.id) !== String(id));
  storePosts(nextPosts);
  return true;
}