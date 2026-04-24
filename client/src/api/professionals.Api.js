import apiClient from './apiClient';

export async function getApprovedProviders() {
  return apiClient('/api/providers/approved');
}