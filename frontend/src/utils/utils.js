// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate file type
export const validateFileType = (file, allowedTypes = ['pdf', 'png', 'jpg', 'jpeg']) => {
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Validate file size (max 10MB)
export const validateFileSize = (file, maxSizeMB = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Get color by status
export const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444'
  };
  return colors[status] || '#6b7280';
};