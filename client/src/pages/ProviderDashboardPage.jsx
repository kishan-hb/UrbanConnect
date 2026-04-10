import { Link } from 'react-router-dom';
import { useState } from 'react';
import DashboardPanel from '../components/dashboard/DashboardPanel';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import './DashboardPages.css';

const providerStats = [
  {
    label: 'Pending requests',
    value: '08',
    detail: 'New service requests waiting for your review.',
    tone: 'highlight',
  },
  {
    label: 'Upcoming jobs',
    value: '05',
    detail: 'Confirmed visits scheduled for the next 7 days.',
  },
  {
    label: 'Completed this month',
    value: '18',
    detail: 'Successfully delivered appointments in progress this cycle.',
    tone: 'success',
  },
  {
    label: 'Average rating',
    value: '4.9',
    detail: 'Trusted by homeowners for precision and reliability.',
  },
];

const newRequests = [
  {
    service: 'Premium Plumbing',
    client: 'Alex Morgan',
    timing: 'Requested for Apr 15, 10:30 AM',
    status: 'Pending review',
    statusClass: 'dashboard-status-pending',
  },
  {
    service: 'Fixture Upgrade Consultation',
    client: 'Nina Patel',
    timing: 'Requested for Apr 16, 1:00 PM',
    status: 'Awaiting response',
    statusClass: 'dashboard-status-upcoming',
  },
  {
    service: 'Emergency Leak Inspection',
    client: 'Daniel Ross',
    timing: 'Requested for Today, 4:30 PM',
    status: 'Priority',
    statusClass: 'dashboard-status-review',
  },
];

const providerFacts = [
  {
    title: 'Availability status',
    detail: 'Open for same-week bookings in Downtown, Kitsilano, and Mount Pleasant.',
  },
  {
    title: 'Response target',
    detail: 'Average first response time is currently 1 hour and 40 minutes.',
  },
];

const serviceManagement = [
  {
    title: 'Premium Plumbing',
    meta: 'Active listing - Plumbing - From $95/hr',
    primaryAction: 'Edit service',
    secondaryAction: 'Delete service',
  },
  {
    title: 'Fixture Upgrade Consultation',
    meta: 'Draft listing - Specialty plumbing - From $120/session',
    primaryAction: 'Continue editing',
    secondaryAction: 'Delete draft',
  },
  {
    title: 'Emergency Leak Inspection',
    meta: 'Active listing - Priority visits - Same-day availability',
    primaryAction: 'Edit service',
    secondaryAction: 'Pause listing',
  },
];

const profileActions = [
  {
    title: 'Business profile',
    detail: 'Update your business name, bio, contact details, and service radius.',
    action: 'Edit profile',
  },
  {
    title: 'Availability settings',
    detail: 'Adjust working hours, blackout dates, and same-day booking preferences.',
    action: 'Update hours',
  },
  {
    title: 'Portfolio and credentials',
    detail: 'Refresh certifications, insurance documents, and project gallery items.',
    action: 'Manage files',
  },
];

const recentJobs = [
  {
    title: 'Main floor faucet replacement',
    meta: 'Completed yesterday - $240 billed',
    action: 'View details',
  },
  {
    title: 'Luxury condo maintenance visit',
    meta: 'Completed Apr 5 - 5-star review received',
    action: 'See feedback',
  },
  {
    title: 'Laundry room valve repair',
    meta: 'Completed Apr 3 - Deposit released',
    action: 'Open summary',
  },
];

const providerSections = [
  { id: 'services', label: 'Service Management', eyebrow: 'Listings' },
  { id: 'profile', label: 'Profile & Account', eyebrow: 'Provider profile' },
  { id: 'availability', label: 'Availability', eyebrow: 'Scheduling' },
  { id: 'recent', label: 'Recent Jobs', eyebrow: 'Work history' },
];

function ProviderDashboardPage() {
  const [activeSection, setActiveSection] = useState('services');
  const activeConfig = providerSections.find((section) => section.id === activeSection);

  return (
    <DashboardShell
      kicker="Provider workspace"
      title="Manage requests without the noise"
      description="Review new bookings, stay ahead of today's schedule, and keep your service pipeline moving with clarity."
      meta="Today's focus: 3 requests need a response before noon."
    >
      <section className="dashboard-stats-grid">
        {providerStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="dashboard-content-grid">
        <DashboardPanel
          title="New booking requests"
          subtitle="The highest-priority requests that need your attention first."
          action={<Link to="/" className="dashboard-panel-link">View queue</Link>}
        >
          <div className="dashboard-list">
            {newRequests.map((request) => (
              <article key={request.client} className="dashboard-list-item">
                <span className="dashboard-list-pill">New</span>
                <div className="dashboard-list-copy">
                  <strong>{request.service}</strong>
                  <p>{request.client}</p>
                  <p>{request.timing}</p>
                </div>
                <div className="dashboard-list-meta">
                  <span className={`dashboard-status-tag ${request.statusClass}`}>
                    {request.status}
                  </span>
                  <Link to="/booking" className="dashboard-inline-action">
                    Review
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Upcoming schedule"
          subtitle="The next confirmed visits on your calendar."
        >
          <div className="dashboard-fact-grid">
            {providerFacts.map((fact) => (
              <article key={fact.title} className="dashboard-fact-card">
                <strong>{fact.title}</strong>
                <p>{fact.detail}</p>
              </article>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="dashboard-workspace">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-intro">
            <p className="dashboard-sidebar-kicker">Workspace</p>
            <h2>Provider controls</h2>
            <p>Choose a section to focus on one operational area at a time.</p>
          </div>

          <nav className="dashboard-sidebar-nav" aria-label="Provider sections">
            {providerSections.map((section) => (
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
          title={activeConfig?.label || 'Service Management'}
          subtitle="A focused workspace that keeps the provider experience quieter and easier to manage."
          action={
            <Link to="/admin" className="dashboard-panel-link">
              Open admin view
            </Link>
          }
        >
          {activeSection === 'services' ? (
            <div className="dashboard-table">
              {serviceManagement.map((service) => (
                <article key={service.title} className="dashboard-table-row">
                  <div>
                    <strong>{service.title}</strong>
                    <p className="dashboard-table-meta">{service.meta}</p>
                  </div>
                  <button type="button" className="dashboard-inline-button">
                    {service.primaryAction}
                  </button>
                  <button
                    type="button"
                    className="dashboard-inline-button dashboard-inline-button-danger"
                  >
                    {service.secondaryAction}
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'profile' ? (
            <div className="dashboard-list">
              {profileActions.map((item) => (
                <article key={item.title} className="dashboard-approval-item">
                  <div className="dashboard-list-copy">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <button type="button" className="dashboard-inline-button">
                    {item.action}
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'availability' ? (
            <div className="dashboard-fact-grid">
              {providerFacts.map((fact) => (
                <article key={fact.title} className="dashboard-fact-card">
                  <strong>{fact.title}</strong>
                  <p>{fact.detail}</p>
                </article>
              ))}
            </div>
          ) : null}

          {activeSection === 'recent' ? (
            <div className="dashboard-table">
              {recentJobs.map((job) => (
                <article key={job.title} className="dashboard-table-row">
                  <div>
                    <strong>{job.title}</strong>
                    <p className="dashboard-table-meta">{job.meta}</p>
                  </div>
                  <span className="dashboard-status-tag dashboard-status-resolved">
                    Completed
                  </span>
                  <span className="dashboard-inline-action">{job.action}</span>
                </article>
              ))}
            </div>
          ) : null}
        </DashboardPanel>
      </section>
    </DashboardShell>
  );
}

export default ProviderDashboardPage;
