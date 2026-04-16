import Button from '../ui/Button.jsx';

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-content">
          <h2>Ready to elevate your home experience?</h2>
          <p>
            Join thousands of homeowners who trust UrbanConnect for their
            residence&apos;s architectural integrity and maintenance.
          </p>
        </div>

        <div className="cta-visual-panel" aria-hidden="true" />

        <div className="cta-actions">
          <Button to="/services" variant="light" className="cta-primary-button">
            Book Your First Service
          </Button>
          <Button
            to="/provider-onboarding"
            variant="light-outline"
            className="cta-secondary-button"
          >
            Become a Provider
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
