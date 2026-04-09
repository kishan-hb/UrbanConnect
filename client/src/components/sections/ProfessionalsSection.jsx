const professionals = [
  {
    imageClass: 'professional-image-electrician',
    ariaLabel: 'Julian Sterling',
    rating: '* 4.9 (124)',
    service: 'Master Electrician',
    name: 'Julian Sterling',
    price: 'From $85/hr',
  },
  {
    imageClass: 'professional-image-cleaning',
    ariaLabel: 'Elena Vasquez',
    rating: '* 5.0 (89)',
    service: 'Estate Cleaning',
    name: 'Elena Vasquez',
    price: 'From $65/hr',
  },
  {
    imageClass: 'professional-image-contractor',
    ariaLabel: 'David Chen',
    rating: '* 4.8 (210)',
    service: 'General Contractor',
    name: 'David Chen',
    price: 'From $95/hr',
  },
  {
    imageClass: 'professional-image-plumbing',
    ariaLabel: 'Sarah Miller',
    rating: '* 4.9 (56)',
    service: 'Expert Plumbing',
    name: 'Sarah Miller',
    price: 'From $90/hr',
  },
];

function ProfessionalsSection() {
  return (
    <section className="professionals-section">
      <div className="professionals-header">
        <div className="professionals-heading">
          <h2>Featured Professionals</h2>
          <p>Top-tier experts with consistent 5-star ratings.</p>
        </div>

        <div
          className="professionals-controls"
          aria-label="Featured professionals controls"
        >
          <button
            type="button"
            className="professionals-control-button"
            aria-label="Previous professionals"
          >
            &lt;
          </button>
          <button
            type="button"
            className="professionals-control-button"
            aria-label="Next professionals"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="professionals-row">
        {professionals.map((professional) => (
          <article key={professional.name} className="professional-profile-card">
            <div
              className={`professional-profile-image ${professional.imageClass}`}
              role="img"
              aria-label={professional.ariaLabel}
            >
              <div className="professional-rating-pill">
                {professional.rating}
              </div>
            </div>
            <div className="professional-profile-body">
              <p className="professional-service-label">
                {professional.service}
              </p>
              <h3>{professional.name}</h3>
              <div className="professional-profile-footer">
                <p>{professional.price}</p>
                <button
                  type="button"
                  className="professional-book-button"
                  aria-label={`Book ${professional.name}`}
                >
                  []
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProfessionalsSection;
