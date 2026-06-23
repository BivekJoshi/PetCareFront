/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const RESEND_COOLDOWN = 30; // seconds — mirrors the server-side cooldown

// Per-channel copy + icon.
const CHANNELS = {
  email: {
    icon: <MarkEmailReadOutlinedIcon color="primary" />,
    title: "Verify your email",
    where: "email",
  },
  phone: {
    icon: <WhatsAppIcon sx={{ color: "#25D366" }} />,
    title: "Verify your WhatsApp number",
    where: "WhatsApp",
  },
};

/**
 * Generic OTP entry for any channel (email / phone): a 6-digit code field,
 * verify button, resend with a cooldown countdown, and an optional skip.
 * Presentational — the parent supplies the async handlers and busy flags.
 */
const OtpForm = ({
  channel = "email",
  destination,
  onVerify,
  onResend,
  onSkip,
  verifying = false,
  resending = false,
  skipLabel = "Verify later",
}) => {
  const cfg = CHANNELS[channel] || CHANNELS.email;
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef(null);

  // Reset the field + cooldown whenever the channel changes (multi-step flow).
  useEffect(() => {
    setCode("");
    setCooldown(RESEND_COOLDOWN);
  }, [channel, destination]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const submit = () => {
    if (code.length === 6 && !verifying) onVerify(code);
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    await onResend();
    setCooldown(RESEND_COOLDOWN);
  };

  return (
    <Stack spacing={2.5}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {cfg.icon}
        <Typography sx={{ fontWeight: 700 }}>{cfg.title}</Typography>
      </Box>

      <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
        We sent a 6-digit code to your {cfg.where}
        {destination ? (
          <>
            {" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {destination}
            </Box>
          </>
        ) : null}
        . Enter it below to verify.
      </Typography>

      <TextField
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="••••••"
        inputProps={{
          inputMode: "numeric",
          maxLength: 6,
          style: {
            textAlign: "center",
            letterSpacing: "0.6em",
            fontSize: "1.4rem",
            fontWeight: 700,
          },
        }}
        fullWidth
      />

      <LoadingButton
        loading={verifying}
        disabled={code.length !== 6}
        variant="contained"
        size="large"
        onClick={submit}
        fullWidth
        sx={{ py: 1.2 }}
      >
        Verify
      </LoadingButton>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
          Didn&apos;t get it?{" "}
          {cooldown > 0 ? (
            <Box component="span" sx={{ color: "text.disabled" }}>
              Resend in {cooldown}s
            </Box>
          ) : (
            <Link
              component="button"
              type="button"
              onClick={resend}
              disabled={resending}
              underline="hover"
              sx={{ fontWeight: 700 }}
            >
              {resending ? "Resending…" : "Resend code"}
            </Link>
          )}
        </Typography>

        {onSkip && (
          <Link
            component="button"
            type="button"
            onClick={onSkip}
            underline="hover"
            sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.85rem" }}
          >
            {skipLabel}
          </Link>
        )}
      </Box>
    </Stack>
  );
};

export default OtpForm;
