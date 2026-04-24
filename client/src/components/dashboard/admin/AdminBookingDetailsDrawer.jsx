import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  cancelBookingAdmin,
  completeBookingAdmin,
  confirmBookingAdmin,
  getBookingById,
} from '../../../api/bookingApi';
import { getAllUsersAdmin } from '../../../api/adminApi';
import { getAllServices } from '../../../api/servicesApi';

function formatDateTime(value) {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(value) {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function AdminBookingDetailsDrawer({ bookingId, isOpen, onClose, onBookingUpdated }) {
  const { authState } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [actionLoading, setActionLoading] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    async function loadDetails() {
      if (!isOpen || !bookingId || !authState?.isLoaded) return;

      if (!authState?.token) {
        setError('Admin authentication is required to load booking details.');
        return;
      }

      try {
        setLoading(true);
        setError('');
        setActionError('');

        const [bookingData, usersData, servicesData] = await Promise.all([
          getBookingById(bookingId, authState.token),
          getAllUsersAdmin(authState.token),
          getAllServices(),
        ]);

        setBooking(bookingData || null);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [isOpen, bookingId, authState?.isLoaded, authState?.token]);

  async function handleBookingAction(action) {
    if (!booking?._id || !authState?.token) return;

    if (action === 'cancel') {
      const confirmed = window.confirm(
        'Cancel this booking? This will move it to cancelled status.'
      );
      if (!confirmed) return;
    }

    if (action === 'complete') {
      const confirmed = window.confirm(
        'Mark this booking as completed? This should only be used after service is done.'
      );
      if (!confirmed) return;
    }

    try {
      setActionLoading(action);
      setActionError('');

      let updated = null;
      if (action === 'approve') {
        updated = await confirmBookingAdmin(booking._id, authState.token);
      } else if (action === 'cancel') {
        updated = await cancelBookingAdmin(booking._id, authState.token);
      } else if (action === 'complete') {
        updated = await completeBookingAdmin(booking._id, authState.token);
      }

      if (updated) {
        setBooking(updated);
        if (onBookingUpdated) {
          onBookingUpdated(updated);
        }
        if (action === 'approve' || action === 'cancel' || action === 'complete') {
          onClose();
        }
      }
    } catch (actionErr) {
      setActionError(actionErr.message || 'Unable to update booking status.');
    } finally {
      setActionLoading('');
    }
  }

  const customer = useMemo(() => {
    if (!booking?.customerClerkId) return null;
    return users.find((user) => user.clerkId === booking.customerClerkId) || null;
  }, [users, booking?.customerClerkId]);

  const provider = useMemo(() => {
    if (!booking?.providerClerkId) return null;
    return users.find((user) => user.clerkId === booking.providerClerkId) || null;
  }, [users, booking?.providerClerkId]);

  const service = useMemo(() => {
    if (!booking?.serviceId) return null;
    return services.find((item) => item.serviceId === booking.serviceId) || null;
  }, [services, booking?.serviceId]);

  if (!isOpen) return null;

  const canApprove = booking?.status === 'pending';
  const canCancel = booking?.status === 'pending' || booking?.status === 'confirmed';
  const canComplete = booking?.status === 'confirmed';

  return (
    <div className="dashboard-drawer-overlay" role="presentation" onClick={onClose}>
      <aside
        className="dashboard-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dashboard-drawer-header">
          <div>
            <p className="dashboard-kicker">Booking details</p>
            <h2>{booking?.bookingId || booking?._id || 'Booking'}</h2>
          </div>
          <button type="button" className="dashboard-inline-button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="dashboard-drawer-body">
          {loading ? <p>Loading booking details...</p> : null}
          {error ? <p className="dashboard-meta">{error}</p> : null}

          {!loading && !error && booking ? (
            <>
              {actionError ? <p className="dashboard-meta">{actionError}</p> : null}

              <div className="dashboard-inline-button-group">
                <button
                  type="button"
                  className="dashboard-inline-button"
                  onClick={() => handleBookingAction('approve')}
                  disabled={!canApprove || actionLoading !== ''}
                >
                  {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="dashboard-inline-button dashboard-inline-button-danger"
                  onClick={() => handleBookingAction('cancel')}
                  disabled={!canCancel || actionLoading !== ''}
                >
                  {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="dashboard-inline-button"
                  onClick={() => handleBookingAction('complete')}
                  disabled={!canComplete || actionLoading !== ''}
                >
                  {actionLoading === 'complete' ? 'Updating...' : 'Mark completed'}
                </button>
              </div>

              <section className="dashboard-review-grid" style={{ marginTop: '12px' }}>
                <div className="dashboard-review-field">
                  <span>Status</span>
                  <strong>{booking.status || 'pending'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Payment</span>
                  <strong>{booking.paymentStatus || 'pending'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Service Date</span>
                  <strong>{formatDate(booking.date)}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Time Slot</span>
                  <strong>{booking.timeSlot || 'Not available'}</strong>
                </div>
                <div className="dashboard-review-field dashboard-review-field-full">
                  <span>Created At</span>
                  <strong>{formatDateTime(booking.createdAt)}</strong>
                </div>
              </section>

              <section className="dashboard-review-grid" style={{ marginTop: '12px' }}>
                <div className="dashboard-review-field dashboard-review-field-full">
                  <span>Service</span>
                  <strong>{service?.title || 'Unknown service'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Category</span>
                  <strong>{service?.category || 'Not available'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Price</span>
                  <strong>{service?.price ? `$${service.price}` : 'Not available'}</strong>
                </div>
              </section>

              <section className="dashboard-review-grid" style={{ marginTop: '12px' }}>
                <div className="dashboard-review-field dashboard-review-field-full">
                  <span>Customer</span>
                  <strong>{customer?.username || customer?.email || 'Unknown customer'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Email</span>
                  <strong>{customer?.email || 'Not available'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Phone</span>
                  <strong>{customer?.phone || 'Not available'}</strong>
                </div>
              </section>

              <section className="dashboard-review-grid" style={{ marginTop: '12px' }}>
                <div className="dashboard-review-field dashboard-review-field-full">
                  <span>Provider</span>
                  <strong>{provider?.username || provider?.email || 'Unknown provider'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Email</span>
                  <strong>{provider?.email || 'Not available'}</strong>
                </div>
                <div className="dashboard-review-field">
                  <span>Phone</span>
                  <strong>{provider?.phone || 'Not available'}</strong>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export default AdminBookingDetailsDrawer;



