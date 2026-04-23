import { useAuth } from '../context/AuthContext';

export function useAuthGate() {
  const { authState } = useAuth();

  const isLoaded = Boolean(authState?.isLoaded);
  const isSignedIn = Boolean(authState?.isSignedIn);
  const role = authState?.role;
  const isRoleResolved = !isSignedIn || Boolean(role);

  return {
    isLoaded,
    isSignedIn,
    role,
    isRoleResolved,
    isLoading: !isLoaded || !isRoleResolved,
  };
}

export function useHasRole(allowedRoles) {
  const { isLoaded, isSignedIn, role } = useAuthGate();

  if (!isLoaded) return { authorized: false, loading: true };
  if (!isSignedIn) return { authorized: false, loading: false };
  if (!allowedRoles.includes(role)) return { authorized: false, loading: false };

  return { authorized: true, loading: false };
}