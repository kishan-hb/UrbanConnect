import { useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import {
  acceptBookingProvider,
  getAllBookings,
  rejectBookingProvider,
} from '../api/bookingApi';
import { deleteService, getMyServices, updateService } from '../api/providerApi';
import { useAuth } from '../context/AuthContext';
import './ProviderDashboardPage.css';
import useProviderDashboardData from '../hooks/userProviderDashboardData';
import CreateServiceModal from '../components/CreateServiceModal';

const CATEGORY_ICONS = {
  plumbing: 'plumbing',
  electrical: 'electrical_services',
  cleaning: 'cleaning_services',
  carpentry: 'handyman',
  painting: 'format_paint',
  gardening: 'yard',
  moving: 'local_shipping',
  appliance: 'home_repair_service',
  hvac: 'hvac',
  pest: 'bug_report',
};

function getCategoryIcon(category) {
  const key = (category || '').toLowerCase();
  return CATEGORY_ICONS[key] || 'home_repair_service';
}

const recentJobs = [
  { title: 'Main floor faucet replacement', meta: 'Completed yesterday', action: 'View details' },
  { title: 'Luxury condo maintenance visit', meta: 'Completed Apr 5 – 5-star review', action: 'See feedback' },
  { title: 'Laundry room valve repair', meta: 'Completed Apr 3 – Deposit released', action: 'Open summary' },
];

const providerSections = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'requests', label: 'Booking Requests', icon: 'calendar_today' },
  { id: 'services', label: 'My Services', icon: 'home_repair_service' },
  { id: 'availability', label: 'Availability', icon: 'event_available' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'recent', label: 'Recent Jobs', icon: 'task_alt' },
  { id: 'earnings', label: 'Earnings', icon: 'payments' },
];

function formatBookingDate(dateValue) {
  if (!dateValue) return 'Date not set';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Date not set';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getBookingId(booking) {
  return booking?._id || booking?.bookingId;
}

