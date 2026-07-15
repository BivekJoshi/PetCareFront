import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, IconButton, InputBase, Paper, Stack, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useBusinesses, useOffers } from "../../hooks/marketplace/useMarketplace";
import { BusinessCard, OfferCard } from "./marketplaceUi";

// Simple debounce for the search term.
const useDebounced = (value, ms = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
};

const SCOPES = ["All", "Businesses", "Offers"];

const MarketplaceSearch = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [scope, setScope] = useState("All");
  const q = useDebounced(term.trim());
  const enabled = q.length >= 2;

  const businesses = useBusinesses(enabled ? { search: q, limit: 20 } : {});
  const offers = useOffers(enabled ? { search: q, limit: 20 } : {});

  const bizItems = useMemo(() => (enabled ? businesses.data?.items || [] : []), [enabled, businesses.data]);
  const offerItems = useMemo(() => (enabled ? offers.data?.items || [] : []), [enabled, offers.data]);

  const showBiz = scope !== "Offers";
  const showOffers = scope !== "Businesses";

  return (
    <Box>
      {/* Search bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Paper
          elevation={0}
          sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider" }}
        >
          <SearchRoundedIcon sx={{ color: "text.disabled" }} />
          <InputBase
            autoFocus
            placeholder="Search businesses, offers…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Paper>
      </Box>

      {/* Scope chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {SCOPES.map((s) => (
          <Chip
            key={s}
            label={s}
            color={scope === s ? "primary" : "default"}
            variant={scope === s ? "filled" : "outlined"}
            onClick={() => setScope(s)}
          />
        ))}
      </Stack>

      {!enabled && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          Type at least 2 characters to search.
        </Typography>
      )}

      {enabled && showBiz && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            Businesses · {bizItems.length}
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {bizItems.map((b) => (
              <BusinessCard key={b.id} business={b} onOpen={() => navigate(`/app/marketplace/business/${b.slug}`)} />
            ))}
            {!bizItems.length && (
              <Typography variant="body2" color="text.secondary">
                No businesses found.
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      {enabled && showOffers && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            Offers · {offerItems.length}
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {offerItems.map((o) => (
              <OfferCard key={o.id} offer={o} onOpen={() => navigate(`/app/marketplace/offer/${o.id}`)} />
            ))}
            {!offerItems.length && (
              <Typography variant="body2" color="text.secondary">
                No offers found.
              </Typography>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default MarketplaceSearch;
