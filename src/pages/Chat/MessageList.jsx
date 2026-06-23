/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";

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
  emptyText = "No messages yet — say hello! 👋",
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, typing]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 1.5, sm: 3 },
        py: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length === 0 ? (
        <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
          <Typography color="text.secondary">{emptyText}</Typography>
        </Box>
      ) : (
        messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            mine={m.senderId === meId}
            showSender={showSender}
          />
        ))
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
