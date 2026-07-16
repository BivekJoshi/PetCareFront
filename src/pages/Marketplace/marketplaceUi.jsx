import { Avatar, Box, Button, Chip, Rating, Skeleton, Stack, Typography } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { MK } from "../../theme/marketplaceTokens";

// Design icon-key → MUI icon component (matches Marketplace Design categories).
const ICONS = {
  store: StorefrontOutlinedIcon,
  nav: FlightTakeoffOutlinedIcon,
  phone: PhoneIphoneOutlinedIcon,
  info: SchoolOutlinedIcon,
  flag: PublicOutlinedIcon,
  tag: LocalOfferOutlinedIcon,
  home: HomeWorkOutlinedIcon,
  user: WorkOutlineOutlinedIcon,
  check: GavelOutlinedIcon,
  swap: CurrencyExchangeOutlinedIcon,
  verified: VerifiedUserOutlinedIcon,
  bolt: CelebrationOutlinedIcon,
};

export const CategoryIcon = ({ name, ...props }) => {
  const Cmp = ICONS[name] || CategoryOutlinedIcon;
  return <Cmp {...props} />;
};

const PALETTE = ["#E76F2E", "#1F6FEB", "#0F9D58", "#7A3FCF", "#B26A00", "#C0362C", "#0E7C7B", "#5B2EBF"];

export const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

export const colorFor = (seed = "") => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

// Square logo block — the business logo image, or coloured initials fallback.
export const BusinessLogo = ({ business = {}, size = 44, radius = 12 }) => {
  const color = business.primaryCategory?.color || colorFor(business.name || business.id || "");
  return (
    <Avatar
      variant="rounded"
      src={business.logoUrl || undefined}
      sx={{
        width: size,
        height: size,
        borderRadius: `${radius}px`,
        bgcolor: business.logoUrl ? "transparent" : `${color}1F`,
        color,
        fontWeight: 700,
        fontSize: size * 0.36,
      }}
    >
      {initialsOf(business.name)}
    </Avatar>
  );
};

export const VerifiedBadge = ({ size = "small" }) => (
  <Chip
    size={size}
    icon={<VerifiedRoundedIcon sx={{ color: `${MK.green} !important` }} />}
    label="Verified"
    sx={{ bgcolor: MK.greenSoft, color: MK.green, fontWeight: 600, height: 24, "& .MuiChip-label": { px: 0.75 } }}
  />
);

export const SponsoredChip = ({ size = "small" }) => (
  <Chip
    size={size}
    label="Sponsored"
    sx={{
      bgcolor: MK.sponsoredBg,
      color: MK.sponsoredFg,
      border: `1px solid ${MK.sponsoredBorder}`,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: "0.04em",
      height: 22,
    }}
  />
);

// Compact rating row: ★ 4.8 (1,240)
export const RatingRow = ({ value = 0, count = 0, size = "small" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Rating value={Number(value) || 0} precision={0.1} readOnly size={size} />
    <Typography variant="caption" sx={{ fontWeight: 700 }}>
      {Number(value || 0).toFixed(1)}
    </Typography>
    {count != null && (
      <Typography variant="caption" color="text.secondary">
        ({Number(count).toLocaleString()})
      </Typography>
    )}
  </Box>
);

export const LocationLine = ({ area }) =>
  area?.name ? (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25, color: "text.secondary" }}>
      <PlaceOutlinedIcon sx={{ fontSize: 14 }} />
      <Typography variant="caption">{area.name}</Typography>
    </Box>
  ) : null;

// The cheapest listed price as a short label ("From $14/kg" or "From $12.00").
export const priceHint = (business) => {
  const s = business?.services?.[0];
  if (!s) return null;
  if (s.priceLabel) return s.priceLabel;
  if (s.priceCents != null) return `From $${(s.priceCents / 100).toFixed(2)}`;
  return null;
};

// ── Layout primitives (shared across marketplace screens) ──────────
export const SectionHeader = ({ title, actionLabel, onAction, sx }) => (
  <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1.25, mt: 3, ...sx }}>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {actionLabel && (
      <Typography variant="body2" onClick={onAction} sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}>
        {actionLabel}
      </Typography>
    )}
  </Box>
);

