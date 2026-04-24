import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

const DEFAULT_SERVICE_PRICE = 190;
const PLATFORM_FEE = 18;
const TAX = 12;

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function BookingPage() {
  const [searchParams] = useSearchParams();
  const { authState } = useAuth();

  const serviceId = (searchParams.get('serviceId') || '').trim();
  const serviceTitle = (searchParams.get('title') || 'Selected service').trim();
  const providerId = (searchParams.get('provider') || 'Not available').trim();
  const urlPriceRaw = searchParams.get('price');
  const urlPrice = Number(urlPriceRaw);

  const serviceFee = Number.isFinite(urlPrice) && urlPrice > 0 ? urlPrice : DEFAULT_SERVICE_PRICE;
  const totalAmount = useMemo(() => serviceFee + PLATFORM_FEE + TAX, [serviceFee]);

  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    instructions: '',
    date: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summaryDate = useMemo(() => {
    if (!formState.date) {
      return 'Not selected yet';
    }

    const dateValue = new Date(`${formState.date}T00:00:00`);
    if (Number.isNaN(dateValue.getTime())) {
      return 'Not selected yet';
    }

    return dateValue.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [formState.date]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    if (!authState?.token) {
      setSubmitError('Please sign in first.');
      return;
    }

    if (!serviceId) {
      setSubmitError('Service is missing. Please book from the service details page.');
      return;
    }

    const bookingPayload = {
      bookingId: `BK-${Date.now()}`,
      serviceId,
      serviceTitle,
      date: formState.date,
      timeSlot: '10:00-12:00',
      customerDetails: {
        fullName: formState.fullName,
        email: formState.email,
        phone: formState.phone,
        address: formState.address,
        city: formState.city,
        zipCode: formState.zipCode,
        instructions: formState.instructions,
      },
    };

    try {
      setIsSubmitting(true);
      await createBooking(bookingPayload, authState.token);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="booking-checkout-page">
      <header className="booking-checkout-header">
        <p className="booking-checkout-kicker">Secure checkout</p>
        <h1>Book your service</h1>
        <p>Fill in your details on the left and review everything on the right before confirming.</p>
      </header>

      <section className="booking-checkout-layout">
        <section className="booking-checkout-card booking-checkout-form-wrap" aria-label="Booking form">
          {isSubmitted ? (
            <section className="booking-confirmation-simple" aria-live="polite">
              <h2>Booking submitted</h2>
              <p>Your request has been submitted successfully. You can review details in the summary panel.</p>
              <button
                type="button"
                className="booking-primary-button"
                onClick={() => setIsSubmitted(false)}
              >
                Edit booking
              </button>
            </section>
          ) : (
            <form className="booking-checkout-form" onSubmit={handleSubmit}>
              <section className="booking-checkout-section">
                <h2>Personal information</h2>
                <div className="booking-field-grid two-col">
                  <label className="booking-input-group">
                    <span>Full name</span>
                    <input
                      name="fullName"
                      type="text"
                      value={formState.fullName}
                      onChange={updateField}
                      placeholder="John Doe"
                      required
                    />
                  </label>

                  <label className="booking-input-group">
                    <span>Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={updateField}
                      placeholder="(123) 456-7890"
                      required
                    />
                  </label>

                  <label className="booking-input-group full-width">
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={updateField}
                      placeholder="name@example.com"
                      required
                    />
                  </label>

                  <label className="booking-input-group full-width">
                    <span>Booking date</span>
                    <input
                      name="date"
                      type="date"
                      value={formState.date}
                      onChange={updateField}
                      required
                    />
                  </label>

                  <label className="booking-input-group full-width">
                    <span>Service address</span>
                    <input
                      name="address"
                      type="text"
                      value={formState.address}
                      onChange={updateField}
                      placeholder="123 Main Street, Apt 4B"
                      required
                    />
                  </label>

                  <label className="booking-input-group">
                    <span>City</span>
                    <input
                      name="city"
                      type="text"
                      value={formState.city}
                      onChange={updateField}
                      placeholder="Vancouver"
                      required
                    />
                  </label>

                  <label className="booking-input-group">
                    <span>Zip code</span>
                    <input
                      name="zipCode"
                      type="text"
                      value={formState.zipCode}
                      onChange={updateField}
                      placeholder="V6B 1A1"
                      required
                    />
                  </label>

                  <label className="booking-input-group full-width">
                    <span>Special instructions</span>
                    <textarea
                      name="instructions"
                      rows="4"
                      value={formState.instructions}
                      onChange={updateField}
                      placeholder="Parking notes, entry instructions, pets, or anything the provider should know."
                    />
                  </label>
                </div>
              </section>

              <section className="booking-checkout-section">
                <h2>Card payment details</h2>
                <div className="booking-field-grid two-col">
                  <label className="booking-input-group full-width">
                    <span>Name on card</span>
                    <input
                      name="cardName"
                      type="text"
                      value={formState.cardName}
                      onChange={updateField}
                      placeholder="John Doe"
                      required
                    />
                  </label>

                  <label className="booking-input-group full-width">
                    <span>Card number</span>
                    <input
                      name="cardNumber"
                      type="text"
                      value={formState.cardNumber}
                      onChange={updateField}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </label>

                  <label className="booking-input-group">
                    <span>Expiry</span>
                    <input
                      name="expiry"
                      type="text"
                      value={formState.expiry}
                      onChange={updateField}
                      placeholder="MM/YY"
                      required
                    />
                  </label>

                  <label className="booking-input-group">
                    <span>CVV</span>
                    <input
                      name="cvv"
                      type="password"
                      value={formState.cvv}
                      onChange={updateField}
                      placeholder="123"
                      required
                    />
                  </label>
                </div>
              </section>

              {submitError ? <p className="booking-submit-error">{submitError}</p> : null}

              <div className="booking-actions-row">
                <Link to="/services" className="booking-ghost-link">
                  Back to services
                </Link>
                <button type="submit" className="booking-primary-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Confirm booking'}
                </button>
              </div>
            </form>
          )}
        </section>

        <aside className="booking-checkout-card booking-summary-wrap" aria-label="Booking summary">
          <p className="booking-summary-label">Order summary</p>
          <h2>{serviceTitle}</h2>

          <div className="booking-summary-items">
            <div>
              <span>Provider</span>
              <strong>{providerId}</strong>
            </div>
            <div>
              <span>Service booked</span>
              <strong>{serviceTitle}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{summaryDate}</strong>
            </div>
          </div>

          <div className="booking-price-breakdown">
            <div>
              <span>Service fee</span>
              <strong>{formatCurrency(serviceFee)}</strong>
            </div>
            <div>
              <span>Platform fee</span>
              <strong>{formatCurrency(PLATFORM_FEE)}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>{formatCurrency(TAX)}</strong>
            </div>
            <div className="booking-price-total">
              <span>Total</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default BookingPage;
