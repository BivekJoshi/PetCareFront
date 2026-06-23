import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useChatRetention,
  useChatRetentionMutations,
} from "../../hooks/admin/useChatRetention";
import { formatDateTime, fullName } from "../../utility/format";

const DEFAULT_DAYS = 50;
const MIN_DAYS = 1;
const MAX_DAYS = 1825;

const ChatRetentionPage = () => {
  const query = useChatRetention();
  const { update, purge } = useChatRetentionMutations();
  const setting = query.data;

  const [days, setDays] = useState(DEFAULT_DAYS);
  const [enabled, setEnabled] = useState(true);

  // Sync local form state whenever the server value (re)loads.
  useEffect(() => {
    if (setting) {
      setDays(setting.retentionDays);
      setEnabled(setting.enabled);
    }
  }, [setting]);

  const daysNum = Number(days);
  const daysInvalid =
    !Number.isInteger(daysNum) || daysNum < MIN_DAYS || daysNum > MAX_DAYS;

  const dirty =
    setting && (daysNum !== setting.retentionDays || enabled !== setting.enabled);

  const handleSave = () => {
    if (daysInvalid) return;
    update.mutate({ retentionDays: daysNum, enabled });
  };

  const handlePurge = () => {
    if (
      window.confirm(
        `Permanently delete every message older than ${
          setting?.retentionDays ?? DEFAULT_DAYS
        } days from the database now? This cannot be undone.`
      )
    ) {
      purge.mutate();
    }
  };

  return (
    <Box>
      <PageHeader
        title="Chat Retention"
        subtitle="Control how long chat messages are kept before they are permanently deleted from the database."
      />

      <QueryState query={query} isEmpty={false}>
        <Grid container spacing={3}>
          {/* Policy editor */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Auto-delete policy
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                  Messages older than this window are wiped from the database
                  (and their attachments removed from disk) by a daily job,
                  keeping storage costs down. The default is {DEFAULT_DAYS} days.
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Delete messages after"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    disabled={!enabled}
                    error={daysInvalid}
                    helperText={
                      daysInvalid
                        ? `Enter a whole number of days between ${MIN_DAYS} and ${MAX_DAYS}.`
                        : "Set the number of days to keep each message."
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">days</InputAdornment>
                      ),
                      inputProps: { min: MIN_DAYS, max: MAX_DAYS, step: 1 },
                    }}
                    sx={{ maxWidth: 320 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                      />
                    }
                    label={
                      enabled
                        ? "Automatic deletion is ON"
                        : "Automatic deletion is OFF (nothing will be deleted)"
                    }
                  />

                  {!enabled && (
                    <Alert severity="warning">
                      With auto-delete off, messages are kept forever and storage
                      will keep growing.
                    </Alert>
                  )}

                  <Divider />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ sm: "center" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={handleSave}
                      disabled={!dirty || daysInvalid || update.isLoading}
                    >
                      Save policy
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltOutlinedIcon />}
                      onClick={() => {
                        setDays(DEFAULT_DAYS);
                        setEnabled(true);
                      }}
                      disabled={update.isLoading}
                    >
                      Reset to default ({DEFAULT_DAYS}d)
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Status + manual purge */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Current status
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Row label="Status">
                    <Chip
                      size="small"
                      label={setting?.enabled ? "Active" : "Disabled"}
                      color={setting?.enabled ? "success" : "default"}
                    />
                  </Row>
                  <Row label="Window">
                    <Typography sx={{ fontWeight: 600 }}>
                      {setting?.retentionDays ?? "—"} days
                    </Typography>
                  </Row>
                  <Row label="Last purge">
                    <Typography>{formatDateTime(setting?.lastPurgeAt)}</Typography>
                  </Row>
                  <Row label="Last deleted">
                    <Typography>{setting?.lastPurgeCount ?? 0} messages</Typography>
                  </Row>
                  <Row label="Changed by">
                    <Typography>
                      {setting?.updatedBy ? fullName(setting.updatedBy) : "—"}
                    </Typography>
                  </Row>
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Run the cleanup immediately instead of waiting for the daily
                  job.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<DeleteSweepOutlinedIcon />}
                  onClick={handlePurge}
                  disabled={purge.isLoading || !setting?.enabled}
                >
                  {purge.isLoading ? "Purging…" : "Purge old messages now"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </QueryState>
    </Box>
  );
};

const Row = ({ label, children }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography color="text.secondary">{label}</Typography>
    {children}
  </Stack>
);

export default ChatRetentionPage;
