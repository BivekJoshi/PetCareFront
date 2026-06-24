import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import BookAppointmentDialog from "../Appointments/BookAppointmentDialog";
import {
  useAppointments,
  useAppointmentMutations,
} from "../../hooks/appointments/useAppointments";
import { humanize, STATUS_COLORS } from "../../constants/domain";
import { formatDateTime, fullName } from "../../utility/format";
import { Loading, EmptyState, petEmoji } from "./ownerUi";

const isUpcoming = (a) => ["PENDING", "CONFIRMED"].includes(a.status);

const AppointmentCard = ({ appt, onComplete, onCancel, busy }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, p: 1.75 }}>
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Avatar
        sx={{ width: 46, height: 46, fontSize: 24, bgcolor: "primary.backgroundCard" }}
      >
        {petEmoji(appt.pet?.species)}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 800 }} noWrap>
            {appt.pet?.name || "Pet"}
          </Typography>
          <Chip
            size="small"
            label={humanize(appt.status)}
            color={STATUS_COLORS[appt.status] || "default"}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ color: "text.secondary", mt: 0.25 }}
        >
          <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />
          <Typography variant="caption">{formatDateTime(appt.scheduledAt)}</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {appt.service?.name ||
            (appt.vet ? fullName(appt.vet.user) : "General visit")}
        </Typography>
      </Box>

      {isUpcoming(appt) && (
        <Stack spacing={0.5}>
          <Tooltip title="Mark done">
            <span>
              <IconButton
                size="small"
                color="success"
                disabled={busy}
                onClick={() => onComplete(appt)}
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancel">
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={busy}
                onClick={() => onCancel(appt)}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  </Card>
);

const OwnerAppointments = () => {
  const query = useAppointments({ limit: 100 });
  const { create, updateStatus } = useAppointmentMutations();

  const [tab, setTab] = useState(0); // 0 = upcoming, 1 = history
  const [booking, setBooking] = useState(false);

  const all = query.data?.items ?? [];
  const { upcoming, history } = useMemo(() => {
    const up = [];
    const past = [];
    all.forEach((a) => (isUpcoming(a) ? up : past).push(a));
    up.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    past.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
    return { upcoming: up, history: past };
  }, [all]);

  const list = tab === 0 ? upcoming : history;

  const handleBook = (payload) => {
    create.mutate(payload, { onSuccess: () => setBooking(false) });
  };

  const handleComplete = (appt) =>
    updateStatus.mutate({ id: appt.id, status: "COMPLETED" });

  const handleCancel = (appt) => {
    if (window.confirm(`Cancel ${appt.pet?.name || "this"} appointment?`)) {
      updateStatus.mutate({ id: appt.id, status: "CANCELLED" });
    }
  };

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={() => setBooking(true)}
        sx={{ mb: 1.5 }}
      >
        Book an appointment
      </Button>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{ mb: 2, minHeight: 40, "& .MuiTab-root": { minHeight: 40, fontWeight: 700 } }}
      >
        <Tab label={`Upcoming${upcoming.length ? ` (${upcoming.length})` : ""}`} />
        <Tab label="History" />
      </Tabs>

      {query.isLoading ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyState
          emoji={tab === 0 ? "📅" : "🗂️"}
          title={tab === 0 ? "No upcoming visits" : "No past visits"}
          hint={
            tab === 0
              ? "Book a vet visit, grooming or check-up for your pet."
              : "Completed and cancelled appointments will appear here."
          }
        />
      ) : (
        <Stack spacing={1.5}>
          {list.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              busy={updateStatus.isLoading}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          ))}
        </Stack>
      )}

      <BookAppointmentDialog
        open={booking}
        submitting={create.isLoading}
        onClose={() => setBooking(false)}
        onSubmit={handleBook}
      />
    </Box>
  );
};

export default OwnerAppointments;
