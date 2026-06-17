import { axiosInstance } from "../axiosInterceptor";

// API responses use the envelope { success, message, data }.
// These helpers return the inner `data` payload directly.
const unwrap = (res) => res.data?.data;

export const loginRequest = (payload) =>
  axiosInstance.post("/auth/login", payload).then(unwrap);

export const registerRequest = (payload) =>
  axiosInstance.post("/auth/register", payload).then(unwrap);

export const getMe = () => axiosInstance.get("/auth/me").then(unwrap);

export const logoutRequest = () => axiosInstance.post("/auth/logout").then(unwrap);
