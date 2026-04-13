import { Link } from 'react-router-dom';

function BookingDetailsStep({ onContinue }) {
  return (
    <form className="booking-form">
      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Contact details</h2>
          <p>We&apos;ll use these details to confirm and coordinate your booking.</p>
        </div>

        <div className="booking-form-grid booking-form-grid-two">
          <label className="booking-field">
            <span>Full name</span>
            <input type="text" placeholder="Enter your full name" />
          </label>

          <label className="booking-field">
            <span>Phone number</span>
            <input type="tel" placeholder="(123) 456-7890" />
          </label>

          <label className="booking-field booking-field-full">
            <span>Email address</span>
            <input type="email" placeholder="name@example.com" />
          </label>
        </div>
      </div>

      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Service location</h2>
          <p>Tell us where the service will take place.</p>
        </div>

        <div className="booking-form-grid booking-form-grid-two">
          <label className="booking-field booking-field-full">
            <span>Street address</span>
            <input type="text" placeholder="Enter service address" />
          </label>

          <label className="booking-field">
            <span>City</span>
            <input type="text" placeholder="City" />
          </label>

          <label className="booking-field">
            <span>Zip code</span>
            <input type="text" placeholder="Zip code" />
          </label>
        </div>
      </div>

      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Scheduling preferences</h2>
          <p>Pick your ideal timing and let us know how urgent the request is.</p>
        </div>

        <div className="booking-form-grid booking-form-grid-two">
          <label className="booking-field">
            <span>Preferred date</span>
            <input type="date" />
          </label>

          <label className="booking-field">
            <span>Preferred time</span>
            <input type="time" />
          </label>
        </div>

        <label className="booking-checkbox">
          <input type="checkbox" />
          <span>This request is time-sensitive or urgent</span>
        </label>
      </div>

      <div className="booking-form-section">
        <div className="booking-form-heading">
          <h2>Project notes</h2>
          <p>Add any details that will help the provider understand the request.</p>
        </div>

        <label className="booking-field">
          <span>Describe the service request</span>
          <textarea
            rows="6"
            placeholder="Tell us about the issue, scope, or any details the provider should know before arriving."
          />
        </label>
      </div>

      <div className="booking-actions">
        <button
          type="button"
          className="booking-primary-action"
          onClick={onContinue}
        >
          Continue to Payment
        </button>
        <Link to="/services/premium-plumbing" className="booking-secondary-action">
          Back to Service
        </Link>
      </div>
    </form>
  );
}

export default BookingDetailsStep;
