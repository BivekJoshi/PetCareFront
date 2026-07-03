import { useMemo, useState } from "react";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
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

  const columns = useMemo(
    () => [
      {
        id: "pet",
        header: "Pet",
        accessorFn: (row) => row.pet?.name || "—",
        Cell: ({ cell }) => <Box sx={{ fontWeight: 600 }}>{cell.getValue()}</Box>,
      },
      {
        id: "service",
        header: "Service",
        accessorFn: (row) => row.service?.name || "—",
      },
      {
        id: "vet",
        header: "Vet",
        accessorFn: (row) => (row.vet ? fullName(row.vet.user) : "—"),
      },
      {
        accessorKey: "scheduledAt",
        header: "When",
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={humanize(cell.getValue())}
            color={STATUS_COLORS[cell.getValue()] || "default"}
          />
        ),
      },
    ],
    [],
  );

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

      <DataTable
        columns={columns}
        data={appointments}
        query={query}
        emptyMessage="No appointments yet — book your first visit."
        enableSearch
        enablePagination
        rowActions={(appt) =>
          ["PENDING", "CONFIRMED"].includes(appt.status) ? (
            <Tooltip title="Cancel">
              <IconButton color="error" onClick={() => handleCancel(appt)}>
                <CancelOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null
        }
      />

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
