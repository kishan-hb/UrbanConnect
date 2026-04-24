import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  approveProvider,
  getAllUsersAdmin,
  getPendingProviders,
  getApprovedProviders,
  getUserByIdAdmin,
  rejectProvider,
} from '../api/adminApi';
import { deleteBookingAdmin, getAllBookings } from '../api/bookingApi';
import { getAllServices } from '../api/servicesApi';

function buildUserDraft(user) {
  return {
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'customer',
    isActive: Boolean(user?.isActive),
    bio: user?.bio || '',
  };
}

function getBookingStatusClass(status) {
  if (status === 'completed') return 'dashboard-status-resolved';
  if (status === 'confirmed') return 'dashboard-status-upcoming';
  if (status === 'cancelled') return 'dashboard-status-review';
  return 'dashboard-status-pending';
}

function getOrdinalSuffix(day) {
  const mod10 = day % 10;
  const mod100 = day % 100;
  if (mod10 === 1 && mod100 !== 11) return 'st';
  if (mod10 === 2 && mod100 !== 12) return 'nd';
  if (mod10 === 3 && mod100 !== 13) return 'rd';
  return 'th';
}

function formatCompactTime(hours24, minutes) {
  const period = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12 || 12;
  if (minutes === 0) {
    return `${hours12} ${period}`;
  }
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatTimeLabel(dateValue, timeSlot) {
  if (timeSlot) {
    const amPmMatch = timeSlot.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (amPmMatch) {
      const rawHour = Number(amPmMatch[1]);
      const rawMinutes = amPmMatch[2] ? Number(amPmMatch[2]) : 0;
      if (!Number.isNaN(rawHour) && !Number.isNaN(rawMinutes)) {
        return formatCompactTime(
          amPmMatch[3].toLowerCase() === 'pm' ? (rawHour % 12) + 12 : rawHour % 12,
          rawMinutes
        );
      }
    }

    const twentyFourHourMatch = timeSlot.match(/([01]?\d|2[0-3]):([0-5]\d)/);
    if (twentyFourHourMatch) {
      const hours = Number(twentyFourHourMatch[1]);
      const minutes = Number(twentyFourHourMatch[2]);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        return formatCompactTime(hours, minutes);
      }
    }

    const rangeStart = timeSlot.split('-')[0]?.trim();
    if (rangeStart) {
      return rangeStart.toLowerCase().replace(/\s+/g, '');
    }
  }

  if (!dateValue) return '';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return formatCompactTime(parsedDate.getHours(), parsedDate.getMinutes());
}

function formatRelativeDateLabel(dateValue, timeSlot, missingLabel = 'No date') {
  if (!dateValue) return missingLabel;

  const scheduledDate = new Date(dateValue);
  if (Number.isNaN(scheduledDate.getTime())) return missingLabel;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const scheduledDayStart = new Date(
    scheduledDate.getFullYear(),
    scheduledDate.getMonth(),
    scheduledDate.getDate()
  );

  const timeLabel = formatTimeLabel(dateValue, timeSlot);

  if (scheduledDayStart.getTime() === todayStart.getTime()) {
    return timeLabel ? `Today ${timeLabel}` : 'Today';
  }

  if (scheduledDayStart.getTime() === tomorrowStart.getTime()) {
    return timeLabel ? `Tomorrow ${timeLabel}` : 'Tomorrow';
  }

  const monthName = scheduledDate.toLocaleDateString([], { month: 'long' });
  const day = scheduledDate.getDate();
  const dayWithOrdinal = `${day}${getOrdinalSuffix(day)}`;
  const dateLabel = `${monthName} ${dayWithOrdinal}`;

  if (timeLabel) {
    return `${dateLabel} ${timeLabel}`;
  }

  return dateLabel;
}

function formatBookingMeta(booking) {
  const scheduledAt = formatRelativeDateLabel(booking?.date, booking?.timeSlot, 'No booking date');
  return `Service due on ${scheduledAt}`;
}

