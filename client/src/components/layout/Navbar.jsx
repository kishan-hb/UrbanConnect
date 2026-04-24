import { useClerk } from '@clerk/clerk-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Find Services' },
  { to: '/contact', label: 'Contact' },
];

const roleLinks = {
  customer: [
    ...publicLinks,
    { to: '/booking', label: 'Bookings' },
    { to: '/provider-onboarding', label: 'Become a Provider' },
  ],
  provider: [
    { to: '/provider', label: 'Provider Dashboard' },
  ],
  admin: [
    { to: '/admin', label: 'Admin Dashboard' },
  ],
};

const providerControlLinks = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'requests', label: 'Booking Requests', icon: 'calendar_today' },
  { id: 'services', label: 'My Services', icon: 'home_repair_service' },
  { id: 'availability', label: 'Availability', icon: 'event_available' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'recent', label: 'Recent Jobs', icon: 'task_alt' },
  { id: 'earnings', label: 'Earnings', icon: 'payments' },
];

function Navbar() {
  const { authState } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProviderControlsOpen, setIsProviderControlsOpen] = useState(false);

  if (!authState?.isLoaded) {
    return null;
  }

  const isSignedIn = Boolean(authState?.isSignedIn);
  const role = authState?.role;
  const navLinks = isSignedIn && roleLinks[role] ? roleLinks[role] : publicLinks;
  const showProviderControls = isSignedIn && role === 'provider';

  async function handleSignOut(event) {
    event.preventDefault();
    try {
      await signOut();
      navigate('/sign-in', { replace: true });
    } catch {
      navigate('/sign-in', { replace: true });
    }
  }

  function handleProviderControl(sectionId) {
    setIsProviderControlsOpen(false);
    navigate(`/provider?section=${sectionId}`);
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300">
      <div className="relative flex items-center gap-3 shrink-0">
        {showProviderControls ? (
          <button
            type="button"
            onClick={() => setIsProviderControlsOpen((isOpen) => !isOpen)}
            className="w-10 h-10 rounded-lg border border-slate-200 text-[#003366] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-expanded={isProviderControlsOpen}
            aria-label="Open provider controls"
          >
            <span className="material-icons">{isProviderControlsOpen ? 'close' : 'menu'}</span>
          </button>
        ) : null}

        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            <span className="material-icons text-white text-base">domain</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-xl font-black tracking-tighter text-[#003366] leading-none">
              UrbanConnect
            </span>
            <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Premium Home Management
            </span>
          </div>
        </Link>

        {showProviderControls && isProviderControlsOpen ? (
          <div className="absolute top-14 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 flex flex-col gap-1">
            {providerControlLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleProviderControl(link.id)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#003366] transition-colors text-left"
              >
                <span className="material-icons text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink 
            key={link.to}
            to={link.to} 
            className={({ isActive }) => 
              `text-sm font-bold tracking-tight transition-colors ${isActive ? 'text-[#003366] border-b-2 border-[#003366] pb-1' : 'text-slate-500 hover:text-[#003366]'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <button className="text-slate-400 hover:text-[#003366] transition-colors">
            <span className="material-icons">notifications</span>
          </button>
          {!isSignedIn ? (
            <>
              <NavLink to="/sign-in" className="text-sm font-bold text-[#003366] hover:text-blue-800 transition-colors">
                Sign In
              </NavLink>
              <NavLink 
                to="/sign-up" 
                className="bg-[#003366] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-lg active:scale-95"
              >
                Join as Pro
              </NavLink>
            </>
          ) : (
            <button 
              onClick={handleSignOut} 
              className="text-sm font-bold text-slate-500 hover:text-[#003366] transition-colors flex items-center gap-1"
            >
              Logout <span className="material-icons text-sm">logout</span>
            </button>
          )}
        </div>
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#003366]">
          <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-100 flex flex-col p-6 gap-4 md:hidden animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-slate-500">
              {link.label}
            </NavLink>
          ))}
          <hr className="border-slate-100" />
          {!isSignedIn ? (
            <div className="flex flex-col gap-3">
              <NavLink to="/sign-in" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-[#003366]">Sign In</NavLink>
              <NavLink to="/sign-up" onClick={() => setIsMenuOpen(false)} className="bg-[#003366] text-white text-center py-3 rounded-xl font-bold text-base shadow-lg">Join as Pro</NavLink>
            </div>
          ) : (
            <button onClick={handleSignOut} className="text-base font-bold text-slate-500 flex items-center gap-2">
              Logout <span className="material-icons">logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
