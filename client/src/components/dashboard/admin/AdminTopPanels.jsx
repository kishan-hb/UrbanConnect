import DashboardPanel from '../DashboardPanel';

function AdminTopPanels({
  bookingRows,
  approvals,
  reviewLoadingId,
  onReviewProvider,
  onOpenBooking,
  onSeeAllBookings,
}) {
  return (
    <section className="dashboard-content-grid">
      <DashboardPanel
        title="Recent bookings"
        subtitle="A quick read on the newest booking activity across the platform."
        action={
          <button
            type="button"
            className="dashboard-panel-link dashboard-panel-link-button"
            onClick={onSeeAllBookings}
          >
            See all bookings
          </button>
        }
      >
        <div className="dashboard-list">
          {bookingRows.length > 0 ? (
            bookingRows.map((booking) => (
              <article key={booking.id} className="dashboard-list-item">
                <span className="dashboard-list-pill">Live</span>
                <div className="dashboard-list-copy">
                  <strong>{booking.service}</strong>
                  <p>{booking.client}</p>
                  <p className="dashboard-booking-due">{booking.meta}</p>
                </div>
                <div className="dashboard-list-meta">
                  <span className={`dashboard-status-tag ${booking.statusClass}`}>
                    {booking.status}
                  </span>
                  <button
                    type="button"
                    className="dashboard-inline-button"
                    onClick={() => onOpenBooking(booking.id)}
                    disabled={!booking.id}
                  >
                    Open
                  </button>
                </div>
              </article>
            ))
          ) : (
            <article className="dashboard-approval-item">
              <div className="dashboard-list-copy">
                <strong>No bookings found</strong>
                <p>There are currently no bookings to display.</p>
              </div>
            </article>
          )}
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
                  onClick={() => onReviewProvider(approval.id)}
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
  );
}

export default AdminTopPanels;
