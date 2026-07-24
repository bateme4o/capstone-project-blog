import '../bootstrap.js';
import { renderShell } from '../components/layout.js';
import { isSupabaseConfigured } from '../config.js';

const root = document.querySelector('#app');
const slot = renderShell(root, { title: 'About', activePage: 'about' });

slot.innerHTML = `
  <section class="row g-4 align-items-start mb-5">
    <div class="col-lg-7">
      <p class="text-uppercase fw-semibold text-secondary mb-1 letter-spacing">About the project</p>
      <h1 class="display-6 fw-bold mb-3">A blog app designed to stay understandable as it grows.</h1>
      <p class="lead text-secondary">This capstone uses a multi-page front end, a Supabase backend, and a small set of focused modules so that the codebase stays easy to maintain.</p>
    </div>
    <div class="col-lg-5">
      <div class="about-panel rounded-4 p-4 border">
        <h2 class="h5">What makes the structure maintainable</h2>
        <ul class="mb-0 ps-3">
          <li>Each screen has a dedicated HTML file and JavaScript entry point.</li>
          <li>Business logic lives in services instead of page files.</li>
          <li>Shared formatting and DOM helpers are reused everywhere.</li>
          <li>Supabase access is isolated behind a REST wrapper.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="row g-4">
    <div class="col-md-4">
      <div class="feature-panel rounded-4 p-4 border h-100">
        <h2 class="h5">Frontend</h2>
        <p class="text-secondary mb-0">Vanilla JavaScript, Bootstrap 5, and Vite keep the UI fast and easy to reason about.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="feature-panel rounded-4 p-4 border h-100">
        <h2 class="h5">Backend</h2>
        <p class="text-secondary mb-0">Supabase provides the hosted database and REST API used by the blog pages when configured.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="feature-panel rounded-4 p-4 border h-100">
        <h2 class="h5">Status</h2>
        <p class="text-secondary mb-0">${isSupabaseConfigured ? 'Supabase is connected.' : 'Demo mode is active until the environment variables are set.'}</p>
      </div>
    </div>
  </section>
`;