export const MarketplaceEmpty = ({ icon, title, subtitle, action }) => (
  <Box sx={{ textAlign: "center", py: 6, px: 2, bgcolor: "background.paper", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
    {icon && (
      <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: MK.brandSoft, color: MK.brand, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, "& svg": { fontSize: 26 } }}>
        {icon}
      </Box>
    )}
    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340, mx: "auto", mt: 0.5 }}>
        {subtitle}
      </Typography>
    )}
    {action && <Box sx={{ mt: 2 }}>{action}</Box>}
  </Box>
);

export const SkeletonRows = ({ count = 3, height = 92 }) => (
  <Stack spacing={1}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant="rounded" height={height} />
    ))}
  </Stack>
);

// A single labelled figure used in the business-detail stat strip.
export const StatTile = ({ value, label, sub }) => (
  <Box sx={{ textAlign: "center", flex: 1, px: 1 }}>
    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
      {value}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0.25 }}>
      {sub}
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Box>
);

// A business row/card used on home, category, search and saved screens.
export const BusinessCard = ({ business, onOpen, action }) => {
  const price = priceHint(business);
  const hasOffer = Array.isArray(business.offers) && business.offers.length > 0;
  return (
    <Box
      onClick={onOpen}
      sx={{
        p: 1.75,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        cursor: onOpen ? "pointer" : "default",
        transition: "border-color .15s, box-shadow .15s, transform .15s",
        "&:hover": onOpen ? { borderColor: "primary.main", boxShadow: 3 } : undefined,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <BusinessLogo business={business} size={48} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              {business.name}
            </Typography>
            {business.isVerified && <VerifiedRoundedIcon sx={{ fontSize: 15, color: MK.green }} />}
          </Box>
          {(business.tagline || business.secondaryTag) && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }} noWrap>
              {business.tagline || business.secondaryTag}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <RatingRow value={business.ratingAvg} count={business.ratingCount} />
            <LocationLine area={business.area} />
          </Box>
        </Box>
        {action}
      </Box>
      {(price || hasOffer) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.25,
            pt: 1.25,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
            {price || " "}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {hasOffer && (
              <Chip size="small" label="Offer" sx={{ bgcolor: MK.brandSoft, color: MK.brand, fontWeight: 700, height: 22 }} />
            )}
            {onOpen && <ChevronRightRoundedIcon sx={{ color: "text.disabled" }} />}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

// Short "Ends 28 Oct" / "3 days left" hint for an offer's expiry.
const expiryHint = (validUntil) => {
  if (!validUntil) return null;
  const end = new Date(validUntil);
  const days = Math.ceil((end.getTime() - Date.now()) / 86400000);
  if (days < 0) return { text: "Ended", urgent: false };
  if (days === 0) return { text: "Ends today", urgent: true };
  if (days <= 7) return { text: `${days} day${days > 1 ? "s" : ""} left`, urgent: true };
  return { text: `Ends ${end.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`, urgent: false };
};

// A promo/offer row used on home ("Deals near you"), search and offer lists.
export const OfferCard = ({ offer, onOpen }) => {
  const exp = expiryHint(offer.validUntil);
  return (
    <Box
      onClick={onOpen}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        cursor: onOpen ? "pointer" : "default",
        transition: "border-color .15s",
        "&:hover": onOpen ? { borderColor: "primary.main" } : undefined,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: MK.brandSoft,
          color: MK.brand,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <LocalOfferOutlinedIcon />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
          {offer.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
          {offer.business?.name}
          {offer.code ? " · " : ""}
          <Box component="span" sx={{ fontFamily: "monospace", color: "text.primary" }}>
            {offer.code}
          </Box>
          {exp ? " · " : ""}
          {exp && (
            <Box component="span" sx={{ color: exp.urgent ? MK.amber : "text.secondary", fontWeight: 600 }}>
              {exp.text}
            </Box>
          )}
        </Typography>
      </Box>
      {offer.isSponsored && <SponsoredChip />}
    </Box>
  );
};
