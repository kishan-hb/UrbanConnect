import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import DashboardPanel from '../components/dashboard/DashboardPanel';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import './DashboardPages.css';
import { useAuth } from '../context/AuthContext';
import {
  approveProvider,
  getAllUsersAdmin,
  getPendingProviders,
  getApprovedProviders,
  getUserByIdAdmin,
  rejectProvider,
} from '../api/adminApi';

const recentBookings = [
  {
    service: 'Premium Plumbing',
    client: 'Emma Lewis',
    meta: 'Requested today - Downtown Vancouver',
    status: 'Awaiting provider',
    statusClass: 'dashboard-status-pending',
  },
  {
    service: 'Estate Cleaning',
    client: 'Lucas Green',
    meta: 'Requested today - North Shore',
    status: 'Assigned',
    statusClass: 'dashboard-status-upcoming',
  },
  {
    service: 'Design & Paint Consultation',
    client: 'Harper Wong',
    meta: 'Requested yesterday - Kitsilano',
    status: 'Needs review',
    statusClass: 'dashboard-status-review',
  },
];

const activityFeed = [
  {
    title: 'Payment dispute resolved',
    detail: 'Booking UC-1934 was resolved and payout hold removed.',
  },
  {
    title: 'New provider waitlist signup',
    detail: 'Three new provider applications entered the review queue today.',
  },
  {
    title: 'Service category updated',
    detail: 'Luxury maintenance taxonomy revised for cleaner search mapping.',
  },
];

const managementRows = [
  {
    label: 'User moderation queue',
    meta: '2 homeowner reports pending triage',
    status: 'Attention needed',
  },
  {
    label: 'Provider compliance check',
    meta: '5 renewals due within 14 days',
    status: 'Upcoming',
  },
  {
    label: 'Platform health review',
    meta: 'No critical incidents in the last 24 hours',
    status: 'Stable',
  },
];

const adminSections = [
  { id: 'approvals', label: 'Provider Approvals', eyebrow: 'Trust & compliance' },
  { id: 'operations', label: 'Operations Snapshot', eyebrow: 'Platform controls' },
  { id: 'activity', label: 'Platform Activity', eyebrow: 'Signals' },
  { id: 'bookings', label: 'Booking Oversight', eyebrow: 'Booking health' },
    { id: 'users', label: 'User Management', eyebrow: 'Accounts' },
  { id: 'providers', label: 'Provider Management', eyebrow: 'Partner directory' },
];

