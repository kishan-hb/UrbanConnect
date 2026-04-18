import { useClerk } from '@clerk/clerk-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { authState } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  if (!authState?.isLoaded ) {
    return null;
  }

  const isSignedIn = Boolean(authState?.isSignedIn);
  const role = authState?.role;

  async function handleSignOut(event) {
    event.preventDefault();

    try {
      await signOut();
      navigate('/sign-in', { replace: true });
    } catch {
      navigate('/sign-in', { replace: true });
    }
  }

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
        {isSignedIn && role === 'admin' ? (
          <NavLink to="/admin" className="site-nav-link">
            Admin Dashboard
          </NavLink>
        ) : (
          <>
            <NavLink to="/" className="site-nav-link">
              Home
            </NavLink>
            <NavLink to="/services" className="site-nav-link">
              Find Services
            </NavLink>
            <NavLink to="/contact" className="site-nav-link">
              Contact
            </NavLink>
            {isSignedIn && role === 'customer' && (
              <NavLink to="/booking" className="site-nav-link">
                Booking
              </NavLink>
            )}
            {isSignedIn && role === 'provider' && (
              <NavLink to="/provider" className="site-nav-link">
                Provider Dashboard
              </NavLink>
            )}
          </>
        )}
      </div>

      <div className="site-nav-actions">
        {!isSignedIn ? (
          <>
            <NavLink to="/sign-in" className="site-nav-login">
              Login
            </NavLink>
            <NavLink to="/sign-up" className="site-nav-signup">
              Sign Up
            </NavLink>
          </>
        ) : (
          <NavLink to="/sign-in" className="site-nav-login" onClick={handleSignOut}>
            Logout
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
