import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useCategories, useOffers, useBusinesses } from "../../hooks/marketplace/useMarketplace";
import { CategoryIcon, BusinessCard, OfferCard } from "./marketplaceUi";
import { MK } from "../../theme/marketplaceTokens";

const SectionTitle = ({ title, actionLabel, onAction }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25, mt: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {actionLabel && (
      <Typography
        variant="body2"
        onClick={onAction}
        sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}
      >
        {actionLabel}
      </Typography>
    )}
  </Box>
);

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const categories = useCategories();
  const offers = useOffers({ limit: 5 });
  const topRated = useBusinesses({ sort: "topRated", limit: 5 });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Marketplace
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Trusted local businesses & offers
        </Typography>
      </Box>

      {/* Search */}
      <Paper
        elevation={0}
        onClick={() => navigate("/app/marketplace/search")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1.25,
          borderRadius: 3,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
        }}
      >
        <SearchRoundedIcon sx={{ color: "text.disabled" }} />
        <InputBase
          placeholder="Search businesses, offers, services…"
          readOnly
          sx={{ flex: 1, cursor: "pointer" }}
        />
      </Paper>

      {/* Categories */}
      <SectionTitle title="Browse categories" />
      <Grid container spacing={1.25}>
        {categories.isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={3} key={i}>
                <Skeleton variant="rounded" height={84} />
              </Grid>
            ))
          : (categories.data?.items || []).map((c) => (
              <Grid item xs={3} key={c.id}>
                <Box
                  onClick={() => navigate(`/app/marketplace/category/${c.slug}`)}
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 1,
                    py: 1.5,
                    textAlign: "center",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2.5,
                      bgcolor: `${c.color}1F`,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CategoryIcon name={c.iconName} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {c.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
      </Grid>

      {/* Deals near you */}
      {(offers.isLoading || offers.data?.items?.length > 0) && (
        <>
          <SectionTitle
            title="Deals near you"
            actionLabel="View all"
            onAction={() => navigate("/app/marketplace/search")}
          />
          <Stack spacing={1}>
            {offers.isLoading
              ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} variant="rounded" height={72} />)
              : offers.data.items.map((o) => (
                  <OfferCard key={o.id} offer={o} onOpen={() => navigate(`/app/marketplace/offer/${o.id}`)} />
                ))}
          </Stack>
        </>
      )}

      {/* Top rated businesses */}
      <SectionTitle title="Top rated" />
      <Stack spacing={1}>
        {topRated.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={92} />)
        ) : topRated.data?.items?.length ? (
          topRated.data.items.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              onOpen={() => navigate(`/app/marketplace/business/${b.slug}`)}
            />
          ))
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              bgcolor: "#fff",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              color: MK.ink4,
            }}
          >
            <Typography variant="body2">No published businesses yet — check back soon.</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default MarketplaceHome;
