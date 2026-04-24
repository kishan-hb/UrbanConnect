import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useAuthGate, useHasRole } from './hooks/useAuthGate';
import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage.jsx'));
const ProviderOnboardingPage = lazy(() => import('./pages/ProviderOnboardingPage.jsx'));
const ProviderDashboardPage = lazy(() => import('./pages/ProviderDashboardPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function RouteAccessLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        fontSize: '1.1rem',
        color: '#677d98',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #e4ebf5',
          borderTopColor: '#0c4ea3',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        Loading...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function RoleRedirect() {
  const { isLoading, isSignedIn, role } = useAuthGate();

  if (isLoading) return <RouteAccessLoading />;

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'provider') return <Navigate to="/provider" replace />;

  return <Navigate to="/" replace />;
}

function RoleRoute({ allowedRoles, children }) {
  const { isLoading, isSignedIn } = useAuthGate();
  const { authorized } = useHasRole(allowedRoles);

  if (isLoading) return <RouteAccessLoading />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!authorized) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<RouteAccessLoading />}>
          <Routes>
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/auth/redirect" element={<RoleRedirect />} />

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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;