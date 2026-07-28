import { hasSupabaseConfig, supabase } from './supabaseClient.js';

// Mock posts - used when Supabase credentials are unavailable.
let posts = JSON.parse(localStorage.getItem('posts')) || [
  {
    id: '1',
    title: 'Getting Started with Vite',
    excerpt: 'Learn how to build fast and modern web applications with Vite.',
    content: 'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts:\n\n1. A dev server that provides rich feature enhancements over native ES modules\n2. A build command that bundles your code with Rollup',
    author: 'John Doe',
    image: 'https://via.placeholder.com/600x300?text=Vite',
    tags: ['JavaScript', 'Vite', 'Build Tools'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    title: 'Bootstrap 5 Essentials',
    excerpt: 'Master the fundamentals of Bootstrap 5 for responsive web design.',
    content: 'Bootstrap is the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first projects on the web. Learn about its grid system, components, and utilities.',
    author: 'Jane Smith',
    image: 'https://via.placeholder.com/600x300?text=Bootstrap',
    tags: ['CSS', 'Bootstrap', 'Design'],
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  }
];

const ARTICLES_VIEW = 'published_articles_with_authors';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mapArticleRow = (article) => ({
  id: article.id,
  title: article.title,
  excerpt: article.excerpt || '',
  content: article.content || '',
  author: article.author_name || article.author_email || 'Unknown author',
  authorEmail: article.author_email || null,
  image: article.featured_image_url || 'https://via.placeholder.com/600x300?text=Post',
  tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
  createdAt: article.published_at || article.created_at || new Date().toISOString(),
  updatedAt: article.updated_at || article.created_at || new Date().toISOString()
});

const getCurrentProfile = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw userError || new Error('You must be signed in to manage posts.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, display_name')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    throw new Error('No user profile found for the current account.');
  }

  return profile;
};

const syncArticleTags = async (articleId, tags) => {
  const cleanTags = [...new Set((tags || []).map(tag => tag.trim()).filter(Boolean))];

  await supabase.from('article_tags').delete().eq('article_id', articleId);

  if (cleanTags.length === 0) {
    return;
  }

  const tagPayload = cleanTags.map(name => ({
    name,
    slug: slugify(name),
    description: null
  }));

  const { error: tagError } = await supabase
    .from('tags')
    .upsert(tagPayload, { onConflict: 'slug' });

  if (tagError) {
    throw tagError;
  }

  const { data: tagRows, error: fetchError } = await supabase
    .from('tags')
    .select('id, slug')
    .in('slug', tagPayload.map(tag => tag.slug));

  if (fetchError) {
    throw fetchError;
  }

  const articleTagRows = tagRows.map(tag => ({
    article_id: articleId,
    tag_id: tag.id
  }));

  const { error: articleTagError } = await supabase
    .from('article_tags')
    .insert(articleTagRows);

  if (articleTagError) {
    throw articleTagError;
  }
};

export const postService = {
  getPosts: async () => {
    if (hasSupabaseConfig) {
      const { data, error } = await supabase
        .from(ARTICLES_VIEW)
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error) {
        throw error;
      }

      return (data || []).map(mapArticleRow);
    }

    return new Promise(resolve => {
      setTimeout(() => resolve([...posts]), 300);
    });
  },

  getPostById: async (id) => {
    if (hasSupabaseConfig) {
      const { data, error } = await supabase
        .from(ARTICLES_VIEW)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ? mapArticleRow(data) : null;
    }

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(posts.find(p => p.id === id));
      }, 300);
    });
  },

  createPost: async (post) => {
    if (hasSupabaseConfig) {
      const profile = await getCurrentProfile();
      const slug = `${slugify(post.title)}-${Date.now().toString(36)}`;

      const { data, error } = await supabase
        .from('articles')
        .insert({
          author_id: profile.id,
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          featured_image_url: post.image,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (Array.isArray(post.tags) && post.tags.length > 0) {
        await syncArticleTags(data.id, post.tags);
      }

      return mapArticleRow({
        ...data,
        author_name: profile.display_name,
        tags: post.tags || []
      });
    }

    return new Promise(resolve => {
      setTimeout(() => {
        const newPost = {
          ...post,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        resolve(newPost);
      }, 300);
    });
  },

  updatePost: async (id, updates) => {
    if (hasSupabaseConfig) {
      const profile = await getCurrentProfile();
      const { data: existing, error: existingError } = await supabase
        .from('articles')
        .select('slug')
        .eq('id', id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      const { data, error } = await supabase
        .from('articles')
        .update({
          title: updates.title,
          slug: existing?.slug || `${slugify(updates.title)}-${Date.now().toString(36)}`,
          excerpt: updates.excerpt,
          content: updates.content,
          featured_image_url: updates.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (Array.isArray(updates.tags)) {
        await syncArticleTags(id, updates.tags);
      }

      return mapArticleRow({
        ...data,
        author_name: profile.display_name,
        tags: updates.tags || []
      });
    }

    return new Promise(resolve => {
      setTimeout(() => {
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
          posts[index] = {
            ...posts[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('posts', JSON.stringify(posts));
          resolve(posts[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  deletePost: async (id) => {
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    }

    return new Promise(resolve => {
      setTimeout(() => {
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
          const deleted = posts.splice(index, 1)[0];
          localStorage.setItem('posts', JSON.stringify(posts));
          resolve(deleted);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }
};