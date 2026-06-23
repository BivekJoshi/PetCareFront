import { useQuery } from "react-query";
import {
  fetchContacts,
  fetchConversations,
  fetchThread,
  fetchBroadcast,
  fetchUnreadCount,
} from "../../api/chat/chat-api";

// Centralised react-query keys so the ChatContext can update/invalidate caches
// when realtime socket events arrive.
export const chatKeys = {
  contacts: (search) => ["chat", "contacts", search || ""],
  conversations: ["chat", "conversations"],
  thread: (userId) => ["chat", "thread", userId],
  broadcast: ["chat", "broadcast"],
  unread: ["chat", "unread"],
};

export const useContacts = (search) =>
  useQuery(chatKeys.contacts(search), () => fetchContacts(search), {
    keepPreviousData: true,
  });

export const useConversations = () =>
  useQuery(chatKeys.conversations, fetchConversations);

export const useThread = (userId) =>
  useQuery(chatKeys.thread(userId), () => fetchThread(userId, { limit: 100 }), {
    enabled: Boolean(userId),
  });

export const useBroadcast = () =>
  useQuery(chatKeys.broadcast, () => fetchBroadcast({ limit: 100 }));

export const useUnreadCount = () =>
  useQuery(chatKeys.unread, fetchUnreadCount, {
    select: (data) => data?.count ?? 0,
  });
