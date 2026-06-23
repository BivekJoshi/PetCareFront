import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  fetchContacts,
  fetchConversations,
  fetchThread,
  fetchBroadcast,
  fetchUnreadCount,
  fetchCallHistory,
  fetchGroups,
  fetchGroupMessages,
  fetchGroupMembers,
} from "../../api/chat/chat-api";

// How many messages we pull per request. We load the newest page first, then
// fetch older pages on demand as the user scrolls up — this keeps the initial
// payload (and server cost) small instead of loading an entire history.
export const CHAT_PAGE_SIZE = 50;

// Centralised react-query keys so the ChatContext can update/invalidate caches
// when realtime socket events arrive.
export const chatKeys = {
  contacts: (search) => ["chat", "contacts", search || ""],
  conversations: ["chat", "conversations"],
  thread: (userId) => ["chat", "thread", userId],
  broadcast: ["chat", "broadcast"],
  unread: ["chat", "unread"],
  calls: ["chat", "calls"],
  groups: ["chat", "groups"],
  groupThread: (groupId) => ["chat", "group-thread", groupId],
  groupMembers: (groupId) => ["chat", "group-members", groupId],
};

export const useContacts = (search) =>
  useQuery(chatKeys.contacts(search), () => fetchContacts(search), {
    keepPreviousData: true,
  });

export const useConversations = () =>
  useQuery(chatKeys.conversations, fetchConversations);

/**
 * Shared logic for the two paginated message lists (direct thread + broadcast).
 *
 * The cache holds the accumulated, chronological list of messages under a
 * single key as `{ items, meta, page }` so the realtime socket handlers in
 * ChatContext can keep appending/replacing on `old.items` unchanged. Page 1 is
 * the newest `CHAT_PAGE_SIZE` messages; `fetchOlder()` pulls the next older
 * page and prepends it (deduped).
 */
const usePaginatedMessages = (queryKey, fetchPage, { enabled = true } = {}) => {
  const queryClient = useQueryClient();
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);

  const query = useQuery(
    queryKey,
    async () => {
      const res = await fetchPage({ page: 1, limit: CHAT_PAGE_SIZE });
      return { items: res.items, meta: res.meta, page: 1 };
    },
    { enabled, refetchOnWindowFocus: false }
  );

  const page = query.data?.page ?? 1;
  const meta = query.data?.meta;
  const hasMore = meta ? page < meta.totalPages : false;

  // Fetch the next older page and prepend it to the cached list. Returns the
  // number of older messages added (0 when there's nothing more to load) so the
  // scroll container can decide whether to keep its viewport anchored.
  const fetchOlder = useCallback(async () => {
    if (!enabled || isFetchingOlder || !hasMore) return 0;
    setIsFetchingOlder(true);
    try {
      const nextPage = page + 1;
      const res = await fetchPage({ page: nextPage, limit: CHAT_PAGE_SIZE });
      let added = 0;
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        const seen = new Set(old.items.map((m) => m.id));
        const older = res.items.filter((m) => !seen.has(m.id));
        added = older.length;
        return {
          items: [...older, ...old.items],
          meta: res.meta,
          page: nextPage,
        };
      });
      return added;
    } finally {
      setIsFetchingOlder(false);
    }
    // queryKey is a stable array literal per caller; spread for referential safety.
  }, [enabled, isFetchingOlder, hasMore, page, fetchPage, queryClient, queryKey]);

  return { ...query, hasMore, fetchOlder, isFetchingOlder };
};

export const useThread = (userId) =>
  usePaginatedMessages(
    chatKeys.thread(userId),
    (params) => fetchThread(userId, params),
    { enabled: Boolean(userId) }
  );

export const useBroadcast = () =>
  usePaginatedMessages(chatKeys.broadcast, fetchBroadcast);

export const useUnreadCount = () =>
  useQuery(chatKeys.unread, fetchUnreadCount, {
    select: (data) => data?.count ?? 0,
  });

// ── Calls + groups ──

export const useCallHistory = () =>
  useQuery(chatKeys.calls, fetchCallHistory);

export const useGroups = () => useQuery(chatKeys.groups, fetchGroups);

export const useGroupThread = (groupId) =>
  usePaginatedMessages(
    chatKeys.groupThread(groupId),
    (params) => fetchGroupMessages(groupId, params),
    { enabled: Boolean(groupId) }
  );

export const useGroupMembers = (groupId) =>
  useQuery(chatKeys.groupMembers(groupId), () => fetchGroupMembers(groupId), {
    enabled: Boolean(groupId),
  });
