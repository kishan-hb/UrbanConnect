import apiClient from './apiClient';

export function createBooking(payload, token) {
  return apiClient('/api/bookings', {
    method: 'POST',
    body: payload,
    token,
  });
}
