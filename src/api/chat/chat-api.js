import { axiosInstance } from "../axiosInterceptor";

// API responses use the { success, message, data } envelope.
const unwrap = (res) => res.data?.data;

export const fetchContacts = (search) =>
  axiosInstance.get("/chat/contacts", { params: { search } }).then(unwrap);

export const fetchConversations = () =>
  axiosInstance.get("/chat/conversations").then(unwrap);

export const fetchThread = (userId, params) =>
  axiosInstance.get(`/chat/messages/${userId}`, { params }).then(unwrap);

export const sendDirectMessage = ({ recipientId, content, attachment }) =>
  axiosInstance
    .post("/chat/messages", { recipientId, content, attachment })
    .then(unwrap);

// Upload a file/document; resolves to { url, name, type, size } to attach to
// a message. `onProgress` (0–100) is optional.
export const uploadAttachment = (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return axiosInstance
    .post("/chat/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    })
    .then(unwrap);
};

export const markThreadRead = (userId) =>
  axiosInstance.post(`/chat/messages/${userId}/read`).then(unwrap);

export const editMessage = ({ id, content }) =>
  axiosInstance.patch(`/chat/message/${id}`, { content }).then(unwrap);

// scope: "me" (hide for self) | "everyone" (delete for all participants)
export const deleteMessage = ({ id, scope = "me" }) =>
  axiosInstance.delete(`/chat/message/${id}`, { params: { scope } }).then(unwrap);

export const forwardMessage = ({ id, recipientId }) =>
  axiosInstance.post(`/chat/message/${id}/forward`, { recipientId }).then(unwrap);

// ── Nicknames ──
export const setNickname = ({ userId, label }) =>
  axiosInstance.put(`/chat/nicknames/${userId}`, { label }).then(unwrap);

export const clearNickname = (userId) =>
  axiosInstance.delete(`/chat/nicknames/${userId}`).then(unwrap);

// ── Call history ──
export const fetchCallHistory = () =>
  axiosInstance.get("/chat/calls").then(unwrap);

// ── Groups ──
export const fetchGroups = () => axiosInstance.get("/chat/groups").then(unwrap);

export const createGroup = ({ name, memberIds }) =>
  axiosInstance.post("/chat/groups", { name, memberIds }).then(unwrap);

export const fetchGroup = (id) =>
  axiosInstance.get(`/chat/groups/${id}`).then(unwrap);

export const fetchGroupMessages = (id, params) =>
  axiosInstance.get(`/chat/groups/${id}/messages`, { params }).then(unwrap);

export const fetchGroupMembers = (id) =>
  axiosInstance.get(`/chat/groups/${id}/members`).then(unwrap);

export const addGroupMembers = ({ id, memberIds }) =>
  axiosInstance.post(`/chat/groups/${id}/members`, { memberIds }).then(unwrap);

export const removeGroupMember = ({ id, userId }) =>
  axiosInstance.delete(`/chat/groups/${id}/members/${userId}`).then(unwrap);

export const renameGroup = ({ id, name }) =>
  axiosInstance.patch(`/chat/groups/${id}`, { name }).then(unwrap);

export const leaveGroup = (id) =>
  axiosInstance.post(`/chat/groups/${id}/leave`).then(unwrap);

export const fetchBroadcast = (params) =>
  axiosInstance.get("/chat/broadcast", { params }).then(unwrap);

export const sendBroadcastMessage = ({ content, attachment }) =>
  axiosInstance.post("/chat/broadcast", { content, attachment }).then(unwrap);

export const fetchUnreadCount = () =>
  axiosInstance.get("/chat/unread").then(unwrap);

export const registerDevice = ({ token, platform }) =>
  axiosInstance.post("/chat/devices", { token, platform }).then(unwrap);

export const unregisterDevice = (token) =>
  axiosInstance.delete("/chat/devices", { data: { token } }).then(unwrap);
