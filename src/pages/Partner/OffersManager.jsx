import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useMyOffers, useOfferMutations } from "../../hooks/marketplace/useMarketplace";
import { OFFER_STATUS } from "../../theme/marketplaceTokens";
import OfferFormDialog from "./OfferFormDialog";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "No expiry");

const OffersManager = () => {
  const query = useMyOffers();
  const { create, update, remove } = useOfferMutations();
  const [dialog, setDialog] = useState({ open: false, offer: null });

  const offers = query.data?.items ?? [];
  const noBusiness = query.isError && query.error?.response?.status === 403;

  const handleSubmit = (payload) => {
    const mutation = dialog.offer ? update : create;
    const args = dialog.offer ? { id: dialog.offer.id, ...payload } : payload;
    mutation.mutate(args, { onSuccess: () => setDialog({ open: false, offer: null }) });
  };

  const handleDelete = (offer) => {
    if (window.confirm(`Delete offer "${offer.title}"?`)) remove.mutate(offer.id);
  };

  return (
    <Box>
      <PageHeader
        title="Offers"
        subtitle="Create promo codes and deals customers can redeem."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, offer: null })}>
            Create offer
          </Button>
        }
      />

      {noBusiness ? (
        <Typography color="text.secondary">Set up your storefront first to create offers.</Typography>
      ) : (
        <QueryState query={query} isEmpty={offers.length === 0} emptyMessage="No offers yet. Create your first promo code.">
          <Stack spacing={1}>
            {offers.map((o) => {
              const st = OFFER_STATUS[o.status] || OFFER_STATUS.ACTIVE;
              return (
                <Paper
                  key={o.id}
                  elevation={0}
                  sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {o.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Code{" "}
                      <Box component="span" sx={{ fontFamily: "monospace", fontWeight: 700, color: "text.primary" }}>
                        {o.code}
                      </Box>{" "}
                      · {o.redeemedCount}
                      {o.usageLimit ? ` / ${o.usageLimit}` : ""} redeemed · Expires {fmtDate(o.validUntil)}
                    </Typography>
                  </Box>
                  <Chip size="small" label={st.label} color={st.color} />
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => setDialog({ open: true, offer: o })}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(o)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Paper>
              );
            })}
          </Stack>
        </QueryState>
      )}

      <OfferFormDialog
        open={dialog.open}
        offer={dialog.offer}
        submitting={create.isLoading || update.isLoading}
        onClose={() => setDialog({ open: false, offer: null })}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default OffersManager;
