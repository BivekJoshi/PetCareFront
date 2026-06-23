/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CallMissedRoundedIcon from "@mui/icons-material/CallMissedRounded";
import MissedVideoCallRoundedIcon from "@mui/icons-material/MissedVideoCallRounded";
import { describeCall } from "../../utility/call";

const timeOf = (value) =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * A call-log entry rendered inline in a direct thread (WhatsApp-style):
 * a centered pill with a call icon, an outcome label, and the time.
 */
const CallMessage = ({ message, mine }) => {
  const { isVideo, missed, text } = describeCall(message, mine);

  const Icon = missed
    ? isVideo
      ? MissedVideoCallRoundedIcon
      : CallMissedRoundedIcon
    : isVideo
    ? VideocamRoundedIcon
    : CallRoundedIcon;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 5,
          maxWidth: "85%",
          bgcolor: (t) =>
            missed
              ? alpha(t.palette.error.main, 0.1)
              : alpha(t.palette.text.primary, 0.06),
          color: missed ? "error.main" : "text.secondary",
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {text}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, fontSize: 10.5 }}>
          {timeOf(message.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CallMessage;
