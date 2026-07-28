import { auth } from '../js/auth.js';
import { fileService } from '../js/fileService.js';
import { utils } from '../js/utils.js';

export const filesPage = async () => {
  const appContainer = document.getElementById('app');
  const user = auth.getCurrentUser();

  if (!user) {
    window.location.hash = '#login';
    return;
  }

  const html = `
    <div class="page-content">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h1><i class="bi bi-folder me-2"></i>My Files</h1>
            <p class="text-muted">Manage your uploaded files</p>
          </div>
          <div class="col-md-6 text-md-end">
            <button class="btn btn-primary" id="refreshFilesBtn" title="Refresh file list">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        <!-- Storage Usage -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Storage Usage</h6>
                <div class="progress" style="height: 25px;">
                  <div class="progress-bar" id="storageBar" role="progressbar" style="width: 0%"></div>
                </div>
                <small class="text-muted" id="storageText"></small>
              </div>
              <div class="col-md-6">
                <h6>File Statistics</h6>
                <p class="mb-1"><i class="bi bi-file-earmark"></i> <strong id="totalFilesCount">0</strong> files</p>
                <p class="mb-0"><i class="bi bi-hdd"></i> Total size: <strong id="totalSizeText">0 GB</strong></p>
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="card mb-4">
          <div class="card-body">
            <h6 class="card-title">Upload New Files</h6>
            <div class="mb-3">
              <input type="file" class="form-control" id="filesInput" multiple>
              <small class="text-muted d-block mt-2">Select one or more files to upload to your storage</small>
            </div>
            <button class="btn btn-success" id="uploadBtn" disabled>
              <i class="bi bi-cloud-arrow-up me-1"></i>Upload Files
            </button>
            <div id="uploadProgress" class="mt-3"></div>
          </div>
        </div>

        <!-- Files List -->
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">Your Files</h6>
          </div>
          <div class="card-body">
            <div id="filesContainer"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  appContainer.innerHTML = html;

  // Load storage usage and files
  await loadStorageUsage();
  await loadUserFiles();

  // Setup event listeners
  document.getElementById('refreshFilesBtn').addEventListener('click', loadUserFiles);
  document.getElementById('filesInput').addEventListener('change', handleFilesInputChange);
  document.getElementById('uploadBtn').addEventListener('click', uploadFiles);
};

async function loadStorageUsage() {
  try {
    const user = auth.getCurrentUser();
    if (!user) return;

    const usage = await fileService.getStorageUsage(user.id);

    if (usage) {
      const maxStorageGB = 5;
      const usedPercent = (usage.totalSize / (maxStorageGB * 1024 * 1024 * 1024)) * 100;

      document.getElementById('storageBar').style.width = Math.min(usedPercent, 100) + '%';
      document.getElementById('storageText').textContent =
        `${usage.totalSizeGB} GB / ${maxStorageGB} GB used`;

      document.getElementById('totalFilesCount').textContent = usage.totalFiles;
      document.getElementById('totalSizeText').textContent = usage.totalSizeGB + ' GB';
    }
  } catch (error) {
    console.error('Error loading storage usage:', error);
  }
}

async function loadUserFiles() {
  try {
    utils.showSpinner('filesContainer');
    const user = auth.getCurrentUser();
    if (!user) return;

    const files = await fileService.getUserFiles(user.id);

    if (files.length === 0) {
      utils.showEmptyState('filesContainer', 'No files uploaded yet', 'file-earmark');
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    files.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(2);
      const typeIcon = getFileIcon(file.type);

      html += `
        <tr>
          <td>
            <i class="bi ${typeIcon} me-2"></i>
            <strong>${file.name}</strong>
            ${file.isPublic ? '<span class="badge bg-info ms-2">Public</span>' : '<span class="badge bg-secondary ms-2">Private</span>'}
          </td>
          <td><small>${sizeKB} KB</small></td>
          <td><small class="text-muted">${file.type || 'Unknown'}</small></td>
          <td><small>${utils.formatDateShort(file.createdAt)}</small></td>
          <td class="action-icons">
            <a href="${file.url}" class="btn btn-sm btn-primary" title="Download" download>
              <i class="bi bi-download"></i>
            </a>
            <button class="btn btn-sm btn-info" onclick="window.copyFileUrl('${file.url}')" title="Copy URL">
              <i class="bi bi-link-45deg"></i>
            </button>
            <button class="btn btn-sm btn-warning" onclick="window.toggleFileVisibility('${file.id}')" title="Toggle visibility">
              <i class="bi bi-${file.isPublic ? 'eye-slash' : 'eye'}"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.deleteFile('${file.id}', '${file.path}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('filesContainer').innerHTML = html;
  } catch (error) {
    console.error('Error loading user files:', error);
    utils.showAlert('Error loading files', 'danger');
  }
}

function handleFilesInputChange(event) {
  const uploadBtn = document.getElementById('uploadBtn');
  uploadBtn.disabled = event.target.files.length === 0;
}

async function uploadFiles() {
  const filesInput = document.getElementById('filesInput');
  const files = filesInput.files;

  if (files.length === 0) return;

  const uploadBtn = document.getElementById('uploadBtn');
  const progressDiv = document.getElementById('uploadProgress');

  uploadBtn.disabled = true;

  let html = '<div class="alert alert-info">Uploading files...</div>';
  progressDiv.innerHTML = html;

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      await fileService.uploadFile(file);
      successCount++;
    } catch (error) {
      console.error('Error uploading file:', error);
      errorCount++;
    }
  }

  uploadBtn.disabled = false;

  if (successCount > 0) {
    progressDiv.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle"></i> ${successCount} file(s) uploaded successfully</div>`;
    filesInput.value = '';
    await loadStorageUsage();
    await loadUserFiles();
  }

  if (errorCount > 0) {
    utils.showAlert(`Error uploading ${errorCount} file(s)`, 'danger');
  }

  setTimeout(() => {
    progressDiv.innerHTML = '';
  }, 3000);
}

function getFileIcon(mimeType) {
  if (!mimeType) return 'bi-file-earmark';

  if (mimeType.startsWith('image/')) return 'bi-file-earmark-image';
  if (mimeType.startsWith('video/')) return 'bi-file-earmark-play';
  if (mimeType.startsWith('audio/')) return 'bi-file-earmark-music';
  if (mimeType.includes('pdf')) return 'bi-file-earmark-pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'bi-file-earmark-word';
  if (mimeType.includes('sheet') || mimeType.includes('spreadsheet')) return 'bi-file-earmark-spreadsheet';
  if (mimeType.includes('presentation')) return 'bi-file-earmark-slides';

  return 'bi-file-earmark';
}

async function deleteFile(fileId, filePath) {
  if (!confirm('Delete this file? This action cannot be undone.')) return;

  try {
    await fileService.deleteFile(fileId, filePath);
    utils.showAlert('File deleted successfully', 'success');
    await loadStorageUsage();
    await loadUserFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    utils.showAlert('Error deleting file', 'danger');
  }
}

function toggleFileVisibility(fileId) {
  // This would require an update function in fileService to toggle is_public
  utils.showAlert('Feature coming soon', 'info');
}

function copyFileUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    utils.showAlert('URL copied to clipboard', 'success');
  }).catch(() => {
    utils.showAlert('Failed to copy URL', 'danger');
  });
}

// Make functions global
window.deleteFile = deleteFile;
window.toggleFileVisibility = toggleFileVisibility;
window.copyFileUrl = copyFileUrl;
