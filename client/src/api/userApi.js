import apiClient from './apiClient';

export function createUser(userData, token) {
  return apiClient('/api/users', {
    method: 'POST',
    body: userData,
    token,
  });
}

export function getUserByClerkId(clerkId) {
  return apiClient(`/api/users/clerk/${clerkId}`);
}
