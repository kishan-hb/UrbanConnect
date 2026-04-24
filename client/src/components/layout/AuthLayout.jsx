import { Link } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout({ children }) {
  const legalLinks = ['Conditions of Use', 'Privacy Notice', 'Help'];

  return (
    <main className="auth-page">
      <div className="auth-stack">
        <div className="auth-logo-wrap">
          <Link to="/" className="auth-logo-link" aria-label="UrbanConnect home">
            <span className="auth-logo-mark" aria-hidden="true">
              U
            </span>
            <span className="auth-logo-text">UrbanConnect</span>
          </Link>
        </div>

        <section className="auth-shell" aria-label="Authentication form">
          {children}
        </section>
      </div>

      <footer className="auth-legal" aria-label="Legal links">
        <nav className="auth-legal-links">
          {legalLinks.map((item) => (
            <button key={item} type="button" className="auth-legal-link">
              {item}
            </button>
          ))}
        </nav>
        <p className="auth-legal-copy">� 2026 UrbanConnect. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default AuthLayout;

