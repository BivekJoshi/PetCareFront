import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getBaseUrl, getDocUrl } from "../utility/getBaseUrl";
import {
  getToken,
  getRefreshToken,
  updateTokens,
  clearAuth,
} from "../utility/authStorage";

export const DOC_URL = getDocUrl();

const baseURL = getBaseUrl();

export const axiosInstance = Axios.create({
  baseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Bare client used only to hit /auth/refresh. It deliberately bypasses the
// interceptors below: a failed refresh would otherwise recurse, and a
// successful one would needlessly re-trigger itself.
const refreshClient = Axios.create({
  baseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

const isExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

const forceLogout = () => {
  clearAuth();
  if (!window.location.hash.includes("/login")) {
    window.location.assign("/#/login");
  }
};

// Single-flight refresh: while one /auth/refresh call is in flight, every other
// request that hit a 401 awaits the same promise instead of stampeding the
// endpoint (which rotates the refresh token, so parallel calls would clash).
let refreshing = null;

const runRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await refreshClient.post("/auth/refresh", { refreshToken });
  const data = res.data?.data;
  if (!data?.token) throw new Error("Malformed refresh response");

  // Persist the rotated pair — the backend issues a new refresh token too.
  updateTokens({ token: data.token, refreshToken: data.refreshToken });
  return data.token;
};

// Attach a valid access token to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try to silently refresh the access token once, then replay the
// original request. Only fall back to logout if there's no refresh token or
// the refresh itself fails (expired/revoked → genuinely signed out).
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status !== 401 || !original || original._retry) {
      if (status === 401) forceLogout();
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      refreshing =
        refreshing ||
        runRefresh().finally(() => {
          refreshing = null;
        });
      const newToken = await refreshing;

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch {
      forceLogout();
      return Promise.reject(error);
    }
  }
);
