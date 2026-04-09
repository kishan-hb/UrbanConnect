import apiClient from './apiClient';

export function getAllServices() {
  return apiClient('/api/services');
}

export function getServiceById(id) {
  return apiClient(`/api/services/${id}`);
}
