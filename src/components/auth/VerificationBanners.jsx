/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getAuthConfig, otpApi } from "../../api/auth/auth-api";
import OtpForm from "./OtpForm";

// How long a dismissed banner stays hidden before it reappears on its own.
// Dismissal is in-memory only, so a page refresh also brings it straight back.
const REAPPEAR_MS = 5 * 60 * 1000; // 5 minutes

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const META = {
  email: { field: "emailVerified", label: "email address", noun: "email" },
  phone: { field: "phoneVerified", label: "WhatsApp number", noun: "WhatsApp" },
};

const announce = (channel, res) => {
  if (res?.devCode) {
    toast(`Dev code (${META[channel].noun}): ${res.devCode}`, {
      icon: "🔑",
      duration: 9000,
    });
  } else {
    toast.success(`Code sent to your ${META[channel].noun}`);
  }
};

// One reminder banner + verify dialog for a single channel. Already
// authenticated here, so the axios interceptor supplies the token.
const ChannelBanner = ({ channel, destination, onVerified }) => {
  const api = otpApi[channel];
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Bring the banner back automatically a while after it was dismissed.
  useEffect(() => {
    if (!dismissed) return undefined;
    const timer = setTimeout(() => setDismissed(false), REAPPEAR_MS);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const start = async () => {
    setOpen(true);
    setSending(true);
    try {
      announce(channel, await api.send());
    } catch (error) {
      toast.error(errorMessage(error, "Could not send the code"));
    } finally {
      setSending(false);
    }
  };

  const verify = async (code) => {
    setVerifying(true);
    try {
      await api.verify({ code });
      onVerified();
      toast.success(`${META[channel].noun} verified ✅`);
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
      announce(channel, await api.send());
    } catch (error) {
      toast.error(errorMessage(error, "Could not resend the code"));
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {!dismissed && (
        <Alert
          severity="warning"
          icon={<ErrorOutlineRoundedIcon />}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Button color="inherit" size="small" onClick={start} disabled={sending}>
                Verify now
              </Button>
              <IconButton
                color="inherit"
                size="small"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{ borderRadius: 0, alignItems: "center" }}
        >
          Your {META[channel].label} isn&apos;t verified.
          <Chip
            label="Unverified"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ ml: 1, height: 20, fontWeight: 700 }}
          />
        </Alert>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Verify your {META[channel].label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <OtpForm
              channel={channel}
              destination={destination}
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

/**
 * Renders a "verify your …" banner for every enabled-but-unverified channel.
 * Channels are turned on/off globally by the super admin (auth config).
 */
const VerificationBanners = () => {
  const { user, updateUser } = useAuth();
  const { data: config } = useQuery(["auth-config"], getAuthConfig, {
    staleTime: 5 * 60 * 1000,
  });

  if (!user || !config) return null;

  const pending = [];
  if (config.emailOtpEnabled && user.email && !user.emailVerified) {
    pending.push({ channel: "email", destination: user.email });
  }
  if (config.otpEnabled && user.phone && !user.phoneVerified) {
    pending.push({ channel: "phone", destination: user.phone });
  }
  if (pending.length === 0) return null;

  return (
    <>
      {pending.map((p) => (
        <ChannelBanner
          key={p.channel}
          channel={p.channel}
          destination={p.destination}
          onVerified={() => updateUser({ [META[p.channel].field]: true })}
        />
      ))}
    </>
  );
};

export default VerificationBanners;
