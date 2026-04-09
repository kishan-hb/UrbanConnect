import { useMemo, useState } from 'react';
import AuthContext from './AuthContext';
import { initialAuthState } from '../utils/authState';

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(initialAuthState);

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
