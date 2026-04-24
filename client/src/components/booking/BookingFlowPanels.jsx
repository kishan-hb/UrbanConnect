import { Link } from 'react-router-dom';

export function BookingReviewPaymentStep({ onBack, onConfirm }) {
  return (
    <section className="booking-review-step">
      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Review your booking</h2>
          <p>Take one final look at your booking details before payment.</p>
        </div>

        <div className="booking-review-grid">
          <article className="booking-review-card">
            <span>Contact</span>
            <strong>Alex Morgan</strong>
            <p>name@example.com</p>
            <p>(123) 456-7890</p>
          </article>

          <article className="booking-review-card">
            <span>Service location</span>
            <strong>124 West Residence Ave</strong>
            <p>Vancouver, BC</p>
            <p>V6B 1A1</p>
          </article>

          <article className="booking-review-card">
            <span>Schedule</span>
            <strong>April 15, 2026</strong>
            <p>10:30 AM</p>
            <p>Priority request: No</p>
          </article>

          <article className="booking-review-card">
            <span>Service notes</span>
            <strong>Fixture refresh + inspection</strong>
            <p>Kitchen faucet upgrade and inspection of nearby lines.</p>
          </article>
        </div>
      </div>

      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Payment details</h2>
          <p>Enter payment information to complete and confirm your request.</p>
        </div>

        <div className="booking-form-grid booking-form-grid-two">
          <label className="booking-field booking-field-full">
            <span>Cardholder name</span>
            <input type="text" placeholder="Name on card" />
          </label>

          <label className="booking-field booking-field-full">
            <span>Card number</span>
            <input type="text" placeholder="1234 5678 9012 3456" />
          </label>

          <label className="booking-field">
            <span>Expiry</span>
            <input type="text" placeholder="MM/YY" />
          </label>

          <label className="booking-field">
            <span>CVV</span>
            <input type="text" placeholder="123" />
          </label>

          <label className="booking-field booking-field-full">
            <span>Billing zip code</span>
            <input type="text" placeholder="Billing zip code" />
          </label>
        </div>
      </div>

      <div className="booking-actions">
        <button
          type="button"
          className="booking-secondary-button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="booking-primary-action"
          onClick={onConfirm}
        >
          Confirm & Pay
        </button>
      </div>
    </section>
  );
}

export function BookingConfirmationStep({ onRestart }) {
  return (
    <section className="booking-confirmation-step">
      <div className="booking-confirmation-icon">?</div>
      <p className="booking-confirmation-kicker">Payment complete</p>
      <h2>Your booking request is confirmed</h2>
      <p className="booking-confirmation-text">
        We&apos;ve received your payment and sent your request for final provider
        confirmation. You&apos;ll receive the next update shortly.
      </p>

      <div className="booking-confirmation-grid">
        <article className="booking-review-card">
          <span>Booking ID</span>
          <strong>UC-PL-2048</strong>
          <p>Premium Plumbing</p>
        </article>
        <article className="booking-review-card">
          <span>Scheduled for</span>
          <strong>April 15, 2026</strong>
          <p>10:30 AM</p>
        </article>
        <article className="booking-review-card">
          <span>Amount paid</span>
          <strong>$190.00</strong>
          <p>Initial service deposit</p>
        </article>
      </div>

      <div className="booking-actions">
        <Link to="/services" className="booking-primary-action">
          Back to Services
        </Link>
        <button
          type="button"
          className="booking-secondary-button"
          onClick={onRestart}
        >
          Book Another Service
        </button>
      </div>
    </section>
  );
}

export function BookingSummaryCard() {
  return (
    <aside className="booking-panel booking-summary-panel">
      <p className="booking-summary-kicker">Booking summary</p>

      <div className="booking-summary-service">
        <span className="booking-summary-category">Plumbing</span>
        <h2>Premium Plumbing</h2>
        <p>
          White-glove plumbing support for fixture upgrades, repairs, and
          preventative maintenance.
        </p>
      </div>

      <div className="booking-summary-price">
        <strong>From $95/hr</strong>
        <span>Typical visit: 2 to 4 hours</span>
      </div>

      <div className="booking-summary-breakdown">
        <div>
          <span>Service estimate</span>
          <strong>$190.00</strong>
        </div>
        <div>
          <span>Platform fee</span>
          <strong>$18.00</strong>
        </div>
        <div>
          <span>Taxes</span>
          <strong>$12.00</strong>
        </div>
        <div className="booking-summary-total">
          <span>Total today</span>
          <strong>$220.00</strong>
        </div>
      </div>

      <div className="booking-summary-list">
        <p>Same-week appointments available</p>
        <p>Licensed and vetted specialists</p>
        <p>Transparent scope before work begins</p>
        <p>Service confirmation after request review</p>
      </div>

      <div className="booking-summary-note">
        <h3>What happens next?</h3>
        <p>
          Once submitted, your request is reviewed and matched with an
          available premium provider for confirmation.
        </p>
      </div>
    </aside>
  );
}
