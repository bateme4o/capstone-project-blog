export const demoPosts = [
  {
    id: '1',
    title: 'Designing a blog that stays modular from day one',
    slug: 'designing-a-blog-that-stays-modular-from-day-one',
    excerpt: 'A practical structure for separating pages, services, and UI components without introducing a framework.',
    content:
      'Start with clear page boundaries. Keep each page in its own file, move shared layout into reusable components, and keep API access isolated inside services. That gives you a clean upgrade path when the blog grows.\n\nThis capstone keeps the logic split into page modules, services, and utilities so the app can evolve without becoming a monolith.',
    cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Editorial Team',
    category: 'Architecture',
    published: true,
    created_at: '2026-07-12T09:30:00.000Z',
    updated_at: '2026-07-18T11:00:00.000Z'
  },
  {
    id: '2',
    title: 'Using Supabase REST endpoints from a Vite front end',
    slug: 'using-supabase-rest-endpoints-from-a-vite-front-end',
    excerpt: 'A direct REST flow keeps the client lightweight and makes data access easy to inspect.',
    content:
      'Supabase exposes tables through REST endpoints, which means a plain JavaScript client can read and write data with fetch. That is a great fit for simple blog CRUD.\n\nThe important part is keeping the REST access in a single service module so the pages remain focused on rendering and interaction.',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Ava Chen',
    category: 'Supabase',
    published: true,
    created_at: '2026-07-15T14:15:00.000Z',
    updated_at: '2026-07-22T10:20:00.000Z'
  },
  {
    id: '3',
    title: 'Why multi-page navigation still works well for content sites',
    slug: 'why-multi-page-navigation-still-works-well-for-content-sites',
    excerpt: 'Static pages are simple to reason about and pair nicely with component-based rendering.',
    content:
      'A multi-page setup gives each experience its own address and its own HTML entry point. For a blog, that keeps article pages fast and discoverable while preserving clear navigation between listing, detail, and editor views.\n\nIt also maps nicely to Vite because each HTML file can target a separate JavaScript entry.',
    cover_image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Marco Silva',
    category: 'UX',
    published: true,
    created_at: '2026-07-20T08:00:00.000Z',
    updated_at: '2026-07-23T12:35:00.000Z'
  },
  {
    id: '4',
    title: 'Content workflows that stay friendly to future contributors',
    slug: 'content-workflows-that-stay-friendly-to-future-contributors',
    excerpt: 'A predictable editor page and shared utilities lower the cost of maintenance.',
    content:
      'Good content systems are easy to extend. Separate the editor UI from the persistence layer, and keep shared formatting helpers outside the pages. The result is a project that is easier to debug and easier to hand off.',
    cover_image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Editorial Team',
    category: 'Workflow',
    published: true,
    created_at: '2026-07-23T15:45:00.000Z',
    updated_at: '2026-07-24T08:10:00.000Z'
  }
];