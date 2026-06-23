/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import toast from "react-hot-toast";
import OtpForm from "./OtpForm";
import { setPhoneRequest, otpApi } from "../../api/auth/auth-api";

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
 * Shown right after Google sign-in when the new account has no phone number.
 * Step 1 collects the number; if the server then sends a WhatsApp OTP (only when
 * phone verification is enabled), step 2 verifies it. The user can skip at any
 * point — `onDone(user)` finalizes the session either way.
 *
 * `token` is the just-issued access token (the session isn't persisted yet, so
 * the API calls carry it explicitly).
 */
const PostOAuthPhoneDialog = ({ open, token, onDone }) => {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [destination, setDestination] = useState("");
  const [savedUser, setSavedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

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
        // Verification disabled — the number is saved, we're done.
        onDone(user);
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
      onDone(user || savedUser);
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

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {step === "phone" ? "Add your WhatsApp number" : "Verify your WhatsApp number"}
      </DialogTitle>
      <DialogContent>
        {step === "phone" ? (
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
              onClick={() => onDone(savedUser)}
              sx={{ color: "text.secondary" }}
            >
              Skip for now
            </Button>
          </Stack>
        ) : (
          <Box sx={{ pt: 1 }}>
            <OtpForm
              channel="phone"
              destination={destination}
              onVerify={verify}
              onResend={resend}
              onSkip={() => onDone(savedUser)}
              verifying={verifying}
              resending={resending}
              skipLabel="Verify later"
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostOAuthPhoneDialog;
