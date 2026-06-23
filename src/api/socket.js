import { io } from "socket.io-client";
import { getBaseUrl } from "../utility/getBaseUrl";
import { getToken } from "../utility/authStorage";

// The Socket.IO server runs on the API host, not under the /api/v1 path.
// Derive it from the REST base URL, or override with VITE_SOCKET_URL.
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  try {
    return new URL(getBaseUrl()).origin;
  } catch {
    return "http://localhost:8081";
  }
};

let socket = null;

/**
 * Return the shared socket instance, creating (and connecting) it on first
 * use with the current access token. Safe to call repeatedly.
 */
export const getSocket = () => {
  if (socket) return socket;

  socket = io(getSocketUrl(), {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: { token: getToken() },
  });

  return socket;
};

/** Connect (refreshing the auth token first). Idempotent. */
export const connectSocket = () => {
  const s = getSocket();
  s.auth = { token: getToken() };
  if (!s.connected) s.connect();
  return s;
};

/** Disconnect and drop the instance — call on logout. */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
