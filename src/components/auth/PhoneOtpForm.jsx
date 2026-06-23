/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const RESEND_COOLDOWN = 30; // seconds — mirrors the server-side cooldown

/**
 * Phone OTP entry: a 6-digit code field, verify button, resend (with a cooldown
 * countdown), and an optional "verify later" skip. Presentational — the parent
 * supplies the async handlers and busy flags.
 */
const PhoneOtpForm = ({
  phone,
  onVerify,
  onResend,
  onSkip,
  verifying = false,
  resending = false,
  skipLabel = "Verify later",
}) => {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef(null);

  // Count the resend cooldown down to zero.
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
        <WhatsAppIcon sx={{ color: "#25D366" }} />
        <Typography sx={{ fontWeight: 700 }}>Verify your WhatsApp number</Typography>
      </Box>

      <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
        We sent a 6-digit code to{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
          {phone || "your number"}
        </Box>
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

export default PhoneOtpForm;
