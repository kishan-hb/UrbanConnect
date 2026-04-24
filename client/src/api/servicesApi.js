import apiClient from './apiClient';

export function getAllServices(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.zip) {
    searchParams.set('zip', params.zip);
  }

  const query = searchParams.toString();
  const path = query ? `/api/services?${query}` : '/api/services';

  return apiClient(path);
}

export function getServiceById(id) {
  return apiClient(`/api/services/${id}`);
}