import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import LocationPicker from "../../components/common/map/LocationPicker";

const emptyForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  specialization: "",
  licenseNumber: "",
  bio: "",
  yearsExp: 0,
  address: "",
  isAvailable: true,
};

/**
 * Admin dialog to create a new vet (with login) or edit an existing vet's
 * profile. In both modes the admin can set the vet's map location with the
 * picker (current location or click-to-drop a pin).
 */
const VetEditDialog = ({ open, onClose, onSubmit, submitting, vet }) => {
  const isEdit = Boolean(vet);
  const [form, setForm] = useState(emptyForm);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (vet) {
      setForm({
        ...emptyForm,
        firstName: vet.user?.firstName ?? "",
        lastName: vet.user?.lastName ?? "",
        phone: vet.user?.phone ?? "",
        specialization: vet.specialization ?? "",
        licenseNumber: vet.licenseNumber ?? "",
        bio: vet.bio ?? "",
        yearsExp: vet.yearsExp ?? 0,
        address: vet.address ?? "",
        isAvailable: vet.isAvailable ?? true,
      });
      setLocation(
        vet.latitude != null && vet.longitude != null
          ? { latitude: vet.latitude, longitude: vet.longitude }
          : null
      );
    } else {
      setForm(emptyForm);
      setLocation(null);
    }
  }, [open, vet]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!isEdit) {
      if (!form.email.trim() || !form.password.trim()) {
        setError("Email and password are required for a new vet");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required");
      return;
    }

    const yearsExp = Number(form.yearsExp) || 0;
    const loc = location
      ? { latitude: location.latitude, longitude: location.longitude }
      : isEdit
        ? { latitude: null, longitude: null }
        : {};

    if (isEdit) {
      onSubmit({
        id: vet.id,
        specialization: form.specialization.trim() || undefined,
        licenseNumber: form.licenseNumber.trim() || undefined,
        bio: form.bio.trim() || undefined,
        yearsExp,
        isAvailable: form.isAvailable,
        address: form.address.trim() || null,
        ...loc,
      });
    } else {
      onSubmit({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        specialization: form.specialization.trim() || undefined,
        licenseNumber: form.licenseNumber.trim() || undefined,
        bio: form.bio.trim() || undefined,
        yearsExp,
        address: form.address.trim() || undefined,
        ...loc,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? "Edit veterinarian" : "Add veterinarian"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {!isEdit && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  fullWidth
                  required
                  helperText="At least 6 characters"
                />
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
                value={form.firstName}
                onChange={set("firstName")}
                fullWidth
                required
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={set("lastName")}
                fullWidth
                required
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={set("phone")}
                fullWidth
                disabled={isEdit}
                helperText={isEdit ? "Edit phone from User Management" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Specialization"
                value={form.specialization}
                onChange={set("specialization")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="License number"
                value={form.licenseNumber}
                onChange={set("licenseNumber")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Years of experience"
                type="number"
                value={form.yearsExp}
                onChange={set("yearsExp")}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                value={form.bio}
                onChange={set("bio")}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={form.address}
                onChange={set("address")}
                fullWidth
                helperText="Shown in the contact popup on the vet map"
              />
            </Grid>
          </Grid>

          {isEdit && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isAvailable: e.target.checked }))
                  }
                />
              }
              label="Available for appointments"
            />
          )}

          <LocationPicker
            label="Vet location (set the pin so owners can find this vet)"
            value={location}
            onChange={setLocation}
            height={280}
          />

          {error && (
            <Stack sx={{ color: "error.main", fontSize: 14 }}>{error}</Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {isEdit ? "Save changes" : "Create vet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VetEditDialog;
