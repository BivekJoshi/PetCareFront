import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useAuthSettings,
  useAuthSettingsMutation,
} from "../../hooks/admin/useAuthSettings";
import { fullName } from "../../utility/format";

// One toggle row for a verification channel.
const ChannelToggle = ({ icon, title, enabled, onToggle, busy, on, off, note }) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 0.5 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Chip
          size="small"
          label={enabled ? "Enabled" : "Disabled"}
          color={enabled ? "success" : "default"}
          sx={{ fontWeight: 700 }}
        />
      </Stack>

      <FormControlLabel
        sx={{ mt: 1 }}
        control={
          <Switch
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            disabled={busy}
          />
        }
        label={enabled ? on : off}
      />

      {note && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {note}
        </Alert>
      )}
    </CardContent>
  </Card>
);

// Account-lockout policy: enable switch + editable attempts/duration.
const LockoutCard = ({ setting, busy, onSave }) => {
  const enabled = Boolean(setting?.lockoutEnabled);
  const [attempts, setAttempts] = useState(String(setting?.lockoutMaxAttempts ?? 5));
  const [minutes, setMinutes] = useState(String(setting?.lockoutDurationMinutes ?? 5));

  // Re-sync the inputs whenever the saved policy changes.
  useEffect(() => {
    setAttempts(String(setting?.lockoutMaxAttempts ?? 5));
    setMinutes(String(setting?.lockoutDurationMinutes ?? 5));
  }, [setting?.lockoutMaxAttempts, setting?.lockoutDurationMinutes]);

  const a = Number(attempts);
  const m = Number(minutes);
  const valid = Number.isInteger(a) && a >= 3 && a <= 20 && Number.isInteger(m) && m >= 1 && m <= 1440;
  const dirty = a !== setting?.lockoutMaxAttempts || m !== setting?.lockoutDurationMinutes;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 0.5 }}>
          <LockClockOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Account lockout
          </Typography>
          <Chip
            size="small"
            label={enabled ? "Enabled" : "Disabled"}
            color={enabled ? "success" : "default"}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Temporarily block sign-in after too many wrong passwords, to slow down
          guessing attacks.
        </Typography>

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              checked={enabled}
              onChange={(e) => onSave({ lockoutEnabled: e.target.checked })}
              disabled={busy}
            />
          }
          label={
            enabled
              ? "ON — accounts lock after repeated failures"
              : "OFF — failed sign-ins are never locked"
          }
        />

        {enabled && (
          <>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Failed attempts before lock"
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(e.target.value)}
                inputProps={{ min: 3, max: 20 }}
                helperText="Between 3 and 20"
                fullWidth
              />
              <TextField
                label="Lock duration (minutes)"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                inputProps={{ min: 1, max: 1440 }}
                helperText="1 minute to 24 hours"
                fullWidth
              />
            </Stack>
            <Box sx={{ mt: 2 }}>
              <LoadingButton
                loading={busy}
                variant="contained"
                disabled={!valid || !dirty}
                onClick={() =>
                  onSave({ lockoutMaxAttempts: a, lockoutDurationMinutes: m })
                }
              >
                Save lockout settings
              </LoadingButton>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const AuthSettingsPage = () => {
  const query = useAuthSettings();
  const mutation = useAuthSettingsMutation();
  const setting = query.data;

  const emailOn = Boolean(setting?.emailOtpEnabled);
  const phoneOn = Boolean(setting?.otpEnabled);

  const set = (patch) => {
    if (mutation.isLoading) return;
    mutation.mutate(patch);
  };

  return (
    <Box>
      <PageHeader
        title="Authentication & Security"
        subtitle="Control how new users verify their account and how PetCare protects sign-in."
      />

      <QueryState query={query} isEmpty={false}>
        <Stack spacing={3} sx={{ maxWidth: 680 }}>
          <ChannelToggle
            icon={<MarkEmailReadOutlinedIcon color="primary" />}
            title="Email OTP (Mailtrap)"
            enabled={emailOn}
            busy={mutation.isLoading}
            onToggle={(v) => set({ emailOtpEnabled: v })}
            on="ON — new users get a 6-digit code by email"
            off="OFF — email is not verified at sign-up"
            note={
              !emailOn &&
              "New sign-ups won't be asked to verify their email address."
            }
          />

          <ChannelToggle
            icon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
            title="WhatsApp OTP"
            enabled={phoneOn}
            busy={mutation.isLoading}
            onToggle={(v) => set({ otpEnabled: v })}
            on="ON — new users get a code on WhatsApp"
            off="OFF — phone is not verified at sign-up"
            note={
              phoneOn &&
              "Requires a WhatsApp provider in the backend env to send real messages (dev logs the code)."
            }
          />

          <LockoutCard setting={setting} busy={mutation.isLoading} onSave={set} />

          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Last changed by</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {setting?.updatedBy ? fullName(setting.updatedBy) : "—"}
            </Typography>
          </Stack>
        </Stack>
      </QueryState>
    </Box>
  );
};

export default AuthSettingsPage;
