import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand-block">
          <h2 className="site-footer-brand">UrbanConnect</h2>
          <p className="site-footer-description">
            &copy; 2024 UrbanConnect. Architectural precision in home services.
          </p>

          <div className="site-footer-socials" aria-label="Social links">
            <a href="/" className="site-footer-social" aria-label="UrbanConnect globe link">
              G
            </a>
            <a href="/" className="site-footer-social" aria-label="UrbanConnect contact link">
              @
            </a>
          </div>
        </div>

        <div className="site-footer-links-column">
          <h3>Company</h3>
          <a href="/">About Us</a>
          <a href="/">Safety</a>
          <a href="/">Terms of Service</a>
        </div>

        <div className="site-footer-links-column">
          <h3>Support</h3>
          <a href="/">Privacy Policy</a>
          <a href="/">Help Center</a>
          <a href="/">Partner with Us</a>
        </div>

        <div className="site-footer-newsletter">
          <h3>Newsletter</h3>
          <p>
            Subscribe for editorial home tips and curated expert insights.
          </p>

          <form className="site-footer-form">
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>Designed for the modern residence. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
