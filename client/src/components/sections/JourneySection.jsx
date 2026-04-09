const journeySteps = [
  {
    title: 'Define Needs',
    description:
      'Identify your service requirements and preferred scheduling window.',
    iconClass: 'journey-icon-target',
  },
  {
    title: 'Select Expert',
    description:
      'Review profiles of top-rated professionals vetted for your specific area.',
    iconClass: 'journey-icon-search',
  },
  {
    title: 'Instant Booking',
    description:
      'Secure your appointment with transparent pricing and instant confirmation.',
    iconClass: 'journey-icon-calendar',
  },
  {
    title: 'Premium Delivery',
    description:
      'Receive professional service backed by our UrbanConnect guarantee.',
    iconClass: 'journey-icon-shield',
  },
];

function JourneySection() {
  return (
    <section className="journey-section" id="journey">
      <div className="journey-heading">
        <h2>Concierge Journey</h2>
        <p>
          Our streamlined process ensures every service is delivered with the
          highest architectural standard.
        </p>
      </div>

      <div className="journey-rail">
        <div className="journey-rail-line" />

        {journeySteps.map((step) => (
          <article key={step.title} className="journey-milestone">
            <div className="journey-marker">
              <div className={`journey-icon ${step.iconClass}`} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default JourneySection;
