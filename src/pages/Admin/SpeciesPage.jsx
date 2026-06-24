import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useAllSpecies,
  useSpeciesMutations,
} from "../../hooks/species/useSpecies";

const BLANK = {
  key: "",
  name: "",
  emoji: "🐾",
  tint: "#0E9594",
  sortOrder: 0,
  isActive: true,
};

const SpeciesPage = () => {
  const query = useAllSpecies();
  const { create, update, remove } = useSpeciesMutations();

  const [dialog, setDialog] = useState(null); // { mode: 'create'|'edit', values }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const items = query.data || [];
  const saving = create.isLoading || update.isLoading;

  const openCreate = () => setDialog({ mode: "create", values: BLANK });
  const openEdit = (s) =>
    setDialog({
      mode: "edit",
      values: {
        id: s.id,
        key: s.key,
        name: s.name,
        emoji: s.emoji,
        tint: s.tint,
        sortOrder: s.sortOrder,
        isActive: s.isActive,
      },
    });
  const close = () => setDialog(null);

  const setField = (field) => (e) =>
    setDialog((d) => ({ ...d, values: { ...d.values, [field]: e.target.value } }));

  const handleSave = () => {
    const v = dialog.values;
    if (!v.name.trim()) return;
    const payload = {
      name: v.name.trim(),
      emoji: v.emoji.trim() || "🐾",
      tint: v.tint,
      sortOrder: Number(v.sortOrder) || 0,
      isActive: v.isActive,
    };
    if (dialog.mode === "create") {
      if (!v.key.trim()) return;
      create.mutate({ key: v.key.trim(), ...payload }, { onSuccess: close });
    } else {
      update.mutate({ id: v.id, ...payload }, { onSuccess: close });
    }
  };

  const toggleActive = (s) =>
    update.mutate({ id: s.id, isActive: !s.isActive });

  return (
    <Box>
      <PageHeader
        title="Species"
        subtitle="Manage the animal species owners can register. Dogs and cats exist by default — add as many as you need."
        action={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openCreate}
          >
            Add species
          </Button>
        }
      />

      <QueryState
        query={query}
        isEmpty={items.length === 0}
        emptyMessage="No species yet. Add your first one."
      >
        <TableContainer
          component={Box}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Species</TableCell>
                <TableCell>Key</TableCell>
                <TableCell align="right">Pets</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: `${s.tint}22`, width: 38, height: 38, fontSize: 20 }}
                      >
                        {s.emoji}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" variant="outlined" label={s.key} />
                  </TableCell>
                  <TableCell align="right">{s.petCount}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={s.isActive}
                      onChange={() => toggleActive(s)}
                      disabled={saving}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(s)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        s.petCount > 0
                          ? "In use — deactivate instead"
                          : "Delete"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={s.petCount > 0}
                          onClick={() => setConfirmDelete(s)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      {/* Create / edit dialog */}
      <Dialog open={Boolean(dialog)} onClose={close} maxWidth="xs" fullWidth>
        {dialog && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {dialog.mode === "create" ? "Add species" : "Edit species"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Emoji"
                    value={dialog.values.emoji}
                    onChange={setField("emoji")}
                    sx={{ width: 90 }}
                    inputProps={{ style: { fontSize: 22, textAlign: "center" } }}
                  />
                  <TextField
                    label="Name"
                    value={dialog.values.name}
                    onChange={setField("name")}
                    fullWidth
                    required
                    autoFocus
                  />
                </Stack>

                <TextField
                  label="Key"
                  value={dialog.values.key}
                  onChange={setField("key")}
                  disabled={dialog.mode === "edit"}
                  required={dialog.mode === "create"}
                  helperText={
                    dialog.mode === "edit"
                      ? "The key can't be changed — pets reference it."
                      : "A unique code, e.g. HORSE. Auto-uppercased."
                  }
                  fullWidth
                />

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Colour"
                    type="color"
                    value={dialog.values.tint}
                    onChange={setField("tint")}
                    sx={{ width: 90 }}
                  />
                  <TextField
                    label="Sort order"
                    type="number"
                    value={dialog.values.sortOrder}
                    onChange={setField("sortOrder")}
                    fullWidth
                  />
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={dialog.values.isActive}
                      onChange={(e) =>
                        setDialog((d) => ({
                          ...d,
                          values: { ...d.values, isActive: e.target.checked },
                        }))
                      }
                    />
                  }
                  label={dialog.values.isActive ? "Active" : "Inactive (hidden from owners)"}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={close} color="inherit">
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {dialog.mode === "create" ? "Add" : "Save"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete species?</DialogTitle>
        <DialogContent>
          <Typography>
            Permanently delete <strong>{confirmDelete?.name}</strong>? This
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={remove.isLoading}
            onClick={() =>
              remove.mutate(confirmDelete.id, {
                onSuccess: () => setConfirmDelete(null),
              })
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpeciesPage;
