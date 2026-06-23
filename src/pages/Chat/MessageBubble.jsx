/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { fullName } from "../../utility/format";

const timeOf = (value) =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * A single chat bubble. `mine` flips alignment/colour; `showSender` labels the
 * author (used in the broadcast channel where many people post).
 */
const MessageBubble = ({ message, mine, showSender = false }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: mine ? "flex-end" : "flex-start",
      mb: 1,
    }}
  >
    {showSender && !mine && (
      <Typography
        variant="caption"
        sx={{ ml: 1.5, mb: 0.25, fontWeight: 700, color: "primary.main" }}
      >
        {fullName(message.sender)}
      </Typography>
    )}
    <Box
      sx={{
        maxWidth: { xs: "82%", sm: "70%" },
        px: 1.75,
        py: 1.1,
        borderRadius: 2.5,
        borderTopRightRadius: mine ? 4 : 20,
        borderTopLeftRadius: mine ? 20 : 4,
        bgcolor: mine ? "primary.main" : "background.paper",
        color: mine ? "#fff" : "text.primary",
        border: mine ? "none" : 1,
        borderColor: "divider",
        boxShadow: mine
          ? "0 6px 16px -8px rgba(8, 80, 80, 0.5)"
          : "0 2px 8px -6px rgba(16,24,40,0.3)",
      }}
    >
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.45 }}
      >
        {message.content}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.4,
        mt: 0.3,
        px: 0.75,
      }}
    >
      <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
        {timeOf(message.createdAt)}
      </Typography>
      {mine &&
        (message.readAt ? (
          <DoneAllRoundedIcon sx={{ fontSize: 14, color: "info.main" }} />
        ) : (
          <DoneRoundedIcon sx={{ fontSize: 14, color: "text.disabled" }} />
        ))}
    </Box>
  </Box>
);

export default MessageBubble;
