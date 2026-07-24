# Project Documentation

## What Was Built
This repository now contains a multipage blog application scaffold built with Node.js, npm, Vite, Bootstrap 5, vanilla JavaScript, and Supabase.

The app was structured to avoid a single monolithic front-end file. Instead, each page has its own HTML entry point and JavaScript module, while shared behavior lives in reusable components, services, and utility files.

## Main Goals
The project was organized around these requirements:

- Multipage navigation instead of a single-page popup-based flow.
- A client-server architecture where the browser app talks to Supabase through REST endpoints.
- Modular front-end code split into pages, components, services, and utils.
- A maintainable file structure that keeps UI, business logic, and styling separate when practical.

## File Structure
The repository is split into the following main areas:

- `index.html`, `posts.html`, `post.html`, `editor.html`, and `about.html` are separate page entry points.
- `src/js/pages/` contains the page bootstraps for each screen.
- `src/js/components/` contains reusable UI building blocks such as the layout shell and post card.
- `src/js/services/` contains the Supabase REST wrapper and blog data logic.
- `src/js/utils/` contains helper functions for formatting dates, slugs, and HTML-safe content.
- `src/styles/main.css` contains the custom visual system and page styling.
- `supabase/schema.sql` defines the posts table, trigger, index, and row-level security policies.
- `supabase/seed.sql` provides starter content for a local or initial database.

## Runtime Flow
The app loads in this order:

1. The HTML page loads a page-specific JavaScript module.
2. The page module imports the shared Bootstrap and global stylesheet bundle.
3. The page module renders the shared shell and page content into `#app`.
4. Page components call the blog service module to load, create, or update posts.
5. The service module either uses Supabase REST endpoints or falls back to demo content when Supabase is not configured.

## Supabase Integration
The front end is prepared to work with Supabase through direct REST calls.

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the app uses the Supabase REST API for blog data. If those environment variables are missing, the app switches to local demo mode so the UI still works for development and review.

The database schema in `supabase/schema.sql` creates the `posts` table and includes policies intended for a simple demo-friendly setup. Before production use, those policies should be tightened to match the real authentication and authorization model.

## Key Design Decisions
These choices were made to keep the project easy to understand and extend:

- Separate HTML files were used for each page so navigation stays explicit and simple.
- Shared UI code was placed in components instead of copying markup across pages.
- API access was isolated inside a service layer to keep pages focused on rendering and interaction.
- Formatting helpers were centralized so dates, excerpts, slugs, and article content are handled consistently.
- A fallback data mode was included so the project can still run before Supabase credentials are provided.

## Validation
The project was validated with a production build after the scaffold was created. The build completed successfully, which confirms the page wiring and module structure are consistent.

## How To Use It
1. Install dependencies with `npm install`.
2. Create a `.env` file from `.env.example`.
3. Set the Supabase URL and anon key.
4. Run `npm run dev` to develop locally.
5. Open the different HTML pages directly or through the navigation bar.

## Notes For Future Work
This scaffold is ready for follow-up enhancements such as:

- Authentication and protected editor routes.
- Image upload integration with Supabase Storage.
- Post comments or tags.
- Rich text editing for article content.
- Stronger production RLS rules.