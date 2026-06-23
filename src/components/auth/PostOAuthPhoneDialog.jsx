/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import OtpForm from "./OtpForm";
import { setPhoneRequest, setPasswordRequest, otpApi } from "../../api/auth/auth-api";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Mirrors the signup phone rule (international, optional leading +, 8–15 digits).
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

const announce = (res) => {
  if (res?.devCode) {
    toast(`Dev code (WhatsApp): ${res.devCode}`, { icon: "🔑", duration: 9000 });
  } else if (res?.sent) {
    toast.success("We sent a code to your WhatsApp");
  }
};

/**
 * Post Google sign-in onboarding for a brand-new account. Three steps, each
 * skippable:
 *   1. "phone"    — collect a WhatsApp number (used for reminders).
 *   2. "otp"      — verify it, only when phone verification is enabled.
 *   3. "password" — OPTIONAL. Offer to set a password so the user can also sign
 *                   in with email + password later. Clearly not required — they
 *                   can always keep using Google.
 * `onDone(user)` finalizes the session once the flow resolves.
 *
 * `token` is the just-issued access token (the session isn't persisted yet, so
 * the API calls carry it explicitly).
 */
const PostOAuthPhoneDialog = ({ open, token, onDone }) => {
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "password"
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [destination, setDestination] = useState("");
  const [savedUser, setSavedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Optional password step.
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // Move on to the optional password step, remembering the latest user record.
  const goToPassword = (user) => {
    if (user) setSavedUser(user);
    setStep("password");
  };

  const submitPhone = async () => {
    const value = phone.trim();
    if (!PHONE_RE.test(value)) {
      setError("Enter a valid phone number with country code (e.g. +9779812345678)");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const { user, verification } = await setPhoneRequest({ phone: value, token });
      setSavedUser(user);
      const phoneStep = verification?.phone;
      if (phoneStep?.sent) {
        announce(phoneStep);
        setDestination(value);
        setStep("otp");
      } else {
        // Verification disabled — number saved, move to the optional password.
        goToPassword(user);
      }
    } catch (err) {
      toast.error(errorMessage(err, "Could not save your phone number"));
    } finally {
      setSaving(false);
    }
  };

  const verify = async (code) => {
    setVerifying(true);
    try {
      const { user } = await otpApi.phone.verify({ code, token });
      toast.success("WhatsApp number verified ✅");
      goToPassword(user || savedUser);
    } catch (err) {
      toast.error(errorMessage(err, "Verification failed"));
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      announce(await otpApi.phone.send(token));
    } catch (err) {
      toast.error(errorMessage(err, "Could not resend the code"));
    } finally {
      setResending(false);
    }
  };

  const savePassword = async () => {
    const value = password;
    if (value.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    if (value !== confirm) {
      setPwError("Passwords do not match");
      return;
    }
    setPwError("");
    setSavingPw(true);
    try {
      const { user } = await setPasswordRequest({
        password: value,
        confirmPassword: confirm,
        token,
      });
      toast.success("Password set ✅ You can now sign in with email & password too");
      onDone(user || savedUser);
    } catch (err) {
      toast.error(errorMessage(err, "Could not set your password"));
    } finally {
      setSavingPw(false);
    }
  };

  const title =
    step === "phone"
      ? "Add your WhatsApp number"
      : step === "otp"
        ? "Verify your WhatsApp number"
        : "Set a password (optional)";

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        {step === "phone" && (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
              We use it for pet-care reminders and to reach you about appointments.
            </Typography>
            <TextField
              autoFocus
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitPhone()}
              error={Boolean(error)}
              helperText={error || "Include country code"}
              placeholder="+9779812345678"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PhoneIphoneIcon fontSize="small" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              loading={saving}
              variant="contained"
              size="large"
              onClick={submitPhone}
              fullWidth
              sx={{ py: 1.2 }}
            >
              Save and continue
            </LoadingButton>
            <Button
              variant="text"
              color="inherit"
              onClick={() => goToPassword(savedUser)}
              sx={{ color: "text.secondary" }}
            >
              Skip for now
            </Button>
          </Stack>
        )}

        {step === "otp" && (
          <Box sx={{ pt: 1 }}>
            <OtpForm
              channel="phone"
              destination={destination}
              onVerify={verify}
              onResend={resend}
              onSkip={() => goToPassword(savedUser)}
              verifying={verifying}
              resending={resending}
              skipLabel="Verify later"
            />
          </Box>
        )}

        {step === "password" && (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
              You don&apos;t need a password — you can always sign in with Google.
              Set one only if you&apos;d also like to sign in with your email and
              password.
            </Typography>
            <TextField
              autoFocus
              name="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(pwError)}
              placeholder="Create a password"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {showPw ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="confirmPassword"
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && savePassword()}
              error={Boolean(pwError)}
              helperText={pwError || "Re-enter your password"}
              placeholder="Confirm password"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlinedIcon fontSize="small" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              loading={savingPw}
              variant="contained"
              size="large"
              onClick={savePassword}
              fullWidth
              sx={{ py: 1.2 }}
            >
              Save password
            </LoadingButton>
            <Button
              variant="text"
              color="inherit"
              onClick={() => onDone(savedUser)}
              sx={{ color: "text.secondary" }}
            >
              Skip — I&apos;ll use Google
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostOAuthPhoneDialog;
