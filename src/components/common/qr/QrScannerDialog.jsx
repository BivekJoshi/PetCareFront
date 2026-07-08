import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { BrowserQRCodeReader } from "@zxing/browser";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";

// Turn a getUserMedia / zxing failure into a friendly, actionable message.
const friendlyError = (err) => {
  const name = err?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Camera permission was denied. Allow camera access, or enter the code manually.";
  if (name === "NotFoundError" || name === "OverconstrainedError")
    return "No camera was found on this device. Enter the code manually.";
  if (name === "NotReadableError")
    return "The camera is already in use by another app. Close it and try again.";
  return err?.message || "Couldn’t start the camera. Enter the code manually.";
};

// One L-shaped corner bracket for the scan window.
const Corner = ({ pos, color }) => {
  const base = {
    position: "absolute",
    width: 26,
    height: 26,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
  };
  const map = {
    tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
    tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
    bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
    br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  };
  return <Box sx={{ ...base, ...map[pos] }} />;
};

/**
 * QrScannerDialog — a classy, camera-based QR scanner.
 *
 * Uses @zxing/browser to read continuously from the (rear, on mobile) camera
 * and calls `onResult(text)` once with the decoded string. A dark scrim with an
 * animated scan window sits over the live video; camera errors degrade
 * gracefully to a manual-entry field.
 */
const QrScannerDialog = ({
  open,
  onClose,
  onResult,
  title = "Scan QR code",
  hint = "Point the camera at the owner’s PetCare QR code.",
}) => {
  const theme = useTheme();
  const p = theme.palette.primary;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const handledRef = useRef(false);

  const [status, setStatus] = useState("starting"); // 'starting' | 'scanning' | 'error'
  const [error, setError] = useState(null);
  const [manual, setManual] = useState("");

  const stop = () => {
    try {
      controlsRef.current?.stop();
    } catch {
      /* already stopped */
    }
    controlsRef.current = null;
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const emit = (text) => {
    if (handledRef.current) return;
    handledRef.current = true;
    stop();
    onResult?.(text);
  };

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    handledRef.current = false;
    setError(null);
    setManual("");
    setStatus("starting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Camera access needs a secure (https) connection. Enter the code manually below.",
      );
      setStatus("error");
      return undefined;
    }

    const reader = new BrowserQRCodeReader();
    const onDecode = (result) => {
      if (result) emit(result.getText());
    };

    const start = async () => {
      // Prefer the rear camera (phones), but fall back to any camera so a
      // desktop/laptop front webcam works too. `facingMode: environment` is a
      // preference, not a hard requirement, so this order is safe everywhere.
      const attempts = [{ video: { facingMode: "environment" } }, { video: true }];
      let lastErr;
      for (const constraints of attempts) {
        if (cancelled) return;
        try {
          const controls = await reader.decodeFromConstraints(
            constraints,
            videoRef.current,
            onDecode,
          );
          if (cancelled) {
            controls.stop();
            return;
          }
          controlsRef.current = controls;
          setStatus("scanning");
          return;
        } catch (err) {
          lastErr = err;
          // A denied permission won't be fixed by trying another camera.
          if (err?.name === "NotAllowedError" || err?.name === "SecurityError") break;
        }
      }
      if (!cancelled) {
        setError(friendlyError(lastErr));
        setStatus("error");
      }
    };

    // Defer the start a tick. In React StrictMode (dev) the effect mounts,
    // tears down, then mounts again synchronously; deferring lets the first
    // teardown cancel before any camera opens, so getUserMedia runs exactly
    // once (two rapid opens on one <video> is what leaves it black).
    const startTimer = setTimeout(start, 120);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submitManual = (e) => {
    e?.preventDefault();
    const trimmed = manual.trim();
    if (trimmed) emit(trimmed);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 5, overflow: "hidden" } }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 1.75, bgcolor: alpha(p.main, 0.08) }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <QrCodeScannerRoundedIcon color="primary" />
          <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {/* Camera viewport */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: "#02060f",
          overflow: "hidden",
        }}
      >
        {/* Plain <video> (not Box) so the ref is unambiguously the DOM node. */}
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Scan window + scrim (only while the camera is live) */}
        {status === "scanning" && (
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <Box
              sx={{
                position: "relative",
                width: "68%",
                aspectRatio: "1 / 1",
                borderRadius: 3,
                boxShadow: `0 0 0 9999px ${alpha("#02060f", 0.55)}`,
              }}
            >
              <Corner pos="tl" color={p.main} />
              <Corner pos="tr" color={p.main} />
              <Corner pos="bl" color={p.main} />
              <Corner pos="br" color={p.main} />
              {/* animated laser sweep */}
              <Box
                component={motion.div}
                initial={{ top: "8%" }}
                animate={{ top: ["8%", "92%", "8%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                  position: "absolute",
                  left: "6%",
                  right: "6%",
                  height: 2,
                  borderRadius: 2,
                  bgcolor: p.main,
                  boxShadow: `0 0 12px 2px ${alpha(p.main, 0.9)}`,
                }}
              />
            </Box>
          </Box>
        )}

        {/* Starting spinner */}
        {status === "starting" && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ position: "absolute", inset: 0, color: alpha("#fff", 0.85) }}
          >
            <CircularProgress color="inherit" size={30} />
            <Typography variant="body2">Starting camera…</Typography>
          </Stack>
        )}
      </Box>

      {/* Footer: hint OR error + manual entry */}
      <Box sx={{ p: 2.5 }}>
        {status === "error" ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {hint}
          </Typography>
        )}

        <Box component="form" onSubmit={submitManual}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Or type the code"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyboardRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" disabled={!manual.trim()}>
              Use
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default QrScannerDialog;
