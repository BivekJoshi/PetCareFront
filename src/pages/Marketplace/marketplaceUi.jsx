import { Avatar, Box, Chip, Rating, Typography } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
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

// A business row/card used on home, category, search and saved screens.
export const BusinessCard = ({ business, onOpen, action }) => (
  <Box
    onClick={onOpen}
    sx={{
      display: "flex",
      gap: 1.5,
      p: 1.75,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      cursor: onOpen ? "pointer" : "default",
      transition: "border-color .15s, box-shadow .15s",
      "&:hover": onOpen ? { borderColor: "primary.main", boxShadow: 2 } : undefined,
    }}
  >
    <BusinessLogo business={business} size={48} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
          {business.name}
        </Typography>
        {business.isVerified && <VerifiedRoundedIcon sx={{ fontSize: 15, color: MK.green }} />}
      </Box>
      {business.tagline && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }} noWrap>
          {business.tagline}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <RatingRow value={business.ratingAvg} count={business.ratingCount} />
        <LocationLine area={business.area} />
      </Box>
    </Box>
    {action}
  </Box>
);

// A promo/offer row used on home ("Deals near you"), search and offer lists.
export const OfferCard = ({ offer, onOpen }) => (
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
      "&:hover": onOpen ? { borderColor: "primary.main" } : undefined,
    }}
  >
    <Box
      sx={{
        width: 42,
        height: 42,
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
      </Typography>
    </Box>
    {offer.isSponsored && <SponsoredChip />}
  </Box>
);
