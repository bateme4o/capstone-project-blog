export const utils = {
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },

  formatDateShort: (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  },

  truncateText: (text, length = 150) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  showAlert: (message, type = 'success') => {
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}" role="alert">
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    const alertContainer = document.getElementById('app');
    if (alertContainer) {
      const div = document.createElement('div');
      div.innerHTML = alertHTML;
      alertContainer.insertBefore(div.firstElementChild, alertContainer.firstChild);

      setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) alert.remove();
      }, 5000);
    }
  },

  showSpinner: (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="spinner"></div>';
    }
  },

  clearContent: (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    return password.length >= 6;
  },

  showEmptyState: (containerId, title = 'No items found', icon = 'inbox') => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-${icon}"></i>
          <h3>${title}</h3>
          <p>No items to display at the moment.</p>
        </div>
      `;
    }
  }
};
