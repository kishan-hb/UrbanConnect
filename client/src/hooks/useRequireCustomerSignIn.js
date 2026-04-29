import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireCustomerSignIn() {
  const { authState } = useAuth();
  const navigate = useNavigate();

  return (action) => {
    if (!authState?.isSignedIn || authState?.role !== 'customer') {
      navigate('/sign-in');
      return;
    }
    action();
  };
}
