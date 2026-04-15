import apiClient from './apiClient';

export function getAllUsersAdmin(token) {
  return apiClient('/api/admin/users', { token });
}

export function getUserByIdAdmin(id, token) {
  return apiClient(`/api/admin/users/${id}`, { token });
}

export function getPendingProviders(token) {
  return apiClient('/api/admin/providers/pending', { token });
}

export function getApprovedProviders(token) {
  return apiClient('/api/admin/providers/approved', { token });
}

export function approveProvider(id, token) {
  return apiClient(`/api/admin/providers/${id}/approve`, {
    method: 'PATCH',
    token,
  });
}

export function rejectProvider(id, token) {
  return apiClient(`/api/admin/providers/${id}/reject`, {
    method: 'PATCH',
    token,
  });
}

export function activateUser(id, token) {
  return apiClient(`/api/admin/users/${id}/activate`, {
    method: 'PATCH',
    token,
  });
}

export function deactivateUser(id, token) {
  return apiClient(`/api/admin/users/${id}/deactivate`, {
    method: 'PATCH',
    token,
  });
}
