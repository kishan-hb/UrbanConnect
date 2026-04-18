import apiClient from './apiClient';

export function getAllBookings(token) {
  return apiClient('/api/bookings', { token });
}

export function getBookingById(id, token) {
  return apiClient(`/api/bookings/${id}`, { token });
}

export function confirmBookingAdmin(id, token) {
  return apiClient(`/api/bookings/${id}/confirm`, {
    method: 'PATCH',
    token,
  });
}

export function cancelBookingAdmin(id, token) {
  return apiClient(`/api/bookings/${id}/cancel`, {
    method: 'PATCH',
    token,
  });
}

export function completeBookingAdmin(id, token) {
  return apiClient(`/api/bookings/${id}/complete`, {
    method: 'PATCH',
    token,
  });
}

export function deleteBookingAdmin(id, token) {
  return apiClient(`/api/bookings/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function createBooking(payload, token) {
  return apiClient('/api/bookings', {
    method: 'POST',
    body: payload,
    token,
  });
}


