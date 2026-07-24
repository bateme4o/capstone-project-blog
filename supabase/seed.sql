insert into public.posts (title, slug, excerpt, content, cover_image, author_name, category, published)
values
  (
    'Designing a blog that stays modular from day one',
    'designing-a-blog-that-stays-modular-from-day-one',
    'A practical structure for separating pages, services, and UI components without introducing a framework.',
    'Start with clear page boundaries. Keep each page in its own file, move shared layout into reusable components, and keep API access isolated inside services. That gives you a clean upgrade path when the blog grows.',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'Editorial Team',
    'Architecture',
    true
  ),
  (
    'Using Supabase REST endpoints from a Vite front end',
    'using-supabase-rest-endpoints-from-a-vite-front-end',
    'A direct REST flow keeps the client lightweight and makes data access easy to inspect.',
    'Supabase exposes tables through REST endpoints, which means a plain JavaScript client can read and write data with fetch. That is a great fit for simple blog CRUD.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    'Ava Chen',
    'Supabase',
    true
  );