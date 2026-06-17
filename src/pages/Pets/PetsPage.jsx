import React, { useState } from "react";
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import PetFormDialog from "./PetFormDialog";
import { usePets, usePetMutations } from "../../hooks/pets/usePets";
import { humanize } from "../../constants/domain";

const PetsPage = () => {
  const query = usePets();
  const { create, update, remove } = usePetMutations();
  const [dialog, setDialog] = useState({ open: false, pet: null });

  const pets = query.data?.items ?? [];

  const handleSubmit = (payload) => {
    const mutation = dialog.pet ? update : create;
    const args = dialog.pet ? { id: dialog.pet.id, ...payload } : payload;
    mutation.mutate(args, { onSuccess: () => setDialog({ open: false, pet: null }) });
  };

  const handleDelete = (pet) => {
    if (window.confirm(`Remove ${pet.name}? This cannot be undone.`)) {
      remove.mutate(pet.id);
    }
  };

  return (
    <Box>
      <PageHeader
        title="My Pets"
        subtitle="Manage the pets under your care."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialog({ open: true, pet: null })}
          >
            Add pet
          </Button>
        }
      />

      <QueryState query={query} isEmpty={pets.length === 0} emptyMessage="No pets yet — add your first one.">
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Breed</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{pet.name}</TableCell>
                  <TableCell>
                    <Chip size="small" label={humanize(pet.species)} />
                  </TableCell>
                  <TableCell>{pet.breed || "—"}</TableCell>
                  <TableCell>{humanize(pet.gender)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setDialog({ open: true, pet })}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton onClick={() => handleDelete(pet)} color="error">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      <PetFormDialog
        open={dialog.open}
        pet={dialog.pet}
        submitting={create.isLoading || update.isLoading}
        onClose={() => setDialog({ open: false, pet: null })}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default PetsPage;
