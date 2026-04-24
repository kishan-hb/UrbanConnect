import apiClient from './apiClient';

export function getProviderDashboardStats(token) {
  return apiClient('/api/providers/me/dashboard-stats', { token });
}

export function getProviderProfile(token) {
  return apiClient('/api/providers/me', { token });
}

export function getMyServices(token) {
  return apiClient('/api/providers/me/services', { token });
}

export function createService(token, body) {
  return apiClient('/api/services', { method: 'POST', token, body });
}

export function updateService(token, serviceId, body) {
  return apiClient(`/api/services/${serviceId}`, { method: 'PATCH', token, body });
}

export function deleteService(token, serviceId) {
  return apiClient(`/api/services/${serviceId}`, { method: 'DELETE', token });
}
