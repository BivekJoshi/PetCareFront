import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { usePets } from "../../hooks/pets/usePets";
import { useServices } from "../../hooks/services/useServices";
import { useVets } from "../../hooks/vets/useVets";
import { toDateTimeLocal, fullName } from "../../utility/format";

const BookAppointmentDialog = ({ open, onClose, onSubmit, submitting }) => {
  const pets = usePets({ limit: 100 });
  const services = useServices({ limit: 100, isActive: true });
  const vets = useVets({ limit: 100 });

  const [values, setValues] = useState({
    petId: "",
    serviceId: "",
    vetId: "",
    scheduledAt: toDateTimeLocal(),
    reason: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({
        petId: "",
        serviceId: "",
        vetId: "",
        scheduledAt: toDateTimeLocal(),
        reason: "",
      });
      setError("");
    }
  }, [open]);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!values.petId) {
      setError("Please choose a pet");
      return;
    }
    if (!values.scheduledAt) {
      setError("Please choose a date and time");
      return;
    }
    onSubmit({
      petId: values.petId,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      ...(values.serviceId ? { serviceId: values.serviceId } : {}),
      ...(values.vetId ? { vetId: values.vetId } : {}),
      ...(values.reason.trim() ? { reason: values.reason.trim() } : {}),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Book an appointment</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            select
            label="Pet"
            value={values.petId}
            onChange={handleChange("petId")}
            error={Boolean(error) && !values.petId}
            helperText={!values.petId ? error : ""}
            fullWidth
            required
          >
            {(pets.data?.items ?? []).map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Service (optional)"
            value={values.serviceId}
            onChange={handleChange("serviceId")}
            fullWidth
          >
            <MenuItem value="">— None —</MenuItem>
            {(services.data?.items ?? []).map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Preferred vet (optional)"
            value={values.vetId}
            onChange={handleChange("vetId")}
            fullWidth
          >
            <MenuItem value="">— Any —</MenuItem>
            {(vets.data?.items ?? []).map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {fullName(v.user)}
                {v.specialization ? ` · ${v.specialization}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date & time"
            type="datetime-local"
            value={values.scheduledAt}
            onChange={handleChange("scheduledAt")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Reason (optional)"
            value={values.reason}
            onChange={handleChange("reason")}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointmentDialog;
