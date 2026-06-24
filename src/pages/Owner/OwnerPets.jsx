import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import PetFormDialog from "../Pets/PetFormDialog";
import PetHealthDialog from "../Pets/PetHealthDialog";
import { usePets, usePetMutations } from "../../hooks/pets/usePets";
import { humanize } from "../../constants/domain";
import { Loading, EmptyState, petEmoji } from "./ownerUi";

const OwnerPets = () => {
  const query = usePets({ limit: 100 });
  const { create, update, remove } = usePetMutations();

  const [form, setForm] = useState({ open: false, pet: null });
  const [health, setHealth] = useState({ open: false, pet: null });
  const [menu, setMenu] = useState({ anchorEl: null, pet: null });

  const pets = query.data?.items ?? [];

  const openMenu = (e, pet) => setMenu({ anchorEl: e.currentTarget, pet });
  const closeMenu = () => setMenu({ anchorEl: null, pet: null });

  const handleSubmit = (payload) => {
    const mutation = form.pet ? update : create;
    const args = form.pet ? { id: form.pet.id, ...payload } : payload;
    mutation.mutate(args, {
      onSuccess: () => setForm({ open: false, pet: null }),
    });
  };

  const handleDelete = (pet) => {
    closeMenu();
    if (window.confirm(`Remove ${pet.name}? This cannot be undone.`)) {
      remove.mutate(pet.id);
    }
  };

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={() => setForm({ open: true, pet: null })}
        sx={{ mb: 2 }}
      >
        Register a pet
      </Button>

      {query.isLoading ? (
        <Loading />
      ) : pets.length === 0 ? (
        <EmptyState
          emoji="🐶"
          title="No pets yet"
          hint="Register your first companion — each gets a unique code to share with your vet."
        />
      ) : (
        <Stack spacing={1.5}>
          {pets.map((pet) => (
            <Card
              key={pet.id}
              variant="outlined"
              sx={{ borderRadius: 3, p: 1.75 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    fontSize: 27,
                    bgcolor: "primary.backgroundCard",
                  }}
                >
                  {petEmoji(pet.species)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }} noWrap>
                    {pet.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {humanize(pet.species)}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                  </Typography>
                  {pet.code && (
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        size="small"
                        label={pet.code}
                        sx={{ fontFamily: "monospace", fontWeight: 700, height: 22 }}
                      />
                    </Box>
                  )}
                </Box>
                <IconButton onClick={(e) => openMenu(e, pet)}>
                  <MoreVertRoundedIcon />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Per-pet action menu */}
      <Menu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setHealth({ open: true, pet: menu.pet });
            closeMenu();
          }}
        >
          <ListItemIcon>
            <HealthAndSafetyOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Health record
        </MenuItem>
        <MenuItem
          onClick={() => {
            setForm({ open: true, pet: menu.pet });
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit details
        </MenuItem>
        <MenuItem onClick={() => handleDelete(menu.pet)} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          Remove
        </MenuItem>
      </Menu>

      <PetFormDialog
        open={form.open}
        pet={form.pet}
        submitting={create.isLoading || update.isLoading}
        onClose={() => setForm({ open: false, pet: null })}
        onSubmit={handleSubmit}
      />
      <PetHealthDialog
        open={health.open}
        pet={health.pet}
        onClose={() => setHealth({ open: false, pet: null })}
      />
    </Box>
  );
};

export default OwnerPets;
