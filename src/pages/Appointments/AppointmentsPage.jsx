import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import BookAppointmentDialog from "./BookAppointmentDialog";
import {
  useAppointments,
  useAppointmentMutations,
} from "../../hooks/appointments/useAppointments";
import { STATUS_COLORS, humanize } from "../../constants/domain";
import { formatDateTime, fullName } from "../../utility/format";

const AppointmentsPage = () => {
  const query = useAppointments();
  const { create, updateStatus } = useAppointmentMutations();
  const [open, setOpen] = useState(false);

  const appointments = query.data?.items ?? [];

  const handleBook = (payload) =>
    create.mutate(payload, { onSuccess: () => setOpen(false) });

  const handleCancel = (appt) => {
    if (window.confirm("Cancel this appointment?")) {
      updateStatus.mutate({ id: appt.id, status: "CANCELLED" });
    }
  };

  return (
    <Box>
      <PageHeader
        title="Appointments"
        subtitle="Book and track visits for your pets."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Book appointment
          </Button>
        }
      />

      <QueryState
        query={query}
        isEmpty={appointments.length === 0}
        emptyMessage="No appointments yet — book your first visit."
      >
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pet</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Vet</TableCell>
                <TableCell>When</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{a.pet?.name || "—"}</TableCell>
                  <TableCell>{a.service?.name || "—"}</TableCell>
                  <TableCell>{a.vet ? fullName(a.vet.user) : "—"}</TableCell>
                  <TableCell>{formatDateTime(a.scheduledAt)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={humanize(a.status)}
                      color={STATUS_COLORS[a.status] || "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {["PENDING", "CONFIRMED"].includes(a.status) && (
                      <Tooltip title="Cancel">
                        <IconButton color="error" onClick={() => handleCancel(a)}>
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      <BookAppointmentDialog
        open={open}
        submitting={create.isLoading}
        onClose={() => setOpen(false)}
        onSubmit={handleBook}
      />
    </Box>
  );
};

export default AppointmentsPage;
