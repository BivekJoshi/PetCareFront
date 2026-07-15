import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useOffer, useOfferMutations } from "../../hooks/marketplace/useMarketplace";
import { MK } from "../../theme/marketplaceTokens";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "No expiry");

const discountLabel = (o) => {
  if (o.discountType === "PERCENT") return `${o.discountValue}% off`;
  if (o.discountType === "FIXED") return `$${(o.discountValue / 100).toFixed(2)} off`;
  return "Special deal";
};

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useOffer(id);
  const { redeem } = useOfferMutations();
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  const offer = query.data;

  if (query.isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (query.isError || !offer) {
    return <Alert severity="error">This offer could not be found.</Alert>;
  }

  const terms = Array.isArray(offer.termsJson) ? offer.termsJson : [];

  const copyCode = () => {
    navigator.clipboard?.writeText(offer.code);
    setCopied(true);
  };

  const doRedeem = () => {
    redeem.mutate(offer.id, { onSuccess: () => setRedeemed(true) });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Offer
        </Typography>
      </Box>

      {/* Voucher */}
      <Box sx={{ background: MK.voucher, color: "#fff", borderRadius: 3, p: 2.5, mb: 3 }}>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {offer.business?.name}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          {offer.title}
        </Typography>
        <Divider sx={{ borderColor: "rgba(255,255,255,.25)", my: 1.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: "0.08em" }}>
              PROMO CODE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em" }}>
              {offer.code}
            </Typography>
          </Box>
          <Button
            onClick={copyCode}
            startIcon={<ContentCopyRoundedIcon />}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}
            variant="outlined"
          >
            Copy
          </Button>
        </Box>
      </Box>

      {/* Details */}
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", mb: 3 }}>
        {[
          { l: "Discount", v: discountLabel(offer) },
          { l: "Min. spend", v: offer.minSpendLabel || "—" },
          { l: "Valid until", v: fmtDate(offer.validUntil) },
          { l: "Usage", v: `${offer.perCustomerLimit} per customer` },
        ].map((row, i) => (
          <Box
            key={row.l}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1.5,
              borderTop: i ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {row.l}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.v}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Terms */}
      {terms.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Terms & conditions
          </Typography>
          <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
            {terms.map((t, i) => (
              <Typography component="li" variant="caption" color="text.secondary" key={i}>
                {t}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      <Button fullWidth size="large" variant="contained" onClick={doRedeem} disabled={redeem.isLoading || redeemed}>
        {redeemed ? "Redeemed ✓" : `Use offer at ${offer.business?.name}`}
      </Button>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message="Code copied" />
      <Snackbar
        open={redeemed}
        autoHideDuration={3000}
        onClose={() => setRedeemed(false)}
        message={`Redeemed — show code ${offer.code} at the merchant`}
      />
    </Box>
  );
};

export default OfferDetail;
