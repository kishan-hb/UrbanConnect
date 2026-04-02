import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProviderDashboardPage from './pages/ProviderDashboardPage.jsx';
import ProviderOnboardingPage from './pages/ProviderOnboardingPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import { useAuth } from './context/AuthContext';
import './App.css';

function RouteAccessLoading() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      Loading...
    </div>
  );
}

function RoleRoute({ allowedRoles, children }) {
  const { authState } = useAuth();

  const isLoaded = Boolean(authState?.isLoaded);
  const isSignedIn = Boolean(authState?.isSignedIn);
  const role = authState?.role;
  const isRoleResolved = !isSignedIn || Boolean(role);

  if (!isLoaded || !isRoleResolved) {
    return <RouteAccessLoading />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route
            path="/provider-onboarding"
            element={
              <RoleRoute allowedRoles={['customer']}>
                <ProviderOnboardingPage />
              </RoleRoute>
            }
          />
          <Route
            path="/provider"
            element={
              <RoleRoute allowedRoles={['provider']}>
                <ProviderDashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
