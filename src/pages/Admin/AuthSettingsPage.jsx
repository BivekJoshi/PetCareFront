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
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
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
        title="Sign-up Verification"
        subtitle="Choose how new users verify their account at sign-up. Turn each channel on or off — users may always 'verify later'."
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
