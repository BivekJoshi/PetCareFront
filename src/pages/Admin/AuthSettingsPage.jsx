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
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useAuthSettings,
  useAuthSettingsMutation,
} from "../../hooks/admin/useAuthSettings";
import { fullName } from "../../utility/format";

const AuthSettingsPage = () => {
  const query = useAuthSettings();
  const mutation = useAuthSettingsMutation();
  const setting = query.data;
  const otpEnabled = Boolean(setting?.otpEnabled);

  const toggle = (next) => {
    if (next === otpEnabled || mutation.isLoading) return;
    mutation.mutate({ otpEnabled: next });
  };

  return (
    <Box>
      <PageHeader
        title="Sign-up Verification"
        subtitle="Control whether new users must verify their phone number via a WhatsApp OTP when they sign up."
      />

      <QueryState query={query} isEmpty={false}>
        <Card variant="outlined" sx={{ borderRadius: 3, maxWidth: 680 }}>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{ mb: 0.5 }}
            >
              <WhatsAppIcon sx={{ color: "#25D366" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                WhatsApp OTP verification
              </Typography>
              <Chip
                size="small"
                label={otpEnabled ? "Enabled" : "Disabled"}
                color={otpEnabled ? "success" : "default"}
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              When enabled, new sign-ups receive a 6-digit code on WhatsApp and
              are prompted to verify (they may still choose “verify later”). When
              disabled, registration skips verification entirely — no code is
              sent and users are not asked to verify.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={otpEnabled}
                  onChange={(e) => toggle(e.target.checked)}
                  disabled={mutation.isLoading}
                />
              }
              label={
                otpEnabled
                  ? "OTP verification is ON — new users get a WhatsApp code"
                  : "OTP verification is OFF — sign-up requires no verification"
              }
            />

            {!otpEnabled && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Phone numbers are still collected at sign-up, but no WhatsApp code
                is sent and accounts are created without phone verification.
              </Alert>
            )}

            <Divider sx={{ my: 2.5 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Last changed by</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {setting?.updatedBy ? fullName(setting.updatedBy) : "—"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </QueryState>
    </Box>
  );
};

export default AuthSettingsPage;
