import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { useCallContext } from "../../../context/CallContext";
import { fullName } from "../../../utility/format";
import UserAvatar from "../UserAvatar";

const ring = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(69, 187, 189, 0.55); }
  70% { box-shadow: 0 0 0 22px rgba(69, 187, 189, 0); }
  100% { box-shadow: 0 0 0 0 rgba(69, 187, 189, 0); }
`;

const RoundBtn = ({ color, onClick, children, label }) => (
  <Box sx={{ textAlign: "center" }}>
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        width: 62,
        height: 62,
        color: "#fff",
        bgcolor: color,
        "&:hover": { bgcolor: color, filter: "brightness(0.92)" },
      }}
    >
      {children}
    </IconButton>
    <Typography variant="caption" sx={{ display: "block", mt: 0.75 }}>
      {label}
    </Typography>
  </Box>
);

/** Full-bleed prompt shown to the callee while a call is ringing. */
const IncomingCallDialog = () => {
  const { call, acceptCall, rejectCall } = useCallContext();
  const open = call?.status === "incoming";
  const isVideo = call?.type === "video";

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      slotProps={{ paper: { sx: { borderRadius: 4, width: 340, maxWidth: "90vw" } } }}
    >
      {open && (
        <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              borderRadius: "50%",
              animation: `${ring} 1.6s infinite`,
              mb: 2,
            }}
          >
            <UserAvatar user={call.peer} size={92} showPresence={false} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {fullName(call.peer)}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            {isVideo ? (
              <VideocamRoundedIcon fontSize="small" />
            ) : (
              <CallRoundedIcon fontSize="small" />
            )}
            <Typography variant="body2">
              Incoming {isVideo ? "video" : "voice"} call…
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              mt: 4,
            }}
          >
            <RoundBtn color="error.main" onClick={rejectCall} label="Decline">
              <CallEndRoundedIcon />
            </RoundBtn>
            <RoundBtn color="success.main" onClick={acceptCall} label="Accept">
              {isVideo ? <VideocamRoundedIcon /> : <CallRoundedIcon />}
            </RoundBtn>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default IncomingCallDialog;
