/* eslint-disable react/prop-types */
import { Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import CallMadeRoundedIcon from "@mui/icons-material/CallMadeRounded";
import CallReceivedRoundedIcon from "@mui/icons-material/CallReceivedRounded";
import CallMissedRoundedIcon from "@mui/icons-material/CallMissedRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { useCallHistory } from "../../hooks/chat/useChat";
import { useCallContext } from "../../context/CallContext";
import { displayName, formatDateTime } from "../../utility/format";
import { formatDuration } from "../../utility/webrtc";
import UserAvatar from "./UserAvatar";

// Map a call record to its display: icon, label, and whether it's a "miss".
const describe = (call) => {
  const missed =
    call.status === "DECLINED" ||
    call.status === "MISSED" ||
    (call.status === "CANCELLED" && call.direction === "incoming");

  if (missed) {
    const label =
      call.status === "DECLINED"
        ? call.direction === "outgoing"
          ? "Declined"
          : "You declined"
        : "Missed";
    return { Icon: CallMissedRoundedIcon, color: "error.main", label };
  }
  if (call.status === "CANCELLED") {
    return { Icon: CallMadeRoundedIcon, color: "text.secondary", label: "Cancelled" };
  }
  const Icon = call.direction === "outgoing" ? CallMadeRoundedIcon : CallReceivedRoundedIcon;
  const label =
    call.status === "COMPLETED"
      ? formatDuration(call.durationSec)
      : call.direction === "outgoing"
      ? "Outgoing"
      : "Incoming";
  return { Icon, color: "success.main", label };
};

/** Phone-style call log: direction, status (missed/declined), duration, time. */
const CallsPanel = ({ onBack }) => {
  const { data, isLoading } = useCallHistory();
  const { startCall, inCall } = useCallContext();
  const calls = data || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {onBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <CallReceivedRoundedIcon />
          </IconButton>
        )}
        <Typography sx={{ fontWeight: 800 }}>Call history</Typography>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {calls.length} call{calls.length === 1 ? "" : "s"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {isLoading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
            <CircularProgress size={24} />
          </Box>
        ) : calls.length === 0 ? (
          <Box sx={{ textAlign: "center", px: 3, py: 6 }}>
            <Typography color="text.secondary">No calls yet.</Typography>
          </Box>
        ) : (
          calls.map((call) => {
            const { Icon, color, label } = describe(call);
            const isVideo = call.type === "VIDEO";
            return (
              <Box
                key={call.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <UserAvatar user={call.user} size={44} showPresence={false} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {displayName(call.user)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Icon sx={{ fontSize: 15, color }} />
                    <Typography variant="caption" sx={{ color }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      · {formatDateTime(call.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title={isVideo ? "Video call back" : "Call back"}>
                  <span>
                    <IconButton
                      color="primary"
                      disabled={inCall}
                      onClick={() => startCall(call.user, isVideo ? "video" : "audio")}
                    >
                      {isVideo ? <VideocamRoundedIcon /> : <CallRoundedIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default CallsPanel;
