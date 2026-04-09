import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="site-nav" aria-label="Primary">
      <Link to="/" className="site-brand">
        <span className="site-brand-mark" aria-hidden="true">
          <span className="site-brand-mark-core">U</span>
        </span>
        <span className="site-brand-text">
          <span className="site-brand-name">UrbanConnect</span>
          <span className="site-brand-tagline">Premium home services</span>
        </span>
      </Link>

      <div className="site-nav-links">
        <NavLink to="/" className="site-nav-link">
          Home
        </NavLink>
        <NavLink to="/services" className="site-nav-link">
          Find Services
        </NavLink>
        <NavLink to="/provider" className="site-nav-link">
          Providers
        </NavLink>
      </div>

      <div className="site-nav-actions">
        <NavLink to="/sign-in" className="site-nav-login">
          Login
        </NavLink>
        <NavLink to="/sign-up" className="site-nav-signup">
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
