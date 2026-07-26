import { auth, updateNavigation } from '../js/auth.js';
import { utils } from '../js/utils.js';

export const registerPage = () => {
  const appContainer = document.getElementById('app');

  const html = `
    <div class="page-content">
      <div class="form-container">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus" style="font-size: 3rem; color: #0d6efd;"></i>
          <h2 class="mt-3">Create Account</h2>
          <p class="text-muted">Join our blogging community</p>
        </div>

        <form id="registerForm">
          <div class="form-group">
            <label for="name" class="form-label">
              <i class="bi bi-person"></i>Full Name
            </label>
            <input type="text" class="form-control" id="name" name="name"
                   placeholder="Enter your full name" required>
          </div>

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

          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              <i class="bi bi-lock-check"></i>Confirm Password
            </label>
            <input type="password" class="form-control" id="confirmPassword" name="confirmPassword"
                   placeholder="Confirm your password" required>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="terms" required>
            <label class="form-check-label" for="terms">
              I agree to the <a href="#" class="text-decoration-none">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3">
            <i class="bi bi-person-plus"></i>Create Account
          </button>
        </form>

        <div class="text-center">
          <p class="text-muted mb-0">
            Already have an account?
            <a href="#login" class="text-decoration-none">
              <strong>Login here</strong>
            </a>
          </p>
        </div>
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!name || name.length < 2) {
      utils.showAlert('Please enter a valid name', 'danger');
      return;
    }

    if (!utils.validateEmail(email)) {
      utils.showAlert('Please enter a valid email', 'danger');
      return;
    }

    if (!utils.validatePassword(password)) {
      utils.showAlert('Password must be at least 6 characters', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      utils.showAlert('Passwords do not match', 'danger');
      return;
    }

    try {
      await auth.register(email, password, name);
      updateNavigation();
      utils.showAlert('Account created successfully! Welcome aboard.', 'success');
      setTimeout(() => {
        window.location.hash = '#home';
      }, 1000);
    } catch (error) {
      utils.showAlert('Registration failed. Please try again.', 'danger');
    }
  });
};
