import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import {
  useRoleRequestFields,
  useRoleRequestFieldMutations,
} from "../../hooks/roleRequestFields/useRoleRequestFields";
import { REQUESTABLE_ROLES, humanize } from "../../constants/domain";

const TYPES = ["TEXT", "NUMBER", "DATE", "SELECT"];

// Derive a safe machine key from a label, e.g. "PAN Number" → "pan_number".
const toKey = (label = "") => {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return /^[a-z]/.test(slug) ? slug : `field_${slug}`;
};

const emptyForm = {
  label: "",
  key: "",
  type: "TEXT",
  required: true,
  placeholder: "",
  options: "",
  order: 0,
  isActive: true,
};

const FieldDialog = ({ open, onClose, onSubmit, submitting, field, role }) => {
  const isEdit = Boolean(field);
  const [form, setForm] = useState(emptyForm);
  const [keyTouched, setKeyTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setKeyTouched(false);
    if (field) {
      setForm({
        label: field.label ?? "",
        key: field.key ?? "",
        type: field.type ?? "TEXT",
        required: field.required ?? true,
        placeholder: field.placeholder ?? "",
        options: Array.isArray(field.options) ? field.options.join(", ") : "",
        order: field.order ?? 0,
        isActive: field.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, field]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleLabel = (e) => {
    const label = e.target.value;
    setForm((f) => ({
      ...f,
      label,
      key: isEdit || keyTouched ? f.key : toKey(label),
    }));
  };

  const handleSubmit = () => {
    if (!form.label.trim()) return setError("Label is required");
    if (!form.key.trim()) return setError("Key is required");
    const options =
      form.type === "SELECT"
        ? form.options
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : [];
    if (form.type === "SELECT" && options.length === 0) {
      return setError("Add at least one comma-separated option for a dropdown");
    }

    if (isEdit) {
      onSubmit({
        id: field.id,
        label: form.label.trim(),
        type: form.type,
        required: form.required,
        placeholder: form.placeholder.trim() || null,
        options,
        order: Number(form.order) || 0,
        isActive: form.isActive,
      });
    } else {
      onSubmit({
        role,
        label: form.label.trim(),
        key: form.key.trim(),
        type: form.type,
        required: form.required,
        placeholder: form.placeholder.trim() || undefined,
        options,
        order: Number(form.order) || 0,
        isActive: form.isActive,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit field" : `Add field for ${humanize(role)}`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField label="Label" value={form.label} onChange={handleLabel} fullWidth required />
          <TextField
            label="Key"
            value={form.key}
            onChange={(e) => {
              setKeyTouched(true);
              set("key")(e);
            }}
            fullWidth
            required
            disabled={isEdit}
            helperText={
              isEdit
                ? "The key can't change after creation."
                : "Machine name stored with the answer (letters, numbers, underscores)."
            }
          />
          <Stack direction="row" spacing={2}>
            <TextField select label="Type" value={form.type} onChange={set("type")} fullWidth>
              {TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {humanize(t)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Order"
              type="number"
              value={form.order}
              onChange={set("order")}
              sx={{ width: 120 }}
              inputProps={{ min: 0 }}
            />
          </Stack>

          {form.type === "SELECT" && (
            <TextField
              label="Options (comma-separated)"
              value={form.options}
              onChange={set("options")}
              fullWidth
              placeholder="e.g. Province 1, Bagmati, Gandaki"
            />
          )}

          <TextField
            label="Placeholder (optional)"
            value={form.placeholder}
            onChange={set("placeholder")}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.required}
                  onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))}
                />
              }
              label="Required"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Stack>

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {isEdit ? "Save" : "Add field"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RoleRequestFieldsPage = () => {
  const [role, setRole] = useState(REQUESTABLE_ROLES[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = useRoleRequestFields({ role, includeInactive: true });
  const { create, update, remove } = useRoleRequestFieldMutations();

  const fields = useMemo(() => query.data ?? [], [query.data]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (field) => {
    setEditing(field);
    setDialogOpen(true);
  };

  const handleSubmit = (payload) => {
    const mutation = editing ? update : create;
    mutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleDelete = (field) => {
    if (window.confirm(`Remove the "${field.label}" field?`)) remove.mutate(field.id);
  };

  return (
    <Box>
      <PageHeader
        title="Role Request Fields"
        subtitle="Configure the extra information applicants must provide for each role they request (e.g. PAN number, registration number)."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Field
          </Button>
        }
      />

      <Tabs value={role} onChange={(_e, v) => setRole(v)} sx={{ mb: 2 }}>
        {REQUESTABLE_ROLES.map((r) => (
          <Tab key={r} value={r} label={humanize(r)} />
        ))}
      </Tabs>

      <QueryState
        query={query}
        isEmpty={fields.length === 0}
        emptyMessage={`No extra fields configured for ${humanize(role)} yet. Applicants will only provide the standard information.`}
      >
        <Stack spacing={1.5}>
          {fields.map((field) => (
            <Card key={field.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography sx={{ fontWeight: 700 }}>{field.label}</Typography>
                      <Chip size="small" label={humanize(field.type)} variant="outlined" />
                      {field.required && <Chip size="small" label="Required" color="primary" />}
                      {!field.isActive && <Chip size="small" label="Inactive" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      key: {field.key}
                      {field.type === "SELECT" && field.options?.length
                        ? ` · options: ${field.options.join(", ")}`
                        : ""}
                    </Typography>
                  </Box>
                  <Stack direction="row">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(field)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(field)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </QueryState>

      <FieldDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitting={create.isLoading || update.isLoading}
        field={editing}
        role={role}
      />
    </Box>
  );
};

export default RoleRequestFieldsPage;
