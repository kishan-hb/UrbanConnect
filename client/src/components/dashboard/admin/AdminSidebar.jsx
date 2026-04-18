function AdminSidebar({ sections, activeSection, onSectionChange }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-intro">
        <p className="dashboard-sidebar-kicker">Control center</p>
        <h2>Admin controls</h2>
        <p>Switch between oversight areas without crowding the full dashboard.</p>
      </div>

      <nav className="dashboard-sidebar-nav" aria-label="Admin sections">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={
              section.id === activeSection
                ? 'dashboard-sidebar-item dashboard-sidebar-item-active'
                : 'dashboard-sidebar-item'
            }
            onClick={() => onSectionChange(section.id)}
          >
            <span>{section.eyebrow}</span>
            <strong>{section.label}</strong>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
