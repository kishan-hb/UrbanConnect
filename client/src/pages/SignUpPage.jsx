import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { SignUp } from '@clerk/clerk-react';
import { clerkAuthAppearance } from '../utils/clerkAuthAppearance';
import './AuthPages.css';

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function SignUpPage() {
  const query = useQueryParams();
  const email = query.get('email') || '';

  return (
    <AuthLayout>
      <div className="auth-form">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl={email ? `/sign-in?email=${encodeURIComponent(email)}` : '/sign-in'}
          appearance={clerkAuthAppearance}
          initialValues={email ? { emailAddress: email } : undefined}
        />
      </div>
    </AuthLayout>
  );
}

export default SignUpPage;
