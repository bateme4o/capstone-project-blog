// Mock posts - to be replaced with Supabase
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

export const postService = {
  getPosts: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...posts]), 300);
    });
  },

  getPostById: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(posts.find(p => p.id === id));
      }, 300);
    });
  },

  createPost: async (post) => {
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
