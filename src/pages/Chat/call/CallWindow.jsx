import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import { useCallContext } from "../../../context/CallContext";
import { fullName } from "../../../utility/format";
import { formatDuration } from "../../../utility/webrtc";
import UserAvatar from "../UserAvatar";

const ControlButton = ({ onClick, active, danger, label, children }) => (
  <Tooltip title={label}>
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        width: 56,
        height: 56,
        color: "#fff",
        bgcolor: danger
          ? "error.main"
          : active
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.16)",
        ...(active && !danger ? { color: "#111" } : {}),
        "&:hover": {
          bgcolor: danger ? "error.dark" : "rgba(255,255,255,0.28)",
        },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

/** Full-screen in-call surface: remote video/avatar, local PiP, and controls. */
const CallWindow = () => {
  const {
    call,
    localStream,
    remoteStream,
    muted,
    cameraOff,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCallContext();

  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const localVideoRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const visible = ["outgoing", "connecting", "active"].includes(call?.status);
  const isVideo = call?.type === "video";

  // Bind media streams to the elements.
  useEffect(() => {
    if (isVideo && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream || null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream || null;
    }
  }, [remoteStream, isVideo, visible]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream || null;
  }, [localStream, visible]);

  // Live duration counter once the call is active.
  useEffect(() => {
    if (call?.status !== "active" || !call?.startedAt) {
      setSeconds(0);
      return undefined;
    }
    const tick = () =>
      setSeconds(Math.floor((Date.now() - call.startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [call?.status, call?.startedAt]);

  if (!visible) return null;

  const statusText =
    call.status === "outgoing"
      ? "Ringing…"
      : call.status === "connecting"
      ? "Connecting…"
      : formatDuration(seconds);

  const showRemoteVideo = isVideo && remoteStream;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (t) => t.zIndex.modal + 10,
        bgcolor: "#0b1220",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Remote audio is always present so voice plays even without video. */}
      <audio ref={remoteAudioRef} autoPlay />

      {/* Stage */}
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {showRemoteVideo ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background:
                "radial-gradient(circle at 50% 35%, #18324a 0%, #0b1220 70%)",
            }}
          >
            <UserAvatar user={call.peer} size={120} showPresence={false} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {fullName(call.peer)}
            </Typography>
            <Typography sx={{ opacity: 0.7 }}>{statusText}</Typography>
          </Box>
        )}

        {/* Header overlay (name + status) for the video case */}
        {showRemoteVideo && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              p: 2.5,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {fullName(call.peer)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {statusText}
            </Typography>
          </Box>
        )}

        {/* Local picture-in-picture */}
        {isVideo && (
          <Box
            sx={{
              position: "absolute",
              right: 16,
              bottom: 16,
              width: { xs: 110, sm: 180 },
              aspectRatio: "3 / 4",
              borderRadius: 2,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.25)",
              bgcolor: "#000",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            {cameraOff ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <VideocamOffRoundedIcon sx={{ opacity: 0.6 }} />
              </Box>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2.5,
          py: 3,
          background: "rgba(0,0,0,0.35)",
        }}
      >
        <ControlButton
          onClick={toggleMute}
          active={muted}
          label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
        </ControlButton>

        {isVideo && (
          <ControlButton
            onClick={toggleCamera}
            active={cameraOff}
            label={cameraOff ? "Turn camera on" : "Turn camera off"}
          >
            {cameraOff ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
          </ControlButton>
        )}

        <ControlButton onClick={endCall} danger label="End call">
          <CallEndRoundedIcon />
        </ControlButton>
      </Box>
    </Box>
  );
};

export default CallWindow;