function getCustomerInitials(name) {
  if (!name) return 'UC';
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function toBookingRequest(booking) {
  const customer = booking?.customerDetails || {};
  const customerName = customer.fullName || 'Customer';
  const service = booking?.serviceTitle || booking?.serviceId || 'Requested service';
  return {
    id: getBookingId(booking),
    customerName,
    customerEmail: customer.email || 'No email provided',
    customerPhone: customer.phone || 'No phone provided',
    service,
    dateLabel: formatBookingDate(booking?.date),
    timeLabel: booking?.timeSlot || 'Time not set',
    rawDate: booking?.date || null,
    address: customer.address || 'No address provided',
    city: customer.city || '',
    zipCode: customer.zipCode || '',
    instructions: customer.instructions || 'No special instructions provided.',
    status: booking?.status || 'pending',
    paymentStatus: booking?.paymentStatus || 'pending',
  };
}

function BookingRequestCard({ request, isDetailed = false, isUpdating, onAccept, onReject }) {
  const canManage = request.status === 'pending';
  return (
    <article className={isDetailed ? 'provider-request-card provider-request-card-detailed' : 'provider-request-card'}>
      <div className="provider-request-avatar">{getCustomerInitials(request.customerName)}</div>
      <div className="provider-request-copy">
        <div className="provider-request-title-row">
          <strong>{request.customerName}</strong>
          <span className={`provider-booking-status provider-booking-status-${request.status}`}>{request.status}</span>
        </div>
        <p>{request.service}</p>
        <span>{request.dateLabel} - {request.timeLabel}</span>
      </div>
      <div className="provider-request-actions" aria-label={`Actions for ${request.customerName}`}>
        <button type="button" className="provider-request-action provider-request-accept" aria-label={`Accept ${request.customerName}`} disabled={!canManage || isUpdating} onClick={() => onAccept(request.id)}>
          <span className="material-icons">check</span>
        </button>
        <button type="button" className="provider-request-action provider-request-reject" aria-label={`Reject ${request.customerName}`} disabled={!canManage || isUpdating} onClick={() => onReject(request.id)}>
          <span className="material-icons">close</span>
        </button>
      </div>
      {isDetailed ? (
        <div className="provider-request-details">
          <div><span>Phone</span><strong>{request.customerPhone}</strong></div>
          <div><span>Email</span><strong>{request.customerEmail}</strong></div>
          <div>
            <span>Address</span>
            <strong>{request.address}{request.city ? `, ${request.city}` : ''}{request.zipCode ? ` ${request.zipCode}` : ''}</strong>
          </div>
          <div><span>Payment</span><strong>{request.paymentStatus}</strong></div>
          <div className="provider-request-details-full"><span>Instructions</span><strong>{request.instructions}</strong></div>
        </div>
      ) : null}
    </article>
  );
}

function SectionFallback({ title }) {
  return (
    <div className="provider-empty-state">
      <span className="material-icons">space_dashboard</span>
      <h3>{title}</h3>
      <p>This section is coming soon in the next update.</p>
    </div>
  );
}

function ProviderDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authState } = useAuth();
  const { getToken } = useClerkAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [updatingBookingId, setUpdatingBookingId] = useState('');
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState('');

  const requestedSection = searchParams.get('section');
  const activeSection = providerSections.some((s) => s.id === requestedSection) ? requestedSection : 'overview';
  const activeConfig = providerSections.find((s) => s.id === activeSection);
  const { stats, loading, error } = useProviderDashboardData();

  useEffect(() => {
    async function loadBookings() {
      if (!authState?.token) return;
      try {
        setBookingsLoading(true);
        setBookingsError('');
        const data = await getAllBookings(authState.token);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setBookings([]);
        setBookingsError(err.message || 'Failed to load bookings.');
      } finally {
        setBookingsLoading(false);
      }
    }
    loadBookings();
  }, [authState?.token]);

  useEffect(() => {
    if (!authState?.token) return;
    async function loadServices() {
      try {
        setServicesLoading(true);
        const token = await getToken();
        if (!token) return;
        const data = await getMyServices(token);
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, [authState?.token, getToken]);

  useEffect(() => {
    async function loadReviews() {
      if (!authState?.clerkId) return;
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        setReviews(Array.isArray(data) ? data.filter((r) => r.providerClerkId === authState.clerkId) : []);
      } catch {
        setReviews([]);
      }
    }
    loadReviews();
  }, [authState?.clerkId]);

  const bookingRows = useMemo(() => bookings.map(toBookingRequest), [bookings]);

  const pendingBookingRequests = useMemo(() => bookingRows.filter((b) => b.status === 'pending'), [bookingRows]);
  const visibleOverviewRequests = pendingBookingRequests.slice(0, 3);

  const recentCompletedJobs = useMemo(() => {
    const completed = bookingRows.filter((b) => b.status === 'completed' || b.status === 'confirmed').slice(0, 10);
    if (completed.length > 0) {
      return completed.map((b) => ({ title: b.service, meta: `${b.customerName} · ${b.dateLabel} · ${b.timeLabel}`, status: b.status, action: 'View details' }));
    }
    return recentJobs.slice(0, 10).map((j) => ({ ...j, status: 'completed' }));
  }, [bookingRows]);

  const successRate = useMemo(() => {
    const completed = bookingRows.filter((b) => b.status === 'completed').length;
    const total = bookingRows.filter((b) => b.status !== 'cancelled').length;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }, [bookingRows]);

  const todaySchedule = useMemo(() => {
    const todayStr = new Date().toDateString();
    const now = new Date();
    const todayJobs = bookingRows
      .filter((b) => b.status === 'confirmed' && b.rawDate && new Date(b.rawDate).toDateString() === todayStr)
      .sort((a, b) => (a.timeLabel || '').localeCompare(b.timeLabel || ''));
    let nextMarked = false;
    return todayJobs.map((b) => {
      const [startTime = ''] = (b.timeLabel || '').split('-');
      const [hourStr = '0', minStr = '00'] = startTime.split(':');
      const hour = parseInt(hourStr, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const time = `${String(displayHour).padStart(2, '0')}:${minStr}`;
      const jobDate = new Date(b.rawDate);
      jobDate.setHours(hour, parseInt(minStr, 10), 0, 0);
      const isNext = !nextMarked && jobDate > now;
      if (isNext) nextMarked = true;
      return { time, period, title: b.service, customer: b.customerName, isNext };
    });
  }, [bookingRows]);

  const weeklyTrend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toDateString();
      return bookingRows.filter((b) => b.rawDate && new Date(b.rawDate).toDateString() === dateStr).length;
    });
    const max = Math.max(...days, 1);
    return days.map((c) => Math.max(Math.round((c / max) * 100), 5));
  }, [bookingRows]);

  const nextJobDetail = useMemo(() => {
    const now = new Date();
    const upcoming = bookingRows
      .filter((b) => b.status === 'confirmed' && b.rawDate && new Date(b.rawDate) >= now)
      .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    if (!upcoming.length) return 'None scheduled';
    const [startTime = ''] = (upcoming[0].timeLabel || '').split('-');
    const [hourStr = '0'] = startTime.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `Next: ${displayHour} ${period}`;
  }, [bookingRows]);

  const pendingTodayCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return bookingRows.filter((b) => b.status === 'pending' && b.rawDate && new Date(b.rawDate).toDateString() === todayStr).length;
  }, [bookingRows]);

  const ratingDetail = useMemo(() => {
    const r = parseFloat(stats?.averageRating);
    if (!r) return 'No reviews yet';
    return r >= 4.5 ? 'Top rated' : `${r.toFixed(1)} avg`;
  }, [stats]);

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  const providerStats = [
    {
      label: 'Pending requests',
      value: loading ? '--' : (stats?.pendingRequests ?? '--'),
      detail: bookingsLoading ? '...' : pendingTodayCount > 0 ? `+${pendingTodayCount} today` : 'Up to date',
      tone: 'amber',
    },
    {
      label: 'Upcoming jobs',
      value: loading ? '--' : (stats?.upcomingJobs ?? '--'),
      detail: bookingsLoading ? '...' : nextJobDetail,
      tone: 'blue',
    },
    {
      label: `Completed – ${currentMonth}`,
      value: loading ? '--' : (stats?.completedThisMonth ?? '--'),
      detail: currentMonth,
      tone: 'green',
    },
    {
      label: 'Average rating',
      value: loading ? '--' : (stats?.averageRating ?? '--'),
      detail: loading ? '...' : ratingDetail,
      tone: 'purple',
    },
  ];

  function handleSectionChange(sectionId) {
    setSearchParams({ section: sectionId });
  }

  async function updateProviderBooking(id, action) {
    if (!authState?.token || !id) return;
    try {
      setUpdatingBookingId(id);
      setBookingsError('');
      const updatedBooking =
        action === 'accept'
          ? await acceptBookingProvider(id, authState.token)
          : await rejectBookingProvider(id, authState.token);
      setBookings((prev) =>
        prev.map((booking) => (getBookingId(booking) === getBookingId(updatedBooking) ? updatedBooking : booking))
      );
    } catch (err) {
      setBookingsError(err.message || 'Failed to update booking.');
    } finally {
      setUpdatingBookingId('');
    }
  }

  const profile = authState?.user;

  async function handleDeleteService(serviceId) {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    setDeletingServiceId(serviceId);
    try {
      await deleteService(authState.token, serviceId);
      setServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
    } catch (err) {
      alert(err.message || 'Failed to delete service.');
    } finally {
      setDeletingServiceId('');
    }
  }

  return (
    <>
    <main className="provider-dashboard-page">
      <section className="provider-dashboard-main">
        <header className="provider-dashboard-header">
          {activeSection === 'overview' ? (
            <div className="provider-header-stats">
              {providerStats.map((stat) => (
                <div key={stat.label} className={`provider-stats-item provider-stats-item-${stat.tone}`}>
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                  <span className={`provider-stats-tag provider-pill-${stat.tone}`}>{stat.detail}</span>
                </div>
              ))}
            </div>
          ) : null}
          <div className="provider-header-bottom">
            {activeSection !== 'overview' ? (
              <button
                type="button"
                className="provider-back-btn"
                onClick={() => setSearchParams({})}
              >
                <span className="material-icons">arrow_back</span>
                Overview
              </button>
            ) : null}
            <div className="provider-search-box">
              <span className="material-icons">search</span>
              <input type="search" placeholder="Search..." />
            </div>
          </div>
        </header>

        {error ? <p className="provider-error">{error}</p> : null}
        {bookingsError ? <p className="provider-error">{bookingsError}</p> : null}

        {activeSection === 'overview' ? (
          <>
            <section className="provider-visual-grid">
              <article className="provider-card provider-trend-card">
                <div className="provider-card-header">
                  <div>
                    <h2>Weekly Booking Trend</h2>
                    <p>Recent request volume by day.</p>
                  </div>
                  <button type="button">Last 7 days</button>
                </div>
                <div className="provider-chart-bars" aria-label="Weekly booking trend">
                  {weeklyTrend.map((height, index) => (
                    <span
                      key={index}
                      className={index === 6 ? 'provider-chart-bar provider-chart-bar-active' : 'provider-chart-bar'}
                      style={{ '--bar-height': `${height}%` }}
                    />
                  ))}
                </div>
                <div className="provider-chart-days">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </article>

              <article className="provider-card provider-success-card">
                <h2>Success Rate</h2>
                <div
                  className="provider-ring"
                  aria-label={`${successRate} percent completion rate`}
                  style={{ background: `radial-gradient(closest-side, white 76%, transparent 77%), conic-gradient(var(--provider-secondary) ${successRate}%, #d8e6fb 0)` }}
                >
                  <span>{successRate}%</span>
                  <small>Completion</small>
                </div>
                <p>{successRate >= 80 ? 'Tracking ahead of your monthly goal.' : 'Completions are building up – keep going.'}</p>
              </article>

              <article className="provider-card provider-schedule-card">
                <h2>Today's Schedule</h2>
                <div className="provider-schedule-list">
                  {bookingsLoading ? (
                    <p className="provider-muted-message" style={{ minHeight: 0, padding: '12px' }}>Loading...</p>
                  ) : todaySchedule.length === 0 ? (
                    <p className="provider-muted-message" style={{ minHeight: 0, padding: '12px' }}>No confirmed jobs today.</p>
                  ) : (
                    todaySchedule.map((item) => (
                      <article
                        key={`${item.time}-${item.title}`}
                        className={item.isNext ? 'provider-schedule-item provider-schedule-item-next' : 'provider-schedule-item'}
                      >
                        <div className="provider-schedule-time">
                          <strong>{item.time}</strong>
                          <span>{item.period}</span>
                        </div>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.customer}</p>
                          {item.isNext ? <span className="provider-mini-pill">Next job</span> : null}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </article>
            </section>

            <section className="provider-bottom-grid">
              <article className="provider-card provider-requests-card">
                <div className="provider-card-header">
                  <div>
                    <h2>New Booking Requests</h2>
                    <p>Quickly accept or reject new customer requests.</p>
                  </div>
                  <button type="button" onClick={() => handleSectionChange('requests')}>View all</button>
                </div>
                <div className="provider-request-list">
                  {bookingsLoading ? <p className="provider-muted-message">Loading booking requests...</p> : null}
                  {!bookingsLoading && visibleOverviewRequests.length === 0 ? (
                    <p className="provider-muted-message">No pending booking requests right now.</p>
                  ) : null}
                  {visibleOverviewRequests.map((request) => (
                    <BookingRequestCard
                      key={request.id}
                      request={request}
                      isUpdating={updatingBookingId === request.id}
                      onAccept={(id) => updateProviderBooking(id, 'accept')}
                      onReject={(id) => updateProviderBooking(id, 'reject')}
                    />
                  ))}
                </div>
              </article>

              <article className="provider-card provider-services-card">
                <div className="provider-card-header">
                  <div>
                    <h2>My Services</h2>
                    <p>Current listings and quick controls.</p>
                  </div>
                  <button type="button" aria-label="Add service" onClick={() => setShowServiceModal(true)}>
                    <span className="material-icons">add_circle</span>
                  </button>
                </div>
                <div className="provider-service-list">
                  {servicesLoading ? (
                    <p className="provider-muted-message">Loading services...</p>
                  ) : services.length === 0 ? (
                    <p className="provider-muted-message">No services listed yet.</p>
                  ) : (
                    services.slice(0, 3).map((service) => (
                      <article key={service.serviceId} className="provider-service-item">
                        <span className="provider-service-icon material-icons">{getCategoryIcon(service.category)}</span>
                        <div>
                          <strong>{service.title}</strong>
                          <p>{service.category} · ${service.price}/hr</p>
                        </div>
                        <button type="button" className="provider-toggle provider-toggle-on" aria-label={`${service.title} active`} />
                      </article>
                    ))
                  )}
                </div>
                <button type="button" className="provider-full-button" onClick={() => handleSectionChange('services')}>
                  Manage all services
                </button>
              </article>
            </section>
          </>
        ) : null}

        {activeSection === 'requests' ? (
          <section className="provider-card">
            <div className="provider-card-header">
              <div>
                <h2>Booking Requests</h2>
                <p>Manage customer requests with contact, address, instructions, status, and payment details.</p>
              </div>
            </div>
            <div className="provider-request-list provider-request-list-wide">
              {bookingsLoading ? <p className="provider-muted-message">Loading booking requests...</p> : null}
              {!bookingsLoading && bookingRows.length === 0 ? (
                <p className="provider-muted-message">No provider bookings yet.</p>
              ) : null}
              {bookingRows.map((request) => (
                <BookingRequestCard
                  key={request.id}
                  request={request}
                  isDetailed
                  isUpdating={updatingBookingId === request.id}
                  onAccept={(id) => updateProviderBooking(id, 'accept')}
                  onReject={(id) => updateProviderBooking(id, 'reject')}
                />
              ))}
            </div>
          </section>
        ) : null}

        {activeSection === 'services' ? (
          <section className="svc-cosmos-panel">
            <div className="svc-starfield" aria-hidden="true">
              {Array.from({ length: 60 }).map((_, i) => (
                <span key={i} className="svc-star" style={{ '--i': i }} />
              ))}
            </div>
            <div className="svc-cosmos-header">
              <div className="svc-cosmos-title-group">
                <span className="material-icons svc-cosmos-title-icon">rocket_launch</span>
                <div>
                  <h2 className="svc-cosmos-title">My Services</h2>
                  <p className="svc-cosmos-subtitle">{services.length} active listing{services.length !== 1 ? 's' : ''} in orbit</p>
                </div>
              </div>
              <button
                type="button"
                className="svc-cosmos-add-btn"
                onClick={() => { setEditService(null); setShowServiceModal(true); }}
              >
                <span className="material-icons">add</span>
                New Service
              </button>
            </div>
            {servicesLoading ? (
              <div className="svc-cosmos-empty">
                <span className="svc-orbit-ring" />
                <p>Scanning the cosmos...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="svc-cosmos-empty">
                <span className="material-icons svc-cosmos-empty-icon">satellite_alt</span>
                <p>No services in orbit yet. Launch your first one.</p>
              </div>
            ) : (
              <div className="svc-cosmos-grid">
                {services.map((service, idx) => (
                  <article
                    key={service.serviceId}
                    className="svc-cosmos-card"
                    style={{ '--card-index': idx }}
                  >
                    <span className="svc-card-glow" aria-hidden="true" />
                    <div className="svc-card-icon-wrap">
                      <span className="material-icons svc-card-icon">{getCategoryIcon(service.category)}</span>
                      <span className="svc-card-icon-ring" aria-hidden="true" />
                    </div>
                    <div className="svc-card-body">
                      <strong className="svc-card-title">{service.title}</strong>
                      <span className="svc-card-badge">{service.category}</span>
                      <p className="svc-card-meta">
                        <span className="material-icons">attach_money</span>
                        {service.price}<span className="svc-card-meta-unit">/hr</span>
                        {service.location?.city ? (
                          <>
                            <span className="svc-card-meta-sep">|</span>
                            <span className="material-icons">location_on</span>
                            {service.location.city}
                          </>
                        ) : null}
                      </p>
                      {service.availability?.length > 0 ? (
                        <p className="svc-card-avail">
                          {service.availability.map((d) => (
                            <span key={d} className="svc-day-chip">{d.slice(0, 3)}</span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                    <div className="svc-card-actions">
                      <button
                        type="button"
                        className="svc-btn-edit"
                        onClick={() => { setEditService(service); setShowServiceModal(true); }}
                      >
                        <span className="material-icons">edit</span>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="svc-btn-delete"
                        disabled={deletingServiceId === service.serviceId}
                        onClick={() => handleDeleteService(service.serviceId)}
                      >
                        <span className="material-icons">
                          {deletingServiceId === service.serviceId ? 'hourglass_top' : 'delete_outline'}
                        </span>
                        {deletingServiceId === service.serviceId ? 'Removing...' : 'Delete'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeSection === 'availability' ? (
          <section className="provider-card">
            <div className="provider-card-header">
              <div>
                <h2>Availability</h2>
                <p>Availability is set per service. Update a service listing to change its bookable days.</p>
              </div>
            </div>
            <div className="provider-service-management">
              {servicesLoading ? <p className="provider-muted-message">Loading services...</p> : null}
              {!servicesLoading && services.length === 0 ? (
                <p className="provider-muted-message">No services found. Add a service to set availability.</p>
              ) : null}
              {services.map((service) => (
                <article key={service.serviceId} className="provider-management-row">
                  <span className="provider-service-icon material-icons">{getCategoryIcon(service.category)}</span>
                  <div>
                    <strong>{service.title}</strong>
                    <p>{service.availability && service.availability.length > 0 ? service.availability.join(', ') : 'No availability set'}</p>
                  </div>
                  <button type="button">Edit availability</button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeSection === 'profile' ? (
          <section className="provider-card provider-info-grid">
            <article>
              <strong>Username</strong>
              <p>{profile?.username || '—'}</p>
            </article>
            <article>
              <strong>Phone</strong>
              <p>{profile?.phone || 'Not set'}</p>
            </article>
            <article>
              <strong>Bio</strong>
              <p>{profile?.bio || 'No bio added yet.'}</p>
            </article>
            <article>
              <strong>Account role</strong>
              <p>{profile?.role || 'Provider'}</p>
            </article>
            <article>
              <strong>Rating</strong>
              <p>{profile?.rating ? `${profile.rating} ★` : 'No ratings yet'}</p>
            </article>
            <article>
              <strong>Services offered</strong>
              <p>{profile?.servicesOffered?.length > 0 ? profile.servicesOffered.join(', ') : 'None listed'}</p>
            </article>
          </section>
        ) : null}

        {activeSection === 'recent' ? (
          <section className="provider-card provider-recent-card">
            <div className="provider-card-header">
              <div>
                <h2>Recent Jobs</h2>
                <p>Review the latest completed or confirmed work. Showing up to 10 jobs.</p>
              </div>
            </div>
            <div className="provider-service-management">
              {recentCompletedJobs.map((job) => (
                <article key={`${job.title}-${job.meta}`} className="provider-management-row">
                  <span className="provider-service-icon material-icons">task_alt</span>
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.meta}</p>
                  </div>
                  <span className="provider-status provider-status-done">{job.status}</span>
                  <button type="button">{job.action}</button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeSection === 'reviews' ? (
          <section className="provider-card">
            <div className="provider-card-header">
              <div>
                <h2>Reviews</h2>
                <p>Customer feedback on your completed jobs.</p>
              </div>
            </div>
            <div className="provider-service-management">
              {reviews.length === 0 ? (
                <p className="provider-muted-message">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <article key={review.reviewId} className="provider-management-row">
                    <span className="provider-service-icon material-icons">star</span>
                    <div>
                      <strong>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} &nbsp;{review.rating}/5</strong>
                      <p>{review.comment || 'No comment left.'}</p>
                    </div>
                    <span className="provider-status provider-status-done">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : null}

        {activeSection === 'earnings' ? <SectionFallback title="Earnings" /> : null}
      </section>
    </main>

    {showServiceModal ? (
      <CreateServiceModal
        onClose={() => { setShowServiceModal(false); setEditService(null); }}
        onCreated={(created) => setServices((prev) => [created, ...prev])}
        onUpdated={(updated) => setServices((prev) => prev.map((s) => s.serviceId === updated.serviceId ? updated : s))}
        editService={editService}
      />
    ) : null}
    </>
  );
}

export default ProviderDashboardPage;
