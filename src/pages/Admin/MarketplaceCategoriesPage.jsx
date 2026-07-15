import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useCategories, useCategoryMutations } from "../../hooks/marketplace/useMarketplace";
import { CategoryIcon } from "../Marketplace/marketplaceUi";

const blank = { slug: "", label: "", iconName: "store", color: "#5B2EBF", sortOrder: 0, isActive: true };

const CategoryDialog = ({ open, category, submitting, onClose, onSubmit }) => {
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (!open) return;
    setForm(category ? { ...blank, ...category } : blank);
  }, [open, category]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{category ? "Edit category" : "New category"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Label" value={form.label} onChange={set("label")} autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Slug" value={form.slug} onChange={set("slug")} disabled={Boolean(category)} helperText="lowercase-hyphens" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Icon key" value={form.iconName} onChange={set("iconName")} helperText="store, nav, phone…" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Color" value={form.color} onChange={set("color")} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Sort order" value={form.sortOrder} onChange={set("sortOrder")} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center">
              <Switch checked={Boolean(form.isActive)} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              <Typography variant="body2">Active</Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={submitting || !form.label.trim() || !/^[a-z0-9-]+$/.test(form.slug)}
          onClick={() =>
            onSubmit({
              ...(category ? { id: category.id } : {}),
              ...(category ? {} : { slug: form.slug }),
              label: form.label,
              iconName: form.iconName,
              color: form.color,
              sortOrder: Number(form.sortOrder) || 0,
              isActive: form.isActive,
            })
          }
        >
          {category ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MarketplaceCategoriesPage = () => {
  const query = useCategories({ includeInactive: true });
  const { create, update, remove } = useCategoryMutations();
  const [dialog, setDialog] = useState({ open: false, category: null });

  const items = query.data?.items ?? [];

  const handleSubmit = (payload) => {
    const mutation = dialog.category ? update : create;
    mutation.mutate(payload, { onSuccess: () => setDialog({ open: false, category: null }) });
  };

  return (
    <Box>
      <PageHeader
        title="Marketplace categories"
        subtitle="The category tiles customers browse."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, category: null })}>
            New category
          </Button>
        }
      />
      <QueryState query={query} isEmpty={items.length === 0} emptyMessage="No categories yet.">
        <Stack spacing={1}>
          {items.map((c) => (
            <Paper
              key={c.id}
              elevation={0}
              sx={{ p: 1.5, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2, alignItems: "center" }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${c.color}1F`, color: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CategoryIcon name={c.iconName} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {c.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {c.slug} · {c.count ?? 0} businesses
                </Typography>
              </Box>
              {!c.isActive && <Chip size="small" label="Inactive" />}
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => setDialog({ open: true, category: c })}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => window.confirm(`Delete "${c.label}"?`) && remove.mutate(c.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
          ))}
        </Stack>
      </QueryState>

      <CategoryDialog
        open={dialog.open}
        category={dialog.category}
        submitting={create.isLoading || update.isLoading}
        onClose={() => setDialog({ open: false, category: null })}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default MarketplaceCategoriesPage;
