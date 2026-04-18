function AdminWorkspaceSections({
  activeSection,
  approvals,
  reviewLoadingId,
  onReviewProvider,
  selectedProvider,
  reviewCardRef,
  onCloseProviderReview,
  actionLoadingId,
  onApproveProvider,
  onRejectProvider,
  managementRows,
  activityFeed,
  bookingRows,
  onOpenBooking,
  deletingBookingId,
  onDeleteBooking,
  users,
  onReviewUser,
  userReviewLoadingId,
  selectedUser,
  userDraft,
  userReviewCardRef,
  onCloseUserEditor,
  onUserDraftChange,
  onSaveUserChanges,
  onDiscardUserChanges,
  onDeleteUser,
}) {
  async function handleDeleteBookingClick(bookingId) {
    const confirmed = window.confirm('Delete this booking? This action cannot be undone.');
    if (!confirmed) return;

    await onDeleteBooking(bookingId);
  }

  if (activeSection === 'approvals') {
    return (
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
                  onClick={() => onReviewProvider(approval.id)}
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
                    onClick={onCloseProviderReview}
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
                    onClick={() => onApproveProvider(selectedProvider._id)}
                    disabled={actionLoadingId === selectedProvider._id}
                  >
                    {actionLoadingId === selectedProvider._id ? 'Working...' : 'Approve provider'}
                  </button>
                  <button
                    type="button"
                    className="dashboard-inline-button dashboard-inline-button-danger"
                    onClick={() => onRejectProvider(selectedProvider._id)}
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
    );
  }

  if (activeSection === 'operations') {
    return (
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
    );
  }

  if (activeSection === 'activity') {
    return (
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
    );
  }

  if (activeSection === 'bookings') {
    return (
      <div className="dashboard-table">
        {bookingRows.length > 0 ? (
          bookingRows.map((booking) => (
            <article key={booking.id} className="dashboard-table-row">
              <div>
                <strong>{booking.service}</strong>
                <p className="dashboard-table-meta">
                  {booking.client} - {booking.meta}
                </p>
              </div>
              <span className={`dashboard-status-tag ${booking.statusClass}`}>
                {booking.status}
              </span>
              <div className="dashboard-inline-button-group">
                <button
                  type="button"
                  className="dashboard-inline-button"
                  onClick={() => onOpenBooking(booking.id)}
                  disabled={!booking.id}
                >
                  Open booking
                </button>
                <button
                  type="button"
                  className="dashboard-inline-button dashboard-inline-button-danger"
                  onClick={() => handleDeleteBookingClick(booking.id)}
                  disabled={!booking.id || deletingBookingId === booking.id}
                >
                  {deletingBookingId === booking.id ? 'Deleting...' : 'Delete booking'}
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
    );
  }

  if (activeSection === 'users') {
    return (
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
                  user.isActive ? 'dashboard-status-resolved' : 'dashboard-status-review'
                }`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                type="button"
                className="dashboard-inline-button"
                onClick={() => onReviewUser(user._id)}
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
                <h3>{selectedUser.username || selectedUser.email || 'User account'}</h3>
                <p>Edit user account details here first, then save or discard your changes.</p>
              </div>
              <button
                type="button"
                className="dashboard-inline-button"
                onClick={onCloseUserEditor}
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
                  onChange={(event) => onUserDraftChange('username', event.target.value)}
                />
              </div>
              <div className="dashboard-review-field">
                <span>Email</span>
                <input
                  type="email"
                  value={userDraft.email}
                  onChange={(event) => onUserDraftChange('email', event.target.value)}
                />
              </div>
              <div className="dashboard-review-field">
                <span>Phone</span>
                <input
                  type="text"
                  value={userDraft.phone}
                  onChange={(event) => onUserDraftChange('phone', event.target.value)}
                />
              </div>
              <div className="dashboard-review-field">
                <span>Role</span>
                <select
                  value={userDraft.role}
                  onChange={(event) => onUserDraftChange('role', event.target.value)}
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
                    onUserDraftChange('isActive', event.target.value === 'active')
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
                  onChange={(event) => onUserDraftChange('bio', event.target.value)}
                />
              </div>
            </div>

            <div className="dashboard-inline-button-group">
              <button type="button" className="dashboard-inline-button" onClick={onSaveUserChanges}>
                Save Changes
              </button>
              <button
                type="button"
                className="dashboard-inline-button"
                onClick={onDiscardUserChanges}
              >
                Discard Changes
              </button>
              <button
                type="button"
                className="dashboard-inline-button dashboard-inline-button-danger"
                onClick={onDeleteUser}
              >
                Delete User
              </button>
            </div>
          </article>
        ) : null}
      </div>
    );
  }

  return null;
}

export default AdminWorkspaceSections;
