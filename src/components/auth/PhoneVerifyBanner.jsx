import { useState } from "react";
import { useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getAuthConfig,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "../../api/auth/auth-api";
import PhoneOtpForm from "./PhoneOtpForm";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Persistent reminder shown to logged-in users whose phone isn't verified yet.
 * Opening it sends a fresh WhatsApp OTP and lets them verify inline. Already
 * authenticated, so the axios interceptor supplies the token automatically.
 */
const PhoneVerifyBanner = () => {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Whether OTP verification is enabled globally (super-admin switch).
  const { data: config } = useQuery(["auth-config"], getAuthConfig, {
    staleTime: 5 * 60 * 1000,
  });

  // Don't nag when: already verified, no number on file, or OTP is turned off
  // globally by the super admin.
  if (!user || user.phoneVerified || !user.phone || config?.otpEnabled === false) {
    return null;
  }

  const announce = (otp) => {
    if (otp?.devCode) toast(`Dev code: ${otp.devCode}`, { icon: "🔑", duration: 9000 });
    else toast.success("Code sent to your WhatsApp");
  };

  const start = async () => {
    setOpen(true);
    setSending(true);
    try {
      announce(await sendPhoneOtp());
    } catch (error) {
      toast.error(errorMessage(error, "Could not send the code"));
    } finally {
      setSending(false);
    }
  };

  const verify = async (code) => {
    setVerifying(true);
    try {
      await verifyPhoneOtp({ code });
      updateUser({ phoneVerified: true });
      toast.success("Phone number verified ✅");
      setOpen(false);
    } catch (error) {
      toast.error(errorMessage(error, "Verification failed"));
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      announce(await sendPhoneOtp());
    } catch (error) {
      toast.error(errorMessage(error, "Could not resend the code"));
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Alert
        severity="warning"
        icon={<ErrorOutlineRoundedIcon />}
        action={
          <Button color="inherit" size="small" onClick={start} disabled={sending}>
            Verify now
          </Button>
        }
        sx={{ borderRadius: 0, alignItems: "center" }}
      >
        Your WhatsApp number isn&apos;t verified.
        <Chip
          label="Unverified"
          size="small"
          color="warning"
          variant="outlined"
          sx={{ ml: 1, height: 20, fontWeight: 700 }}
        />
      </Alert>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Verify your number</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <PhoneOtpForm
              phone={user.phone}
              onVerify={verify}
              onResend={resend}
              verifying={verifying}
              resending={resending || sending}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneVerifyBanner;
