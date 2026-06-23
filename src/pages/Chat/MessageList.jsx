/* eslint-disable react/prop-types */
import { useCallback, useLayoutEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";
import CallMessage from "./CallMessage";

// How close to the top (px) the user must scroll before we pull older messages.
const LOAD_OLDER_THRESHOLD = 80;

const TypingDots = () => (
  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", py: 0.5 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          animation: "chatTyping 1.2s infinite ease-in-out",
          animationDelay: `${i * 0.18}s`,
          "@keyframes chatTyping": {
            "0%, 80%, 100%": { opacity: 0.25, transform: "translateY(0)" },
            "40%": { opacity: 1, transform: "translateY(-3px)" },
          },
        }}
      />
    ))}
  </Box>
);

/**
 * Scrollable list of message bubbles that sticks to the bottom as new messages
 * arrive, with loading / empty states and an optional typing indicator.
 */
const MessageList = ({
  messages = [],
  meId,
  loading = false,
  showSender = false,
  typing = false,
  actions,
  emptyText = "No messages yet — say hello! 👋",
  hasMore = false,
  loadingOlder = false,
  onLoadOlder,
}) => {
  const containerRef = useRef(null);
  const endRef = useRef(null);
  // Bookkeeping to keep the viewport stable when older messages prepend.
  const prevFirstId = useRef(null);
  const anchorHeight = useRef(0);
  const awaitingOlder = useRef(false);

  // Runs before the browser paints, so we can adjust scroll without a flicker.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const firstId = messages[0]?.id ?? null;
    const prepended = awaitingOlder.current && firstId !== prevFirstId.current;

    if (prepended) {
      // Older messages were added above the viewport — offset scrollTop by the
      // newly inserted height so the message the user was reading stays put.
      el.scrollTop = el.scrollHeight - anchorHeight.current;
      awaitingOlder.current = false;
    } else {
      // New/initial messages at the bottom — stick to the latest.
      endRef.current?.scrollIntoView({ block: "end" });
    }
    prevFirstId.current = firstId;
  }, [messages, typing]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || !hasMore || loadingOlder || awaitingOlder.current) return;
    if (el.scrollTop <= LOAD_OLDER_THRESHOLD) {
      // Snapshot the current height so the layout effect can re-anchor once the
      // older page lands.
      anchorHeight.current = el.scrollHeight;
      awaitingOlder.current = true;
      onLoadOlder?.();
    }
  }, [hasMore, loadingOlder, onLoadOlder]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 1.5, sm: 3 },
        py: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loadingOlder && (
        <Box sx={{ display: "grid", placeItems: "center", py: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      {messages.length === 0 ? (
        <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
          <Typography color="text.secondary">{emptyText}</Typography>
        </Box>
      ) : (
        messages.map((m) =>
          m.type === "CALL" ? (
            <CallMessage key={m.id} message={m} mine={m.senderId === meId} />
          ) : (
            <MessageBubble
              key={m.id}
              message={m}
              mine={m.senderId === meId}
              showSender={showSender}
              actions={actions}
            />
          )
        )
      )}
      {typing && (
        <Box sx={{ pl: 1.5 }}>
          <TypingDots />
        </Box>
      )}
      <div ref={endRef} />
    </Box>
  );
};

export default MessageList;
