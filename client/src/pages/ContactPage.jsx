import { Link } from 'react-router-dom';
import './ContactPage.css';

function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-kicker">Support</p>
        <h1>Contact UrbanConnect</h1>
        <p>
          Need help with a booking, provider onboarding, or billing? Send us a
          message and our team will get back to you.
        </p>
      </section>

      <section className="contact-layout">
        <section className="contact-card">
          <h2>Send a message</h2>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <label className="contact-field">
              <span>Full name</span>
              <input type="text" placeholder="Your name" required />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input type="email" placeholder="name@example.com" required />
            </label>

            <label className="contact-field">
              <span>Message</span>
              <textarea rows="5" placeholder="How can we help?" required />
            </label>

            <button type="submit" className="contact-primary-button">
              Send message
            </button>
          </form>
        </section>

        <aside className="contact-card contact-info">
          <h2>Contact details</h2>
          <p>Email: support@urbanconnect.com</p>
          <p>Phone: +1 (800) 555-0199</p>
          <p>Hours: Mon-Fri, 9:00 AM to 6:00 PM</p>

          <Link to="/services" className="contact-link">
            Browse services
          </Link>
        </aside>
      </section>
    </main>
  );
}

export default ContactPage;
