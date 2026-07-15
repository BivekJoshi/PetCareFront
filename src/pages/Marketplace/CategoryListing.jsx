import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { useBusinesses, useCategories } from "../../hooks/marketplace/useMarketplace";
import { BusinessCard } from "./marketplaceUi";

const SORTS = [
  { value: "topRated", label: "Top rated" },
  { value: "mostReviewed", label: "Most reviewed" },
  { value: "newest", label: "Newest" },
];

const CategoryListing = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highRated, setHighRated] = useState(false);
  const [sort, setSort] = useState("topRated");
  const [anchor, setAnchor] = useState(null);

  const categories = useCategories();
  const category = (categories.data?.items || []).find((c) => c.slug === slug);

  const query = useBusinesses({
    categorySlug: slug,
    verifiedOnly: verifiedOnly || undefined,
    minRating: highRated ? 4 : undefined,
    sort,
    limit: 50,
  });
  const items = query.data?.items || [];
  const total = query.data?.meta?.total ?? 0;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {category?.label || "Category"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {total} {total === 1 ? "listing" : "listings"}
          </Typography>
        </Box>
      </Box>

      {/* Filter bar */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: "auto", pb: 0.5 }}>
        <Chip
          label="Verified"
          color={verifiedOnly ? "primary" : "default"}
          variant={verifiedOnly ? "filled" : "outlined"}
          onClick={() => setVerifiedOnly((v) => !v)}
        />
        <Chip
          label="Rating 4+"
          color={highRated ? "primary" : "default"}
          variant={highRated ? "filled" : "outlined"}
          onClick={() => setHighRated((v) => !v)}
        />
        <Chip
          icon={<SwapVertRoundedIcon />}
          label={SORTS.find((s) => s.value === sort)?.label}
          variant="outlined"
          onClick={(e) => setAnchor(e.currentTarget)}
        />
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          {SORTS.map((s) => (
            <MenuItem
              key={s.value}
              selected={s.value === sort}
              onClick={() => {
                setSort(s.value);
                setAnchor(null);
              }}
            >
              {s.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <Stack spacing={1}>
        {query.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={92} />)
        ) : items.length ? (
          items.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              onOpen={() => navigate(`/app/marketplace/business/${b.slug}`)}
            />
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
            <Typography variant="body2">No businesses match these filters.</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default CategoryListing;
