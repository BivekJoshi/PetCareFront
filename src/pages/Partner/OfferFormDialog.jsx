import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const DISCOUNT_TYPES = [
  { value: "PERCENT", label: "% off" },
  { value: "FIXED", label: "$ off" },
  { value: "CUSTOM", label: "Custom deal" },
];
const STATUSES = ["ACTIVE", "SCHEDULED", "PAUSED", "ENDED"];

const blank = {
  title: "",
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  minSpendLabel: "",
  validUntil: "",
  perCustomerLimit: 1,
  status: "ACTIVE",
  terms: "",
};

// Edit when `offer` is provided, create otherwise.
const OfferFormDialog = ({ open, offer, submitting, onClose, onSubmit }) => {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (!open) return;
    if (offer) {
      setForm({
        title: offer.title || "",
        code: offer.code || "",
        discountType: offer.discountType || "PERCENT",
        discountValue:
          offer.discountValue != null
            ? offer.discountType === "FIXED"
              ? offer.discountValue / 100
              : offer.discountValue
            : "",
        minSpendLabel: offer.minSpendLabel || "",
        validUntil: offer.validUntil ? offer.validUntil.slice(0, 10) : "",
        perCustomerLimit: offer.perCustomerLimit ?? 1,
        status: offer.status || "ACTIVE",
        terms: Array.isArray(offer.termsJson) ? offer.termsJson.join("\n") : "",
      });
    } else {
      setForm(blank);
    }
  }, [open, offer]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    const payload = {
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      minSpendLabel: form.minSpendLabel.trim() || null,
      perCustomerLimit: Number(form.perCustomerLimit) || 1,
      status: form.status,
      validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
      terms: form.terms
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (form.discountType === "PERCENT") payload.discountValue = Number(form.discountValue) || 0;
    else if (form.discountType === "FIXED") payload.discountValue = Math.round((Number(form.discountValue) || 0) * 100);
    onSubmit(payload);
  };

  const valid = form.title.trim() && /^[A-Za-z0-9]{2,24}$/.test(form.code.trim());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{offer ? "Edit offer" : "Create offer"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" value={form.title} onChange={set("title")} autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Promo code" value={form.code} onChange={set("code")} helperText="Letters & numbers, 2–24 chars" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField select fullWidth label="Type" value={form.discountType} onChange={set("discountType")}>
              {DISCOUNT_TYPES.map((d) => (
                <MenuItem key={d.value} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {form.discountType !== "CUSTOM" && (
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label={form.discountType === "PERCENT" ? "% value" : "$ value"}
                value={form.discountValue}
                onChange={set("discountValue")}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Min. spend (label)" placeholder="10 kg air freight" value={form.minSpendLabel} onChange={set("minSpendLabel")} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="date" label="Valid until" InputLabelProps={{ shrink: true }} value={form.validUntil} onChange={set("validUntil")} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="number" label="Per customer" value={form.perCustomerLimit} onChange={set("perCustomerLimit")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Status" value={form.status} onChange={set("status")}>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline minRows={2} label="Terms (one per line)" value={form.terms} onChange={set("terms")} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || submitting}>
          {offer ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferFormDialog;
