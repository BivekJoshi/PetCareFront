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
import { PET_GENDERS, humanize } from "../../constants/domain";
import { usePublicSpecies } from "../../hooks/species/useSpecies";

const EMPTY = {
  name: "",
  species: "",
  breed: "",
  gender: "UNKNOWN",
  notes: "",
};

// `pet` present => edit mode; absent => create mode.
const PetFormDialog = ({ open, onClose, onSubmit, pet, submitting }) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const { data: species = [], isLoading: speciesLoading } = usePublicSpecies();

  useEffect(() => {
    if (open) {
      // Default new pets to the first available species once the list loads.
      const fallback = species[0]?.key ?? "";
      setValues(
        pet
          ? {
              name: pet.name ?? "",
              species: pet.species ?? fallback,
              breed: pet.breed ?? "",
              gender: pet.gender ?? "UNKNOWN",
              notes: pet.notes ?? "",
            }
          : { ...EMPTY, species: fallback }
      );
      setErrors({});
    }
  }, [open, pet, species]);

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
            disabled={speciesLoading}
            helperText={
              !speciesLoading && species.length === 0
                ? "No species available — ask an admin to add one."
                : undefined
            }
          >
            {species.map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {s.emoji} {s.name}
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
