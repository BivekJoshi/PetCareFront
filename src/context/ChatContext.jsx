/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket } from "../api/socket";
import { chatKeys } from "../hooks/chat/useChat";
import {
  ensureNotificationPermission,
  showSystemNotification,
} from "../utility/notifications";
import { initPushNotifications } from "../api/firebaseMessaging";

const ChatContext = createContext(null);

/**
 * Owns the realtime layer for chat: a single authenticated socket, online
 * presence, typing indicators, and live react-query cache updates. Mount once
 * inside the authenticated shell. Exposes imperative senders plus derived
 * state (online users, typing, connection status) to the chat UI.
 */
export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(() => new Set());
  const [typingByUser, setTypingByUser] = useState({}); // userId -> bool
  const socketRef = useRef(null);
  const typingTimers = useRef(new Map());

  const meId = user?.id;

  // Append a message to a cached thread (deduped). partnerId is the "other"
  // user relative to me.
  const appendToThread = useCallback(
    (partnerId, message) => {
      queryClient.setQueryData(chatKeys.thread(partnerId), (old) => {
        if (!old) return old; // not loaded yet — a fresh fetch will include it
        if (old.items?.some((m) => m.id === message.id)) return old;
        return { ...old, items: [...(old.items || []), message] };
      });
    },
    [queryClient]
  );

  // ── Socket lifecycle, tied to auth ──
  useEffect(() => {
    if (!isAuthenticated || !meId) return undefined;

    const socket = connectSocket();
    socketRef.current = socket;

    // Ask for system-notification permission and start FCM (if configured).
    ensureNotificationPermission();
    initPushNotifications();

    const onConnect = () => {
      setConnected(true);
      // Pull the current online roster. The server also pushes presence:list
      // once on connect, but requesting it here covers reconnects and the case
      // where we (re)subscribe after that one-time emit already fired.
      socket.emit("presence:get");
    };
    const onDisconnect = () => setConnected(false);

    const onPresenceList = ({ online }) => setOnlineUsers(new Set(online));
    const onPresenceUpdate = ({ userId, online }) =>
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });

    const appendToList = (key, message) =>
      queryClient.setQueryData(key, (old) => {
        if (!old) return old;
        if (old.items?.some((m) => m.id === message.id)) return old;
        return { ...old, items: [...(old.items || []), message] };
      });

    const onMessageNew = (message) => {
      if (message.type === "GROUP") {
        appendToList(chatKeys.groupThread(message.groupId), message);
        queryClient.invalidateQueries(chatKeys.groups);
        return;
      }
      const partnerId =
        message.senderId === meId ? message.recipientId : message.senderId;
      appendToThread(partnerId, message);
      queryClient.invalidateQueries(chatKeys.conversations);
      queryClient.invalidateQueries(chatKeys.unread);
    };

    // A member was added/removed, the group was renamed, or you were added to
    // a new group — refresh the group list (and that group's caches).
    const onGroupUpdated = ({ groupId }) => {
      queryClient.invalidateQueries(chatKeys.groups);
      if (groupId) {
        queryClient.invalidateQueries(chatKeys.groupMembers(groupId));
      }
    };

    const onBroadcastNew = (message) => {
      queryClient.setQueryData(chatKeys.broadcast, (old) => {
        if (!old) return old;
        if (old.items?.some((m) => m.id === message.id)) return old;
        return { ...old, items: [...(old.items || []), message] };
      });
    };

    // A message was edited or deleted-for-everyone — replace it in place.
    const onMessageUpdated = (message) => {
      const replace = (old) =>
        old
          ? { ...old, items: old.items.map((m) => (m.id === message.id ? message : m)) }
          : old;
      if (message.type === "GROUP") {
        queryClient.setQueryData(chatKeys.groupThread(message.groupId), replace);
        queryClient.invalidateQueries(chatKeys.groups);
        return;
      }
      if (message.type === "BROADCAST") {
        queryClient.setQueryData(chatKeys.broadcast, replace);
      } else {
        const partnerId =
          message.senderId === meId ? message.recipientId : message.senderId;
        queryClient.setQueryData(chatKeys.thread(partnerId), replace);
      }
      queryClient.invalidateQueries(chatKeys.conversations);
    };

    const onNotification = (notif) => {
      if (notif.fromUserId === meId) return; // don't notify myself
      toast(`${notif.title}: ${notif.body}`, { icon: "💬" });
      showSystemNotification(notif.title, {
        body: notif.body,
        tag: notif.kind === "broadcast" ? "broadcast" : notif.fromUserId,
        onClick: () => window.location.assign("/#/app/chat"),
      });
    };

    const onTyping = ({ from, isTyping }) => {
      setTypingByUser((prev) => ({ ...prev, [from]: isTyping }));
      // Auto-clear a stale "typing…" if no stop event arrives.
      const timers = typingTimers.current;
      if (timers.has(from)) clearTimeout(timers.get(from));
      if (isTyping) {
        timers.set(
          from,
          setTimeout(
            () => setTypingByUser((prev) => ({ ...prev, [from]: false })),
            4000
          )
        );
      }
    };

    const onReadByOther = () => {
      // Other party read my messages — refresh receipts where shown.
      queryClient.invalidateQueries({ queryKey: ["chat", "thread"] });
    };
    const onThreadRead = () => {
      queryClient.invalidateQueries(chatKeys.unread);
      queryClient.invalidateQueries(chatKeys.conversations);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("presence:list", onPresenceList);
    socket.on("presence:update", onPresenceUpdate);
    socket.on("message:new", onMessageNew);
    socket.on("broadcast:new", onBroadcastNew);
    socket.on("message:updated", onMessageUpdated);
    socket.on("group:updated", onGroupUpdated);
    socket.on("notification:new", onNotification);
    socket.on("typing", onTyping);
    socket.on("message:read", onReadByOther);
    socket.on("thread:read", onThreadRead);

    // If the socket was already connected when this effect (re)subscribed, the
    // "connect" event won't fire again — sync state right away so we don't miss
    // the one-time presence roster (otherwise everyone shows as offline).
    if (socket.connected) {
      setConnected(true);
      socket.emit("presence:get");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("presence:list", onPresenceList);
      socket.off("presence:update", onPresenceUpdate);
      socket.off("message:new", onMessageNew);
      socket.off("broadcast:new", onBroadcastNew);
      socket.off("message:updated", onMessageUpdated);
      socket.off("group:updated", onGroupUpdated);
      socket.off("notification:new", onNotification);
      socket.off("typing", onTyping);
      socket.off("message:read", onReadByOther);
      socket.off("thread:read", onThreadRead);
    };
  }, [isAuthenticated, meId, queryClient, appendToThread]);

  // Tear the socket down entirely when the user logs out.
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = null;
      setConnected(false);
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated]);

  // ── Imperative actions ──
  const sendDirect = useCallback(
    (recipientId, content, attachment, replyToId) =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket?.connected) return reject(new Error("Not connected"));
        socket.emit(
          "message:send",
          { recipientId, content, attachment, replyToId },
          (res) => {
            if (res?.ok) resolve(res.message);
            else reject(new Error(res?.error || "Failed to send"));
          }
        );
      }),
    []
  );

  const sendBroadcast = useCallback(
    (content, attachment, replyToId) =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket?.connected) return reject(new Error("Not connected"));
        socket.emit(
          "broadcast:send",
          { content, attachment, replyToId },
          (res) => {
            if (res?.ok) resolve(res.message);
            else reject(new Error(res?.error || "Failed to broadcast"));
          }
        );
      }),
    []
  );

  const sendGroup = useCallback(
    (groupId, content, attachment, replyToId) =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket?.connected) return reject(new Error("Not connected"));
        socket.emit(
          "group:send",
          { groupId, content, attachment, replyToId },
          (res) => {
            if (res?.ok) resolve(res.message);
            else reject(new Error(res?.error || "Failed to send"));
          }
        );
      }),
    []
  );

  const setTyping = useCallback((recipientId, isTyping) => {
    socketRef.current?.emit("typing", { recipientId, isTyping });
  }, []);

  const markRead = useCallback(
    (otherId) => {
      socketRef.current?.emit("message:read", { otherId });
      queryClient.invalidateQueries(chatKeys.unread);
      queryClient.invalidateQueries(chatKeys.conversations);
    },
    [queryClient]
  );

  const isOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers]
  );

  const value = useMemo(
    () => ({
      connected,
      onlineUsers,
      isOnline,
      typingByUser,
      sendDirect,
      sendBroadcast,
      sendGroup,
      setTyping,
      markRead,
    }),
    [
      connected,
      onlineUsers,
      isOnline,
      typingByUser,
      sendDirect,
      sendBroadcast,
      sendGroup,
      setTyping,
      markRead,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within a ChatProvider");
  return ctx;
};

export default ChatContext;
