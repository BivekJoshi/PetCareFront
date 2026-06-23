import { createContext, useContext, useMemo, useState } from "react";
import { getAuth, setAuth as persist, clearAuth } from "../utility/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(() => getAuth());

  // Called after a successful login/register with the API payload.
  const login = (data) => {
    const value = {
      token: data.token,
      refreshToken: data.refreshToken,
      userType: data.userType,
      user: data.user,
    };
    persist(value);
    setAuthState(value);
  };

  const logout = () => {
    clearAuth();
    setAuthState(null);
  };

  // Merge fields into the stored user (e.g. after phone verification).
  const updateUser = (patch) => {
    setAuthState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...patch } };
      persist(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      auth,
      user: auth?.user ?? null,
      role: auth?.user?.role ?? auth?.userType ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
      updateUser,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
