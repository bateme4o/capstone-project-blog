# Capstone Project Blog

This project is a multipage blog app built with Node.js, npm, Vite, Bootstrap 5, plain JavaScript, and Supabase.

The frontend uses separate HTML entry points for the main pages and keeps UI code, services, and utilities in different files. The app communicates with Supabase through the REST API when environment variables are configured.

## Pages
- Home: `index.html`
- All posts: `posts.html`
- Post details: `post.html`
- Editor: `editor.html`
- About: `about.html`

## Project structure
- `src/js/pages/` for page entry modules
- `src/js/components/` for reusable UI blocks
- `src/js/services/` for Supabase and blog data access
- `src/js/utils/` for formatting and DOM helpers
- `src/styles/main.css` for the global visual system
- `supabase/schema.sql` for the blog table and policies
- `supabase/seed.sql` for starter content

## Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `npm run dev` to start the Vite development server.
4. Run `npm run build` to produce the production bundle.

## Supabase notes
The app is configured to use Supabase REST endpoints through `fetch`. Import `supabase/schema.sql` into your project to create the `posts` table and demo-friendly RLS policies. For production use, tighten the policies before exposing the app publicly.

## Project documentation
See [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) for a detailed summary of the scaffold, file layout, data flow, and the decisions made while building the project.
