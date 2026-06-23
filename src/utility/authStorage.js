// Single source of truth for persisted auth state.
// Stored shape: { token, refreshToken, userType, user }
const AUTH_KEY = "petcare.auth";

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
};

export const setAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => getAuth()?.token ?? null;

export const getRefreshToken = () => getAuth()?.refreshToken ?? null;

export const getStoredUser = () => getAuth()?.user ?? null;

// Swap in freshly minted tokens after a refresh, keeping the stored user/role.
// No-op if there's no existing session (nothing to refresh into).
export const updateTokens = ({ token, refreshToken }) => {
  const current = getAuth();
  if (!current) return null;
  const next = { ...current, token, refreshToken };
  setAuth(next);
  return next;
};
