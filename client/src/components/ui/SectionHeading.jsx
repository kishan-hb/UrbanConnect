function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  kickerClassName = '',
}) {
  const wrapperClassName =
    align === 'center' ? 'section-center' : 'section-heading';

  const kickerClasses = ['section-kicker', kickerClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      {kicker ? <p className={kickerClasses}>{kicker}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
