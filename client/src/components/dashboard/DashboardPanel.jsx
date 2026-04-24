function DashboardPanel({ title, subtitle, action, children, className = '' }) {
  const panelClassName = `dashboard-panel ${className}`.trim();

  return (
    <section className={panelClassName}>
      <div className="dashboard-panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div className="dashboard-panel-action">{action}</div> : null}
      </div>

      {children}
    </section>
  );
}

export default DashboardPanel;
