import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    open: '/index.html'
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(rootDir, 'index.html'),
        posts: resolve(rootDir, 'posts.html'),
        post: resolve(rootDir, 'post.html'),
        editor: resolve(rootDir, 'editor.html'),
        about: resolve(rootDir, 'about.html')
      }
    }
  }
});