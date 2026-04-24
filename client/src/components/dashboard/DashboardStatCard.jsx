function DashboardStatCard({ label, value, detail, tone = 'default' }) {
  const className = `dashboard-stat-card dashboard-stat-${tone}`;

  return (
    <article className={className}>
      <span className="dashboard-stat-label">{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

export default DashboardStatCard;
