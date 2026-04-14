function DashboardShell({
  kicker,
  title,
  description,
  meta,
  primaryAction,
  secondaryAction,
  children,
}) {
  const hasActions = Boolean(primaryAction || secondaryAction);
  const hasMetaArea = Boolean(meta || hasActions);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          {kicker ? <p className="dashboard-kicker">{kicker}</p> : null}
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {hasMetaArea ? (
          <div className="dashboard-hero-actions">
            {meta ? <p className="dashboard-meta">{meta}</p> : null}

            {hasActions ? (
              <div className="dashboard-action-group">
                {secondaryAction}
                {primaryAction}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {children}
    </main>
  );
}

export default DashboardShell;
