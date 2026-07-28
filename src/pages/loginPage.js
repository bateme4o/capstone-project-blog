import { auth, updateNavigation } from '../js/auth.js';
import { utils } from '../js/utils.js';

export const loginPage = () => {
  const appContainer = document.getElementById('app');

  const html = `
    <div class="page-content">
      <div class="form-container">
        <div class="text-center mb-4">
          <i class="bi bi-box-arrow-in-right" style="font-size: 3rem; color: #0d6efd;"></i>
          <h2 class="mt-3">Login</h2>
          <p class="text-muted">Sign in to your account</p>
        </div>

        <form id="loginForm">
          <div class="form-group">
            <label for="email" class="form-label">
              <i class="bi bi-envelope"></i>Email Address
            </label>
            <input type="email" class="form-control" id="email" name="email"
                   placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              <i class="bi bi-lock"></i>Password
            </label>
            <input type="password" class="form-control" id="password" name="password"
                   placeholder="Enter your password" required>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3">
            <i class="bi bi-box-arrow-in-right"></i>Login
          </button>
        </form>

        <div class="text-center">
          <p class="text-muted mb-0">
            Don't have an account?
            <a href="#register" class="text-decoration-none">
              <strong>Register here</strong>
            </a>
          </p>
        </div>

        
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!utils.validateEmail(email)) {
      utils.showAlert('Please enter a valid email', 'danger');
      return;
    }

    if (!utils.validatePassword(password)) {
      utils.showAlert('Password must be at least 6 characters', 'danger');
      return;
    }

    try {
      await auth.login(email, password);
      updateNavigation();
      utils.showAlert('Login successful! Welcome back.', 'success');
      setTimeout(() => {
        window.location.hash = '#home';
      }, 1000);
    } catch (error) {
      utils.showAlert('Login failed. Please try again.', 'danger');
    }
  });
};
