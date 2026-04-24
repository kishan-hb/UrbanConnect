import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import DashboardPanel from '../components/dashboard/DashboardPanel';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import AdminBookingDetailsDrawer from '../components/dashboard/admin/AdminBookingDetailsDrawer';
import AdminSidebar from '../components/dashboard/admin/AdminSidebar';
import AdminTopPanels from '../components/dashboard/admin/AdminTopPanels';
import AdminWorkspaceSections from '../components/dashboard/admin/AdminWorkspaceSections';
import useAdminDashboardData from '../hooks/useAdminDashboardData';
import './DashboardPages.css';

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
  const [activeSection, setActiveSection] = useState('approvals');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const reviewCardRef = useRef(null);
  const userReviewCardRef = useRef(null);
  const workspaceSectionRef = useRef(null);

  const {
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
  } = useAdminDashboardData();

  const activeConfig = adminSections.find((section) => section.id === activeSection);

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

  async function onReviewProvider(id) {
    setActiveSection('approvals');
    await handleReviewProvider(id);
  }

  async function onReviewUser(id) {
    setActiveSection('users');
    await handleReviewUser(id);
  }

  function onOpenBooking(id) {
    if (!id) return;
    setSelectedBookingId(id);
  }

  function onCloseBookingDrawer() {
    setSelectedBookingId('');
  }

  function onSeeAllBookings() {
    setActiveSection('bookings');
    if (workspaceSectionRef.current) {
      workspaceSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

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
    <>
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

        <AdminTopPanels
          bookingRows={bookingRows}
          approvals={approvals}
          reviewLoadingId={reviewLoadingId}
          onReviewProvider={onReviewProvider}
          onOpenBooking={onOpenBooking}
          onSeeAllBookings={onSeeAllBookings}
        />

        {actionError ? <p className="dashboard-meta">{actionError}</p> : null}
        {reviewError ? <p className="dashboard-meta">{reviewError}</p> : null}
        {userReviewError ? <p className="dashboard-meta">{userReviewError}</p> : null}

        <section className="dashboard-workspace" ref={workspaceSectionRef}>
          <AdminSidebar
            sections={adminSections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

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
            <AdminWorkspaceSections
              activeSection={activeSection}
              approvals={approvals}
              reviewLoadingId={reviewLoadingId}
              onReviewProvider={onReviewProvider}
              selectedProvider={selectedProvider}
              reviewCardRef={reviewCardRef}
              onCloseProviderReview={handleCloseProviderReview}
              actionLoadingId={actionLoadingId}
              onApproveProvider={handleApproveProvider}
              onRejectProvider={handleRejectProvider}
              managementRows={managementRows}
              activityFeed={activityFeed}
              bookingRows={bookingRows}
              onOpenBooking={onOpenBooking}
              deletingBookingId={deletingBookingId}
              onDeleteBooking={handleDeleteBooking}
              users={users}
              onReviewUser={onReviewUser}
              userReviewLoadingId={userReviewLoadingId}
              selectedUser={selectedUser}
              userDraft={userDraft}
              userReviewCardRef={userReviewCardRef}
              onCloseUserEditor={handleCloseUserEditor}
              onUserDraftChange={handleUserDraftChange}
              onSaveUserChanges={handleSaveUserChanges}
              onDiscardUserChanges={handleDiscardUserChanges}
              onDeleteUser={handleDeleteUser}
            />
          </DashboardPanel>
        </section>
      </DashboardShell>

      <AdminBookingDetailsDrawer
        bookingId={selectedBookingId}
        isOpen={Boolean(selectedBookingId)}
        onClose={onCloseBookingDrawer}
        onBookingUpdated={handleBookingUpdated}
      />
    </>
  );
}

export default AdminDashboardPage;