function AdminDashboardPage() {
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState('approvals');
  const [users, setUsers] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
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
  const reviewCardRef = useRef(null);
  const userReviewCardRef = useRef(null);
  const activeConfig = adminSections.find((section) => section.id === activeSection);

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

  const loadAdminData = useCallback(async () => {
    if (!authState?.token) {
      setError('Admin authentication is required to load this dashboard.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [usersData, pendingData, approvedData] = await Promise.all([
        getAllUsersAdmin(authState.token),
        getPendingProviders(authState.token),
        getApprovedProviders(authState.token),
      ]);

      setUsers(usersData);
      setPendingProviders(pendingData);
      setApprovedProviders(approvedData);
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
      setActiveSection('approvals');
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
      setActiveSection('users');
      const user = await getUserByIdAdmin(id, authState.token);
      setSelectedUser(user);
      setUserDraft(buildUserDraft(user));
    } catch (err) {
      setUserReviewError(err.message || 'Failed to load user details');
    } finally {
      setUserReviewLoadingId('');
    }
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
    setApprovedProviders((prev) =>
      prev.filter((user) => user._id !== selectedUser._id)
    );
    setPendingProviders((prev) =>
      prev.filter((user) => user._id !== selectedUser._id)
    );
    setSelectedUser(null);
    setUserDraft(null);
  }

  useEffect(() => {
    if (activeSection === 'approvals' && selectedProvider && reviewCardRef.current) {
      reviewCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeSection, selectedProvider]);

  useEffect(() => {
    if (activeSection === 'users' && selectedUser && userReviewCardRef.current) {
      userReviewCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeSection, selectedUser]);

  const approvals = pendingProviders.map((provider) => ({
    id: provider._id,
    name:
      provider.username ||
      provider.email ||
      provider.clerkId ||
      'Pending provider',
    detail: `${provider.email || 'No email on file'} - Background check: ${
      provider.backgroundCheckStatus || 'pending'
    }`,
    provider,
  }));

  const adminStats = [
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

  if (loading) {
    return (
      <main className="dashboard-page">
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <DashboardShell
      kicker="Admin overview"
      title="Keep the platform healthy and moving"
      description="Monitor bookings, triage provider approvals, and keep a tight read on what needs attention right now."
      meta="Last refreshed: 10 minutes ago - 2 queues need review today."
    >
      <section className="dashboard-stats-grid">
        {adminStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="dashboard-content-grid">
        <DashboardPanel
          title="Recent bookings"
          subtitle="A quick read on the newest booking activity across the platform."
          action={<Link to="/" className="dashboard-panel-link">See all bookings</Link>}
        >
          <div className="dashboard-list">
            {recentBookings.map((booking) => (
              <article key={booking.client} className="dashboard-list-item">
                <span className="dashboard-list-pill">Live</span>
                <div className="dashboard-list-copy">
                  <strong>{booking.service}</strong>
                  <p>{booking.client}</p>
                  <p>{booking.meta}</p>
                </div>
                <div className="dashboard-list-meta">
                  <span className={`dashboard-status-tag ${booking.statusClass}`}>
                    {booking.status}
                  </span>
                  <Link to="/booking" className="dashboard-inline-action">
                    Open
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Priority queue"
          subtitle="The admin review area that needs the fastest attention first."
        >
          <div className="dashboard-list">
            {approvals.length > 0 ? (
              approvals.slice(0, 2).map((approval) => (
                <article key={approval.id} className="dashboard-approval-item">
                  <div className="dashboard-list-copy">
                    <strong>{approval.name}</strong>
                    <p>{approval.detail}</p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-inline-button"
                    onClick={() => handleReviewProvider(approval.id)}
                    disabled={reviewLoadingId === approval.id}
                  >
                    {reviewLoadingId === approval.id ? 'Loading...' : 'Review'}
                  </button>
                </article>
              ))
            ) : (
              <article className="dashboard-approval-item">
                <div className="dashboard-list-copy">
                  <strong>No pending providers</strong>
                  <p>All provider applications are currently up to date.</p>
                </div>
              </article>
            )}
          </div>
        </DashboardPanel>
      </section>

      {actionError ? <p className="dashboard-meta">{actionError}</p> : null}
      {reviewError ? <p className="dashboard-meta">{reviewError}</p> : null}
      {userReviewError ? <p className="dashboard-meta">{userReviewError}</p> : null}

      <section className="dashboard-workspace">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-intro">
            <p className="dashboard-sidebar-kicker">Control center</p>
            <h2>Admin controls</h2>
            <p>Switch between oversight areas without crowding the full dashboard.</p>
          </div>

          <nav className="dashboard-sidebar-nav" aria-label="Admin sections">
            {adminSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  section.id === activeSection
                    ? 'dashboard-sidebar-item dashboard-sidebar-item-active'
                    : 'dashboard-sidebar-item'
                }
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.eyebrow}</span>
                <strong>{section.label}</strong>
              </button>
            ))}
          </nav>
        </aside>

        <DashboardPanel
          className="dashboard-workspace-panel"
          title={activeConfig?.label || 'Provider Approvals'}
          subtitle="A quieter admin workspace that reveals one operational area at a time."
          action={
            <Link to="/provider" className="dashboard-panel-link">
              Open provider view
            </Link>
          }
        >
          {activeSection === 'approvals' ? (
            <div className="dashboard-list">
              {approvals.length > 0 ? (
                <>
                  {approvals.map((approval) => (
                    <article key={approval.id} className="dashboard-approval-item">
                      <div className="dashboard-list-copy">
                        <strong>{approval.name}</strong>
                        <p>{approval.detail}</p>
                      </div>
                      <button
                        type="button"
                        className="dashboard-inline-button"
                        onClick={() => handleReviewProvider(approval.id)}
                        disabled={reviewLoadingId === approval.id}
                      >
                        {reviewLoadingId === approval.id ? 'Loading...' : 'Review'}
                      </button>
                    </article>
                  ))}

                  {selectedProvider ? (
                    <article className="dashboard-review-card" ref={reviewCardRef}>
                      <div className="dashboard-review-header">
                        <div>
                          <span className="dashboard-mini-badge">Provider review</span>
                          <h3>
                            {selectedProvider.username || selectedProvider.email || 'Pending provider'}
                          </h3>
                          <p>
                            Review the provider profile before approving or rejecting access.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="dashboard-inline-button"
                          onClick={() => setSelectedProvider(null)}
                        >
                          Close
                        </button>
                      </div>

                      <div className="dashboard-review-grid">
                        <div className="dashboard-review-field">
                          <span>Email</span>
                          <strong>{selectedProvider.email || 'Not provided'}</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Phone</span>
                          <strong>{selectedProvider.phone || 'Not provided'}</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Role</span>
                          <strong>{selectedProvider.role || 'customer'}</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Background check</span>
                          <strong>{selectedProvider.backgroundCheckStatus || 'pending'}</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Account status</span>
                          <strong>{selectedProvider.isActive ? 'Active' : 'Inactive'}</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Applied on</span>
                          <strong>
                            {selectedProvider.createdAt
                              ? new Date(selectedProvider.createdAt).toLocaleDateString()
                              : 'Unknown'}
                          </strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Documents</span>
                          <strong>{selectedProvider.documents?.length || 0} uploaded</strong>
                        </div>
                        <div className="dashboard-review-field">
                          <span>Services offered</span>
                          <strong>{selectedProvider.servicesOffered?.length || 0}</strong>
                        </div>
                        <div className="dashboard-review-field dashboard-review-field-full">
                          <span>Bio</span>
                          <strong>{selectedProvider.bio || 'No bio submitted yet.'}</strong>
                        </div>
                      </div>

                      <div className="dashboard-inline-button-group">
                        <button
                          type="button"
                          className="dashboard-inline-button"
                          onClick={() => handleApproveProvider(selectedProvider._id)}
                          disabled={actionLoadingId === selectedProvider._id}
                        >
                          {actionLoadingId === selectedProvider._id ? 'Working...' : 'Approve provider'}
                        </button>
                        <button
                          type="button"
                          className="dashboard-inline-button dashboard-inline-button-danger"
                          onClick={() => handleRejectProvider(selectedProvider._id)}
                          disabled={actionLoadingId === selectedProvider._id}
                        >
                          Reject provider
                        </button>
                      </div>
                    </article>
                  ) : null}
                </>
              ) : (
                <article className="dashboard-approval-item">
                  <div className="dashboard-list-copy">
                    <strong>No provider approvals pending</strong>
                    <p>There are no pending provider applications to review right now.</p>
                  </div>
                </article>
              )}
            </div>
          ) : null}

          {activeSection === 'operations' ? (
            <div className="dashboard-table">
              {managementRows.map((row) => (
                <article key={row.label} className="dashboard-table-row">
                  <div>
                    <strong>{row.label}</strong>
                    <p className="dashboard-table-meta">{row.meta}</p>
                  </div>
                  <span className="dashboard-status-tag dashboard-status-upcoming">
                    {row.status}
                  </span>
                  <button type="button" className="dashboard-inline-button">
                    Review
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'activity' ? (
            <div className="dashboard-list">
              {activityFeed.map((item) => (
                <article key={item.title} className="dashboard-activity-item">
                  <div className="dashboard-list-copy">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span className="dashboard-mini-badge">New</span>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'bookings' ? (
            <div className="dashboard-table">
              {recentBookings.map((booking) => (
                <article key={booking.client} className="dashboard-table-row">
                  <div>
                    <strong>{booking.service}</strong>
                    <p className="dashboard-table-meta">{booking.client} - {booking.meta}</p>
                  </div>
                  <span className={`dashboard-status-tag ${booking.statusClass}`}>
                    {booking.status}
                  </span>
                  <button type="button" className="dashboard-inline-button">
                    Open booking
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'users' ? (
            <div className="dashboard-table">
              {users.length > 0 ? (
                users.map((user) => (
                  <article key={user._id} className="dashboard-table-row">
                    <div>
                      <strong>{user.username || user.email || 'Unknown user'}</strong>
                      <p className="dashboard-table-meta">
                        {user.email || 'No email'} - Role: {user.role || 'customer'}
                      </p>
                    </div>

                    <span
                      className={`dashboard-status-tag ${
                        user.isActive
                          ? 'dashboard-status-resolved'
                          : 'dashboard-status-review'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>

                    <button
                      type="button"
                      className="dashboard-inline-button"
                      onClick={() => handleReviewUser(user._id)}
                      disabled={userReviewLoadingId === user._id}
                    >
                      {userReviewLoadingId === user._id ? 'Loading...' : 'Edit'}
                    </button>
                  </article>
                ))
              ) : (
                <article className="dashboard-approval-item">
                  <div className="dashboard-list-copy">
                    <strong>No users found</strong>
                    <p>There are currently no users available to manage.</p>
                  </div>
                </article>
              )}

              {selectedUser && userDraft ? (
                <article className="dashboard-review-card" ref={userReviewCardRef}>
                  <div className="dashboard-review-header">
                    <div>
                      <span className="dashboard-mini-badge">User editor</span>
                      <h3>
                        {selectedUser.username || selectedUser.email || 'User account'}
                      </h3>
                      <p>
                        Edit user account details here first, then save or discard your changes.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="dashboard-inline-button"
                      onClick={() => {
                        setSelectedUser(null);
                        setUserDraft(null);
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div className="dashboard-review-grid">
                    <div className="dashboard-review-field">
                      <span>Username</span>
                      <input
                        type="text"
                        value={userDraft.username}
                        onChange={(event) =>
                          handleUserDraftChange('username', event.target.value)
                        }
                      />
                    </div>
                    <div className="dashboard-review-field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={userDraft.email}
                        onChange={(event) =>
                          handleUserDraftChange('email', event.target.value)
                        }
                      />
                    </div>
                    <div className="dashboard-review-field">
                      <span>Phone</span>
                      <input
                        type="text"
                        value={userDraft.phone}
                        onChange={(event) =>
                          handleUserDraftChange('phone', event.target.value)
                        }
                      />
                    </div>
                    <div className="dashboard-review-field">
                      <span>Role</span>
                      <select
                        value={userDraft.role}
                        onChange={(event) =>
                          handleUserDraftChange('role', event.target.value)
                        }
                      >
                        <option value="customer">Customer</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="dashboard-review-field">
                      <span>Account status</span>
                      <select
                        value={userDraft.isActive ? 'active' : 'inactive'}
                        onChange={(event) =>
                          handleUserDraftChange(
                            'isActive',
                            event.target.value === 'active'
                          )
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="dashboard-review-field">
                      <span>Bookings</span>
                      <strong>{selectedUser.bookings?.length || 0}</strong>
                    </div>
                    <div className="dashboard-review-field">
                      <span>Joined on</span>
                      <strong>
                        {selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </strong>
                    </div>
                    <div className="dashboard-review-field">
                      <span>Reviews</span>
                      <strong>{selectedUser.reviews?.length || 0}</strong>
                    </div>
                    <div className="dashboard-review-field dashboard-review-field-full">
                      <span>Bio</span>
                      <textarea
                        rows="5"
                        value={userDraft.bio}
                        onChange={(event) =>
                          handleUserDraftChange('bio', event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="dashboard-inline-button-group">
                    <button
                      type="button"
                      className="dashboard-inline-button"
                      onClick={handleSaveUserChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="dashboard-inline-button"
                      onClick={handleDiscardUserChanges}
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      className="dashboard-inline-button dashboard-inline-button-danger"
                      onClick={handleDeleteUser}
                    >
                      Delete User
                    </button>
                  </div>
                </article>
              ) : null}
            </div>
          ) : null}
        </DashboardPanel>
      </section>
    </DashboardShell>
  );
}

export default AdminDashboardPage;
