import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { VACCINATION_STATUSES, humanize } from "../../constants/domain";

const EMPTY = {
  vaccineName: "",
  doseNumber: 1,
  status: "ADMINISTERED",
  administeredAt: "",
  nextDueAt: "",
  batchNo: "",
  isSubsidized: false,
  notes: "",
};

const AddVaccinationDialog = ({ open, onClose, onSubmit, submitting, petName }) => {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setError("");
    }
  }, [open]);

  const change = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!values.vaccineName.trim()) {
      setError("Vaccine name is required");
      return;
    }
    const payload = {
      vaccineName: values.vaccineName.trim(),
      doseNumber: Number(values.doseNumber) || 1,
      status: values.status,
      isSubsidized: values.isSubsidized,
      ...(values.administeredAt ? { administeredAt: values.administeredAt } : {}),
      ...(values.nextDueAt ? { nextDueAt: values.nextDueAt } : {}),
      ...(values.batchNo.trim() ? { batchNo: values.batchNo.trim() } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Record vaccination{petName ? ` — ${petName}` : ""}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Vaccine name"
            value={values.vaccineName}
            onChange={change("vaccineName")}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            required
            autoFocus
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Dose #"
              type="number"
              value={values.doseNumber}
              onChange={change("doseNumber")}
              sx={{ width: 120 }}
            />
            <TextField select label="Status" value={values.status} onChange={change("status")} fullWidth>
              {VACCINATION_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {humanize(s)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Administered on"
              type="date"
              value={values.administeredAt}
              onChange={change("administeredAt")}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Next due"
              type="date"
              value={values.nextDueAt}
              onChange={change("nextDueAt")}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
          <TextField label="Batch no." value={values.batchNo} onChange={change("batchNo")} fullWidth />
          <FormControlLabel
            control={
              <Switch
                checked={values.isSubsidized}
                onChange={(e) => setValues((v) => ({ ...v, isSubsidized: e.target.checked }))}
              />
            }
            label="Government-subsidised dose"
          />
          <TextField
            label="Notes"
            value={values.notes}
            onChange={change("notes")}
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
          Save vaccination
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVaccinationDialog;
