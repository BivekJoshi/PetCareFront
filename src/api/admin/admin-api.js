import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Chat-retention control panel (admins only).
export const fetchChatRetention = () =>
  axiosInstance.get("/admin/chat-retention").then(unwrap);

export const updateChatRetention = (payload) =>
  axiosInstance.put("/admin/chat-retention", payload).then(unwrap);

export const purgeChatNow = () =>
  axiosInstance.post("/admin/chat-retention/purge").then(unwrap);

// Auth settings — WhatsApp OTP master switch (super admin only).
export const fetchAuthSettings = () =>
  axiosInstance.get("/admin/auth-settings").then(unwrap);

export const updateAuthSettings = (payload) =>
  axiosInstance.put("/admin/auth-settings", payload).then(unwrap);

// Editable transactional-email templates (super admin only).
export const fetchEmailTemplates = () =>
  axiosInstance.get("/admin/email-templates").then(unwrap);

export const updateEmailTemplate = ({ key, subject, html }) =>
  axiosInstance.put(`/admin/email-templates/${key}`, { subject, html }).then(unwrap);

export const resetEmailTemplate = (key) =>
  axiosInstance.post(`/admin/email-templates/${key}/reset`).then(unwrap);
