import apiClient from './apiClient';

export function createUser(userData, token) {
  return apiClient('/api/users', {
    method: 'POST',
    body: userData,
    token,
  });
}

export function getUserByClerkId(clerkId, token) {
  return apiClient(`/api/users/clerk/${clerkId}`, { token });
}

export function requestProviderAccess(payload, token) {
  return apiClient('/api/users/request-provider-access', {
    method: 'POST',
    body: payload,
    token,
  });
}
