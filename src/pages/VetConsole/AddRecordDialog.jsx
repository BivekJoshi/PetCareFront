import { useEffect, useState } from "react";
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
import { RECORD_TYPES, humanize } from "../../constants/domain";

const EMPTY = {
  type: "CHECKUP",
  diagnosis: "",
  treatment: "",
  medicine: "",
  diet: "",
  instructions: "",
};

const AddRecordDialog = ({ open, onClose, onSubmit, submitting, petName }) => {
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
    // At least one clinical field beyond the type should be present.
    const hasContent = ["diagnosis", "treatment", "medicine", "diet", "instructions"].some(
      (k) => values[k].trim()
    );
    if (!hasContent) {
      setError("Add at least a diagnosis, treatment, medicine or diet");
      return;
    }
    const payload = { type: values.type };
    ["diagnosis", "treatment", "medicine", "diet", "instructions"].forEach((k) => {
      if (values[k].trim()) payload[k] = values[k].trim();
    });
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add medical record{petName ? ` — ${petName}` : ""}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField select label="Type" value={values.type} onChange={change("type")} fullWidth>
            {RECORD_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {humanize(t)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Diagnosis"
            value={values.diagnosis}
            onChange={change("diagnosis")}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField label="Treatment" value={values.treatment} onChange={change("treatment")} fullWidth multiline minRows={2} />
          <TextField label="Medicine prescribed" value={values.medicine} onChange={change("medicine")} fullWidth />
          <TextField label="Diet / food advice" value={values.diet} onChange={change("diet")} fullWidth />
          <TextField label="Instructions for owner" value={values.instructions} onChange={change("instructions")} fullWidth multiline minRows={2} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          Save record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordDialog;