function useAdminDashboardData() {
  const { authState } = useAuth();

  const [users, setUsers] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');

  const [reviewLoadingId, setReviewLoadingId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [reviewError, setReviewError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userDraft, setUserDraft] = useState(null);
  const [userReviewError, setUserReviewError] = useState('');
  const [userReviewLoadingId, setUserReviewLoadingId] = useState('');
  const [deletingBookingId, setDeletingBookingId] = useState('');

  const loadAdminData = useCallback(async () => {
    if (!authState?.token) {
      setError('Admin authentication is required to load this dashboard.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [usersData, pendingData, approvedData, bookingsData, servicesData] = await Promise.all([
        getAllUsersAdmin(authState.token),
        getPendingProviders(authState.token),
        getApprovedProviders(authState.token),
        getAllBookings(authState.token),
        getAllServices(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setPendingProviders(Array.isArray(pendingData) ? pendingData : []);
      setApprovedProviders(Array.isArray(approvedData) ? approvedData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  }, [authState?.token]);

  useEffect(() => {
    if (!authState?.isLoaded) return;
    loadAdminData();
  }, [authState?.isLoaded, loadAdminData]);

  async function handleApproveProvider(id) {
    try {
      setActionLoadingId(id);
      setActionError('');
      await approveProvider(id, authState.token);
      if (selectedProvider?._id === id) {
        setSelectedProvider(null);
      }
      await loadAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to approve provider');
    } finally {
      setActionLoadingId('');
    }
  }

  async function handleRejectProvider(id) {
    try {
      setActionLoadingId(id);
      setActionError('');
      await rejectProvider(id, authState.token);
      if (selectedProvider?._id === id) {
        setSelectedProvider(null);
      }
      await loadAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to reject provider');
    } finally {
      setActionLoadingId('');
    }
  }

  async function handleReviewProvider(id) {
    try {
      setReviewLoadingId(id);
      setReviewError('');
      const provider = await getUserByIdAdmin(id, authState.token);
      setSelectedProvider(provider);
    } catch (err) {
      setReviewError(err.message || 'Failed to load provider details');
    } finally {
      setReviewLoadingId('');
    }
  }

  async function handleReviewUser(id) {
    try {
      setUserReviewLoadingId(id);
      setUserReviewError('');
      const user = await getUserByIdAdmin(id, authState.token);
      setSelectedUser(user);
      setUserDraft(buildUserDraft(user));
    } catch (err) {
      setUserReviewError(err.message || 'Failed to load user details');
    } finally {
      setUserReviewLoadingId('');
    }
  }

  function handleCloseProviderReview() {
    setSelectedProvider(null);
  }

  function handleCloseUserEditor() {
    setSelectedUser(null);
    setUserDraft(null);
  }

  function handleUserDraftChange(field, value) {
    setUserDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSaveUserChanges() {
    if (!selectedUser || !userDraft) return;

    const updatedUser = {
      ...selectedUser,
      ...userDraft,
    };

    setUsers((prev) =>
      prev.map((user) => (user._id === selectedUser._id ? updatedUser : user))
    );

    setSelectedUser(updatedUser);
    setUserDraft(buildUserDraft(updatedUser));
  }

  function handleDiscardUserChanges() {
    if (!selectedUser) return;
    setUserDraft(buildUserDraft(selectedUser));
  }

  function handleDeleteUser() {
    if (!selectedUser) return;

    setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
    setApprovedProviders((prev) => prev.filter((user) => user._id !== selectedUser._id));
    setPendingProviders((prev) => prev.filter((user) => user._id !== selectedUser._id));
    setSelectedUser(null);
    setUserDraft(null);
  }

  async function handleDeleteBooking(bookingId) {
    if (!authState?.token) {
      setActionError('Admin authentication is required to delete bookings.');
      return false;
    }

    if (!bookingId) {
      setActionError('A booking id is required to delete a booking.');
      return false;
    }

    try {
      setDeletingBookingId(bookingId);
      setActionError('');
      await deleteBookingAdmin(bookingId, authState.token);
      setBookings((prev) =>
        prev.filter((booking) => {
          const id = booking._id || booking.bookingId;
          return id !== bookingId;
        })
      );
      return true;
    } catch (err) {
      setActionError(err.message || 'Failed to delete booking');
      return false;
    } finally {
      setDeletingBookingId('');
    }
  }
  function handleBookingUpdated(updatedBooking) {
    if (!updatedBooking) return;

    const updatedId = updatedBooking._id || updatedBooking.bookingId;
    if (!updatedId) return;

    setBookings((prev) => {
      let found = false;
      const next = prev.map((booking) => {
        const bookingId = booking._id || booking.bookingId;
        if (bookingId === updatedId) {
          found = true;
          return {
            ...booking,
            ...updatedBooking,
          };
        }
        return booking;
      });

      return found ? next : [updatedBooking, ...next];
    });
  }

  const usersByClerkId = useMemo(() => {
    return users.reduce((acc, user) => {
      if (user?.clerkId) {
        acc[user.clerkId] = user;
      }
      return acc;
    }, {});
  }, [users]);

  const servicesByServiceId = useMemo(() => {
    return services.reduce((acc, service) => {
      if (service?.serviceId) {
        acc[service.serviceId] = service;
      }
      return acc;
    }, {});
  }, [services]);

  const approvals = useMemo(() => {
    return pendingProviders.map((provider) => ({
      id: provider._id,
      name: provider.username || provider.email || provider.clerkId || 'Pending provider',
      detail: `${provider.email || 'No email on file'} - Background check: ${
        provider.backgroundCheckStatus || 'pending'
      }`,
      provider,
    }));
  }, [pendingProviders]);

  const bookingRows = useMemo(() => {
    return bookings.map((booking) => {
      const service = servicesByServiceId[booking.serviceId];
      const customer = usersByClerkId[booking.customerClerkId];

      const serviceLabel =
        service?.title || service?.category || booking.serviceId || 'Service unavailable';
      const customerLabel =
        customer?.username || customer?.email || booking.customerClerkId || 'Customer unavailable';
      return {
        id: booking._id || booking.bookingId,
        service: serviceLabel,
        client: customerLabel,
        meta: formatBookingMeta(booking),
        status: booking.status || 'pending',
        statusClass: getBookingStatusClass(booking.status),
      };
    });
  }, [bookings, servicesByServiceId, usersByClerkId]);

  const adminStats = useMemo(() => {
    return [
      {
        label: 'Total users',
        value: users.length.toString(),
        detail: 'Registered homeowners and partners on the platform.',
      },
      {
        label: 'Active providers',
        value: approvedProviders.length.toString(),
        detail: 'Providers currently visible and accepting requests.',
        tone: 'success',
      },
      {
        label: 'Pending approvals',
        value: pendingProviders.length.toString(),
        detail: 'Provider applications waiting for admin review.',
        tone: 'highlight',
      },
      {
        label: 'Inactive users',
        value: users.filter((user) => user.isActive === false).length.toString(),
        detail: 'Accounts currently deactivated or paused.',
      },
    ];
  }, [approvedProviders.length, pendingProviders.length, users]);

  return {
    users,
    loading,
    error,
    actionError,
    actionLoadingId,
    reviewLoadingId,
    selectedProvider,
    reviewError,
    selectedUser,
    userDraft,
    userReviewError,
    userReviewLoadingId,
    approvals,
    bookingRows,
    adminStats,
    handleApproveProvider,
    handleRejectProvider,
    handleReviewProvider,
    handleCloseProviderReview,
    handleReviewUser,
    handleCloseUserEditor,
    handleUserDraftChange,
    handleSaveUserChanges,
    handleDiscardUserChanges,
    handleDeleteUser,
    handleBookingUpdated,
    deletingBookingId,
    handleDeleteBooking,
  };
}

export default useAdminDashboardData;














