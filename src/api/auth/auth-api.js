import { axiosInstance } from "../axiosInterceptor";

// API responses use the envelope { success, message, data }.
// These helpers return the inner `data` payload directly.
const unwrap = (res) => res.data?.data;

export const loginRequest = (payload) =>
  axiosInstance.post("/auth/login", payload).then(unwrap);

export const registerRequest = (payload) =>
  axiosInstance.post("/auth/register", payload).then(unwrap);

// Exchange a Google OAuth access token for a PetCare session. The response
// includes `needsPhone` when the account has no phone number on file yet.
export const googleAuthRequest = ({ accessToken }) =>
  axiosInstance.post("/auth/google", { accessToken }).then(unwrap);

export const getMe = () => axiosInstance.get("/auth/me").then(unwrap);

// Public auth config (e.g. whether phone OTP verification is required).
export const getAuthConfig = () => axiosInstance.get("/auth/config").then(unwrap);

export const logoutRequest = () => axiosInstance.post("/auth/logout").then(unwrap);

// Phone (WhatsApp) OTP verification. During signup the user isn't persisted in
// AuthContext yet, so these accept an explicit access token; once logged in the
// axios interceptor supplies it automatically (pass no token).
const authHeader = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

// Attach a phone number to the signed-in account (used right after Google
// sign-in, before the session is persisted, so the token is passed explicitly).
export const setPhoneRequest = ({ phone, token }) =>
  axiosInstance.post("/auth/phone", { phone }, authHeader(token)).then(unwrap);

// Add a password to an account that has none (e.g. right after Google sign-in,
// before the session is persisted — so the token is passed explicitly). Once
// signed in, omit `token` and the interceptor supplies it.
export const setPasswordRequest = ({ password, confirmPassword, token }) =>
  axiosInstance
    .post("/auth/password/set", { password, confirmPassword }, authHeader(token))
    .then(unwrap);

// Change an existing password (requires the current one). Uses the logged-in
// session token from the interceptor.
export const changePasswordRequest = ({ currentPassword, newPassword, confirmPassword }) =>
  axiosInstance
    .post("/auth/password/change", { currentPassword, newPassword, confirmPassword })
    .then(unwrap);

export const sendPhoneOtp = (token) =>
  axiosInstance.post("/auth/phone/send-otp", {}, authHeader(token)).then(unwrap);

export const verifyPhoneOtp = ({ code, token }) =>
  axiosInstance
    .post("/auth/phone/verify", { code }, authHeader(token))
    .then(unwrap);

export const sendEmailOtp = (token) =>
  axiosInstance.post("/auth/email/send-otp", {}, authHeader(token)).then(unwrap);

export const verifyEmailOtp = ({ code, token }) =>
  axiosInstance
    .post("/auth/email/verify", { code }, authHeader(token))
    .then(unwrap);

// Per-channel senders/verifiers keyed by channel name, for generic flows.
export const otpApi = {
  email: { send: sendEmailOtp, verify: verifyEmailOtp },
  phone: { send: sendPhoneOtp, verify: verifyPhoneOtp },
};
