import { axiosInstance } from "../axiosInterceptor";

// API responses use the envelope { success, message, data }.
// These helpers return the inner `data` payload directly.
const unwrap = (res) => res.data?.data;

export const loginRequest = (payload) =>
  axiosInstance.post("/auth/login", payload).then(unwrap);

export const registerRequest = (payload) =>
  axiosInstance.post("/auth/register", payload).then(unwrap);

export const getMe = () => axiosInstance.get("/auth/me").then(unwrap);

// Public auth config (e.g. whether phone OTP verification is required).
export const getAuthConfig = () => axiosInstance.get("/auth/config").then(unwrap);

export const logoutRequest = () => axiosInstance.post("/auth/logout").then(unwrap);

// Phone (WhatsApp) OTP verification. During signup the user isn't persisted in
// AuthContext yet, so these accept an explicit access token; once logged in the
// axios interceptor supplies it automatically (pass no token).
const authHeader = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

export const sendPhoneOtp = (token) =>
  axiosInstance.post("/auth/phone/send-otp", {}, authHeader(token)).then(unwrap);

export const verifyPhoneOtp = ({ code, token }) =>
  axiosInstance
    .post("/auth/phone/verify", { code }, authHeader(token))
    .then(unwrap);
