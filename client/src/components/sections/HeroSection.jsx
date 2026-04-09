
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const [service, setService] = useState('');
  const [zipCode, setZipCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (service.trim()) {
      params.set('service', service.trim());
    }

    if (zipCode.trim()) {
      params.set('zipCode', zipCode.trim());
    }

    const queryString = params.toString();
    navigate(queryString ? `/services?${queryString}` : '/services');
  }

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-pill">
          <span className="hero-pill-dot" />
          <span>The trusted choice for home services</span>
        </div>

        <h1 className="hero-title">
          <span>Architectural</span>
          <span className="hero-title-highlight">Precision</span>
          <span>for</span>
          <span>Your Home.</span>
        </h1>

        <p className="hero-text">
          Experience a curated concierge service for your residence. We connect
          you with verified professionals for maintenance, repairs, and luxury
          home care.
        </p>

        <form className="hero-search-panel" onSubmit={handleSubmit}>
          <label className="hero-search-field">
            <span className="hero-search-icon">Q</span>
            <div>
              <p className="hero-search-label">What</p>
              <input
                className="hero-search-input"
                type="text"
                name="service"
                placeholder="What service do you need?"
                value={service}
                onChange={(event) => setService(event.target.value)}
              />
            </div>
          </label>

          <label className="hero-search-field">
            <span className="hero-search-icon">P</span>
            <div>
              <p className="hero-search-label">Where</p>
              <input
                className="hero-search-input"
                type="text"
                name="zipCode"
                placeholder="Your Zip Code"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
              />
            </div>
          </label>

          <button type="submit" className="button button-primary hero-search-button">
            Find Now
          </button>

        </form>
      </div>

      <div className="hero-image-card">
        <div className="hero-visual-blob" />
        <div className="hero-image-frame">
          <div className="hero-image-placeholder">
            <div className="hero-room-glow" />
            <div className="hero-room-window" />
            <div className="hero-room-furniture" />
            <span>Interior Preview</span>
          </div>
        </div>

        <div className="hero-floating-badge">
          <div className="hero-badge-icon">+</div>
          <div>
            <p className="hero-badge-label">Pro Expert</p>
            <strong>4,800+ Professionals</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
