import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Chat-retention control panel (admins only).
export const fetchChatRetention = () =>
  axiosInstance.get("/admin/chat-retention").then(unwrap);

export const updateChatRetention = (payload) =>
  axiosInstance.put("/admin/chat-retention", payload).then(unwrap);

export const purgeChatNow = () =>
  axiosInstance.post("/admin/chat-retention/purge").then(unwrap);
