import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getBaseUrl, getDocUrl } from "../utility/getBaseUrl";
import { getToken, clearAuth } from "../utility/authStorage";

export const DOC_URL = getDocUrl();

export const axiosInstance = Axios.create({
  baseURL: getBaseUrl(),
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

// Attach a valid access token to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear the session and bounce to login (once).
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      if (!window.location.hash.includes("/login")) {
        window.location.assign("/#/login");
      }
    }
    return Promise.reject(error);
  }
);
