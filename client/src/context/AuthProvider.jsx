import { useMemo, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import AuthContext from './AuthContext';
import { initialAuthState } from '../utils/authState';
import { createUser, getUserByClerkId } from '../api/userApi';

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(initialAuthState);
  const { isLoaded, isSignedIn, userId, getToken } = useClerkAuth();
  const { user } = useUser();

  function setSession(sessionData) {
    setAuthState((prev) => ({
      ...prev,
      ...sessionData,
      isLoaded: true,
      isSignedIn: true,
    }));
  }

  function clearSession() {
    setAuthState({
      ...initialAuthState,
      isLoaded: true,
    });
  }

  function updateRole(role) {
    setAuthState((prev) => ({
      ...prev,
      role,
    }));
  }

  function buildUserPayload(clerkUser, clerkId) {
    return {
      clerkId,
      email: clerkUser?.primaryEmailAddress?.emailAddress || '',
      username:
        clerkUser?.username ||
        clerkUser?.firstName ||
        clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
        `user_${clerkId?.slice(-6)}`,
      profilePicture: clerkUser?.imageUrl || '',
      role: 'customer',
    };
  }

  useEffect(() => {
    async function syncClerkAuth() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setAuthState({
          ...initialAuthState,
          isLoaded: true,
        });
        return;
      }

      // Prevent stale-role flashes while we resolve the signed-in user's app profile.
      setAuthState((prev) => ({
        ...prev,
        isLoaded: false,
        token: null,
        role: null,
        user: null,
      }));

      try {
        const token = await getToken();

        let appUser = null;

        try {
          appUser = await getUserByClerkId(userId, token);
        } catch {
          const payload = buildUserPayload(user, userId);
          appUser = await createUser(payload, token);
        }

        setAuthState((prev) => ({
          ...prev,
          isLoaded: true,
          isSignedIn: true,
          token: token || null,
          clerkId: userId || null,
          role: appUser?.role || 'customer',
          user: appUser || user || null,
        }));
      } catch {
        setAuthState({
          ...initialAuthState,
          isLoaded: true,
        });
      }
    }

    syncClerkAuth();
  }, [isLoaded, isSignedIn, userId, user, getToken]);

  const value = useMemo(
    () => ({
      authState,
      setAuthState,
      setSession,
      clearSession,
      updateRole,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
