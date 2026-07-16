import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useCategories, useOffers, useBusinesses } from "../../hooks/marketplace/useMarketplace";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/domain";
import {
  CategoryIcon,
  BusinessCard,
  OfferCard,
  SectionHeader,
  SkeletonRows,
  MarketplaceEmpty,
  SponsoredChip,
  BusinessLogo,
} from "./marketplaceUi";
import { MK } from "../../theme/marketplaceTokens";

// Horizontally-scrolling sponsored deals — the design's top-of-home carousel.
const SponsoredCarousel = ({ offers, onOpen }) => (
  <Box sx={{ mt: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <SponsoredChip />
    </Box>
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        pb: 1,
        mx: -0.5,
        px: 0.5,
        scrollSnapType: "x mandatory",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {offers.map((o) => (
        <Paper
          key={o.id}
          elevation={0}
          onClick={() => onOpen(o)}
          sx={{
            flex: "0 0 84%",
            maxWidth: 300,
            scrollSnapAlign: "start",
            p: 2,
            borderRadius: 3,
            cursor: "pointer",
            background: MK.voucher,
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
            <Box sx={{ bgcolor: "rgba(255,255,255,.15)", borderRadius: 2, p: 0.5 }}>
              <BusinessLogo business={o.business} size={36} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                {o.business?.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                {o.business?.primaryCategory?.label}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ bgcolor: "rgba(255,255,255,.15)", borderRadius: 2, px: 1.25, py: 1, mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {o.title}
            </Typography>
          </Box>
          <Button
            fullWidth
            size="small"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ bgcolor: "#fff", color: MK.brand, "&:hover": { bgcolor: "#eee" } }}
          >
            View offer
          </Button>
        </Paper>
      ))}
    </Box>
  </Box>
);

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const categories = useCategories();
  const offers = useOffers({ limit: 8 });
  const topRated = useBusinesses({ sort: "topRated", limit: 5 });

  const isPartner = role === ROLES.PARTNER;
  const offerItems = offers.data?.items || [];
  const sponsored = offerItems.filter((o) => o.isSponsored);
  const carousel = sponsored.length ? sponsored : offerItems.slice(0, 3);

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
        <InputBase placeholder="Search businesses, offers, services…" readOnly sx={{ flex: 1, cursor: "pointer" }} />
      </Paper>

      {/* Become-a-seller CTA (hidden once you're a partner) */}
      {isPartner ? (
        <Paper
          elevation={0}
          onClick={() => navigate("/app/partner")}
          sx={{ mt: 2, p: 2, borderRadius: 3, cursor: "pointer", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <StorefrontRoundedIcon sx={{ color: "primary.main" }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Manage your storefront
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Edit your listing, offers, reviews and enquiries.
            </Typography>
          </Box>
          <ArrowForwardRoundedIcon sx={{ color: "text.disabled" }} />
        </Paper>
      ) : (
        <Paper
          elevation={0}
          onClick={() => navigate("/app/marketplace/sell")}
          sx={{ mt: 2, p: 2, borderRadius: 3, cursor: "pointer", background: MK.voucher, color: "#fff", display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <StorefrontRoundedIcon />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Own a business? Sell on Marketplace
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Get a verified storefront in minutes.
            </Typography>
          </Box>
          <Button size="small" variant="contained" sx={{ bgcolor: "#fff", color: MK.brand, "&:hover": { bgcolor: "#eee" } }}>
            Start
          </Button>
        </Paper>
      )}

      {/* Sponsored carousel */}
      {carousel.length > 0 && (
        <SponsoredCarousel offers={carousel} onOpen={(o) => navigate(`/app/marketplace/offer/${o.id}`)} />
      )}

      {/* Categories */}
      <SectionHeader title="Browse categories" actionLabel="See all" onAction={() => navigate("/app/marketplace/search")} />
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
                    transition: "border-color .15s, transform .15s",
                    "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" },
                  }}
                >
                  <Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: `${c.color}1F`, color: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CategoryIcon name={c.iconName} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {c.label}
                  </Typography>
                  {c.count > 0 && (
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
                      {c.count}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
      </Grid>

      {/* Deals near you */}
      {(offers.isLoading || offerItems.length > 0) && (
        <>
          <SectionHeader title="Deals near you" actionLabel="View all" onAction={() => navigate("/app/marketplace/search")} />
          {offers.isLoading ? (
            <SkeletonRows count={2} height={72} />
          ) : (
            <Stack spacing={1}>
              {offerItems.slice(0, 4).map((o) => (
                <OfferCard key={o.id} offer={o} onOpen={() => navigate(`/app/marketplace/offer/${o.id}`)} />
              ))}
            </Stack>
          )}
        </>
      )}

      {/* Top rated businesses */}
      <SectionHeader title="Top rated" />
      {topRated.isLoading ? (
        <SkeletonRows count={3} />
      ) : topRated.data?.items?.length ? (
        <Stack spacing={1}>
          {topRated.data.items.map((b) => (
            <BusinessCard key={b.id} business={b} onOpen={() => navigate(`/app/marketplace/business/${b.slug}`)} />
          ))}
        </Stack>
      ) : (
        <MarketplaceEmpty
          icon={<StorefrontOutlinedIcon />}
          title="No published businesses yet"
          subtitle="Verified partners will appear here soon — or become the first to sell."
        />
      )}
    </Box>
  );
};

export default MarketplaceHome;
