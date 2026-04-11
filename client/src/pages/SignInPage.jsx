import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { SignIn } from '@clerk/clerk-react';
import { clerkAuthAppearance } from '../utils/clerkAuthAppearance';
import './AuthPages.css';

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function SignInPage() {
  const query = useQueryParams();
  const email = query.get('email') || '';

  return (
    <AuthLayout>
      <div className="auth-form">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl={email ? `/sign-up?email=${encodeURIComponent(email)}` : '/sign-up'}
          appearance={clerkAuthAppearance}
          initialValues={email ? { identifier: email } : undefined}
        />
      </div>
    </AuthLayout>
  );
}

export default SignInPage;
