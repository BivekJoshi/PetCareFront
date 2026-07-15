import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { useMyBusiness, useMyBusinessMutations, useCategories } from "../../hooks/marketplace/useMarketplace";
import { uploadBusinessImage } from "../../api/marketplace/marketplace-api";
import LocationPicker from "../../components/common/map/LocationPicker";
import { BusinessLogo } from "../Marketplace/marketplaceUi";
import { BUSINESS_STATUS, MK } from "../../theme/marketplaceTokens";
import NoStorefront from "./NoStorefront";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  tagline: "",
  secondaryTag: "",
  description: "",
  categorySlug: "",
  phone: "",
  whatsapp: "",
  website: "",
  logoUrl: "",
  coverUrl: "",
  latitude: null,
  longitude: null,
  services: [],
};

const ImageUploadButton = ({ label, onUploaded }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadBusinessImage(file);
      onUploaded(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" hidden onChange={onPick} />
      <Button
        size="small"
        variant="outlined"
        startIcon={busy ? <CircularProgress size={14} /> : <PhotoCameraRoundedIcon />}
        onClick={() => ref.current?.click()}
        disabled={busy}
      >
        {label}
      </Button>
    </>
  );
};

const ListingEditor = () => {
  const { data: business, isLoading, isError, error } = useMyBusiness();
  const { update, submit } = useMyBusinessMutations();
  const categories = useCategories();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(emptyForm);

  // Seed the form once the business loads.
  useEffect(() => {
    if (!business) return;
    setForm({
      name: business.name || "",
      tagline: business.tagline || "",
      secondaryTag: business.secondaryTag || "",
      description: business.description || "",
      categorySlug: business.primaryCategory?.slug || "",
      phone: business.phone || "",
      whatsapp: business.whatsapp || "",
      website: business.website || "",
      logoUrl: business.logoUrl || "",
      coverUrl: business.coverUrl || "",
      latitude: business.latitude ?? null,
      longitude: business.longitude ?? null,
      services: (business.services || []).map((s) => ({ name: s.name, priceLabel: s.priceLabel || "" })),
    });
  }, [business]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  // 404 → no business profile for this user
  if (isError && error?.response?.status === 404) return <NoStorefront />;
  if (isError || !business) return <NoStorefront />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const statusMeta = BUSINESS_STATUS[business.status] || BUSINESS_STATUS.DRAFT;

  const setService = (i, key, val) =>
    setForm((f) => ({ ...f, services: f.services.map((s, j) => (j === i ? { ...s, [key]: val } : s)) }));
  const addService = () => setForm((f) => ({ ...f, services: [...f.services, { name: "", priceLabel: "" }] }));
  const removeService = (i) => setForm((f) => ({ ...f, services: f.services.filter((_, j) => j !== i) }));

  const save = () => {
    const payload = {
      ...form,
      services: form.services.filter((s) => s.name.trim()),
      categorySlug: form.categorySlug || null,
    };
    update.mutate(payload);
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3, alignItems: { sm: "center" } }}>
        <BusinessLogo business={{ ...business, ...form }} size={52} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {form.name || "Your storefront"}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label={statusMeta.label} color={statusMeta.color} />
            {business.slug && (
              <Button
                size="small"
                endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
                href={`/#/m/${business.slug}`}
                target="_blank"
                sx={{ minWidth: 0 }}
              >
                View public page
              </Button>
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={save} disabled={update.isLoading}>
            {update.isLoading ? "Saving…" : "Save"}
          </Button>
          <Button
            variant="contained"
            onClick={() => submit.mutate()}
            disabled={submit.isLoading || business.status === "PUBLISHED"}
          >
            {business.status === "PUBLISHED" ? "Live" : "Submit for review"}
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)} variant="scrollable" sx={{ borderBottom: "1px solid", borderColor: "divider", px: 1 }}>
          <Tab label="Basics" />
          <Tab label="Services & pricing" />
          <Tab label="Photos" />
          <Tab label="Location" />
          <Tab label="Contact" />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Basics */}
          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Business name" value={form.name} onChange={set("name")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Category" value={form.categorySlug} onChange={set("categorySlug")}>
                  <MenuItem value="">— None —</MenuItem>
                  {(categories.data?.items || []).map((c) => (
                    <MenuItem key={c.id} value={c.slug}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Secondary tag" placeholder="e.g. Sydney → Kathmandu" value={form.secondaryTag} onChange={set("secondaryTag")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tagline" value={form.tagline} onChange={set("tagline")} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline minRows={4} label="Description (markdown)" value={form.description} onChange={set("description")} />
              </Grid>
            </Grid>
          )}

          {/* Services */}
          {tab === 1 && (
            <Stack spacing={1.5}>
              {form.services.map((s, i) => (
                <Stack key={i} direction="row" spacing={1} alignItems="center">
                  <TextField fullWidth size="small" label="Service" value={s.name} onChange={(e) => setService(i, "name", e.target.value)} />
                  <TextField size="small" label="Price" placeholder="From $14/kg" value={s.priceLabel} onChange={(e) => setService(i, "priceLabel", e.target.value)} sx={{ width: 200 }} />
                  <IconButton onClick={() => removeService(i)} size="small">
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button startIcon={<AddRoundedIcon />} onClick={addService} sx={{ alignSelf: "flex-start" }}>
                Add service
              </Button>
            </Stack>
          )}

          {/* Photos */}
          {tab === 2 && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Logo
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BusinessLogo business={{ ...business, ...form }} size={72} />
                  <ImageUploadButton label="Upload logo" onUploaded={(url) => setForm((f) => ({ ...f, logoUrl: url }))} />
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Cover
                </Typography>
                <Box
                  sx={{
                    height: 120,
                    borderRadius: 3,
                    mb: 1,
                    background: form.coverUrl ? `url(${form.coverUrl}) center/cover` : `linear-gradient(135deg, ${MK.brand}, ${MK.brandDeep})`,
                  }}
                />
                <ImageUploadButton label="Upload cover" onUploaded={(url) => setForm((f) => ({ ...f, coverUrl: url }))} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Uploads save when you click “Save”.
              </Typography>
            </Stack>
          )}

          {/* Location */}
          {tab === 3 && (
            <LocationPicker
              label="Where customers find you"
              value={{ latitude: form.latitude, longitude: form.longitude }}
              onChange={({ latitude, longitude }) => setForm((f) => ({ ...f, latitude, longitude }))}
            />
          )}

          {/* Contact */}
          {tab === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone" value={form.phone} onChange={set("phone")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="WhatsApp" value={form.whatsapp} onChange={set("whatsapp")} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Website" placeholder="https://…" value={form.website} onChange={set("website")} />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ListingEditor;
