import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import { useSaved, useMyRedemptions } from "../../hooks/marketplace/useMarketplace";
import { BusinessCard, OfferCard } from "./marketplaceUi";

const EmptyState = ({ icon, title, sub }) => (
  <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
    <Box sx={{ mb: 1, "& svg": { fontSize: 40, opacity: 0.5 } }}>{icon}</Box>
    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
      {title}
    </Typography>
    <Typography variant="body2">{sub}</Typography>
  </Box>
);

const MyCollection = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const saved = useSaved();
  const redemptions = useMyRedemptions();

  const savedItems = saved.data?.items || saved.data || [];
  const redeemedItems = redemptions.data?.items || redemptions.data || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
        My collection
      </Typography>
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`Saved${savedItems.length ? ` · ${savedItems.length}` : ""}`} />
        <Tab label={`Redeemed${redeemedItems.length ? ` · ${redeemedItems.length}` : ""}`} />
      </Tabs>

      {tab === 0 &&
        (saved.isLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={92} />
            ))}
          </Stack>
        ) : savedItems.length ? (
          <Stack spacing={1}>
            {savedItems.map((b) => (
              <BusinessCard key={b.id} business={b} onOpen={() => navigate(`/app/marketplace/business/${b.slug}`)} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<BookmarkBorderRoundedIcon />}
            title="Nothing saved yet"
            sub="Bookmark businesses you trust to find them quickly later."
          />
        ))}

      {tab === 1 &&
        (redemptions.isLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={72} />
            ))}
          </Stack>
        ) : redeemedItems.length ? (
          <Stack spacing={1}>
            {redeemedItems.map((o) => (
              <OfferCard key={o.id} offer={o} onOpen={() => navigate(`/app/marketplace/offer/${o.id}`)} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<BookmarkBorderRoundedIcon />}
            title="No redeemed offers"
            sub="Offers you redeem will appear here with their codes."
          />
        ))}
    </Box>
  );
};

export default MyCollection;
