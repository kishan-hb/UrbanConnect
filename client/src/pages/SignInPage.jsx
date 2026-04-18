import { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { SignIn } from '@clerk/clerk-react';
import { clerkAuthAppearance } from '../utils/clerkAuthAppearance';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';


function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function SignInPage() {
  const query = useQueryParams();
  const email = query.get('email') || '';
  const { authState } = useAuth();
  const navigate = useNavigate();
  console.log('authState:', authState);


  useEffect(() => {
    if (authState?.isLoaded && authState?.isSignedIn && authState?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [authState, navigate]);

  return (
    
    <AuthLayout>
      <div className="auth-form">
        <SignIn
  routing="path"
  path="/sign-in"
  signUpUrl={email ? `/sign-up?email=${encodeURIComponent(email)}` : '/sign-up'}
  appearance={clerkAuthAppearance}
  initialValues={email ? { identifier: email } : undefined}
  afterSignInUrl="/admin"
/>

      </div>
    </AuthLayout>
    
  );
  
}
export default SignInPage;