import { Link } from 'react-router-dom';
import { useState } from 'react';
import DashboardPanel from '../components/dashboard/DashboardPanel';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import './DashboardPages.css';

const adminStats = [
  {
    label: 'Total users',
    value: '1,284',
    detail: 'Registered homeowners and partners on the platform.',
  },
  {
    label: 'Active providers',
    value: '146',
    detail: 'Providers currently visible and accepting requests.',
    tone: 'success',
  },
  {
    label: 'Open bookings',
    value: '34',
    detail: 'Bookings that are pending confirmation or in progress.',
    tone: 'highlight',
  },
  {
    label: 'Flagged items',
    value: '06',
    detail: 'Issues that need admin review or platform follow-up.',
  },
];

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

const approvals = [
  {
    name: 'Westline Home Works',
    detail: 'Provider verification documents uploaded 2 hours ago.',
    action: 'Review provider',
  },
  {
    name: 'Urban Luxe Cleaning',
    detail: 'Awaiting category approval for premium listing update.',
    action: 'Open review',
  },
  {
    name: 'Precision Electric Group',
    detail: 'Flagged for insurance expiry check next week.',
    action: 'Inspect status',
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
];

function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('approvals');
  const activeConfig = adminSections.find((section) => section.id === activeSection);

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
            {approvals.slice(0, 2).map((approval) => (
              <article key={approval.name} className="dashboard-approval-item">
                <div className="dashboard-list-copy">
                  <strong>{approval.name}</strong>
                  <p>{approval.detail}</p>
                </div>
                <span className="dashboard-mini-badge">Review</span>
              </article>
            ))}
          </div>
        </DashboardPanel>
      </section>

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
              {approvals.map((approval) => (
                <article key={approval.name} className="dashboard-approval-item">
                  <div className="dashboard-list-copy">
                    <strong>{approval.name}</strong>
                    <p>{approval.detail}</p>
                  </div>
                  <button type="button" className="dashboard-inline-button">
                    {approval.action}
                  </button>
                </article>
              ))}
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
        </DashboardPanel>
      </section>
    </DashboardShell>
  );
}

export default AdminDashboardPage;
