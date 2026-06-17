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
import { PET_SPECIES, PET_GENDERS, humanize } from "../../constants/domain";

const EMPTY = {
  name: "",
  species: "DOG",
  breed: "",
  gender: "UNKNOWN",
  notes: "",
};

// `pet` present => edit mode; absent => create mode.
const PetFormDialog = ({ open, onClose, onSubmit, pet, submitting }) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(
        pet
          ? {
              name: pet.name ?? "",
              species: pet.species ?? "DOG",
              breed: pet.breed ?? "",
              gender: pet.gender ?? "UNKNOWN",
              notes: pet.notes ?? "",
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, pet]);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!values.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }
    // Drop empty optional strings so we don't send "".
    const payload = {
      name: values.name.trim(),
      species: values.species,
      gender: values.gender,
      ...(values.breed.trim() ? { breed: values.breed.trim() } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{pet ? "Edit pet" : "Add a pet"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={values.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            select
            label="Species"
            value={values.species}
            onChange={handleChange("species")}
            fullWidth
          >
            {PET_SPECIES.map((s) => (
              <MenuItem key={s} value={s}>
                {humanize(s)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Breed"
            value={values.breed}
            onChange={handleChange("breed")}
            fullWidth
          />
          <TextField
            select
            label="Gender"
            value={values.gender}
            onChange={handleChange("gender")}
            fullWidth
          >
            {PET_GENDERS.map((g) => (
              <MenuItem key={g} value={g}>
                {humanize(g)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            value={values.notes}
            onChange={handleChange("notes")}
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
          {pet ? "Save changes" : "Add pet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetFormDialog;
