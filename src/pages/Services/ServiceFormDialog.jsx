import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

const EMPTY = { name: "", description: "", price: "", durationMin: 30 };

const ServiceFormDialog = ({ open, onClose, onSubmit, service, submitting }) => {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValues(
        service
          ? {
              name: service.name ?? "",
              description: service.description ?? "",
              price: ((service.priceCents ?? 0) / 100).toString(),
              durationMin: service.durationMin ?? 30,
            }
          : EMPTY
      );
      setError("");
    }
  }, [open, service]);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!values.name.trim()) {
      setError("Name is required");
      return;
    }
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      priceCents: Math.round(Number(values.price || 0) * 100),
      durationMin: Number(values.durationMin) || 30,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{service ? "Edit service" : "Add service"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={values.name}
            onChange={handleChange("name")}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={values.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Price"
            type="number"
            value={values.price}
            onChange={handleChange("price")}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
          />
          <TextField
            label="Duration"
            type="number"
            value={values.durationMin}
            onChange={handleChange("durationMin")}
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {service ? "Save changes" : "Add service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormDialog;
