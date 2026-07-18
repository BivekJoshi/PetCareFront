import { Box, CircularProgress, Stack, Typography } from "@mui/material";

// Content width cap for the owner app. Below this the layout is fluid; above
// it the column stops growing and centers instead. Deliberately narrow — the
// owner app is a single reading column, not a dashboard, so it keeps the same
// focused shape on a 1920 display as it has on a phone. Consumed by
// OwnerLayout for both the header and the content column.
export const OWNER_MAX_WIDTH = 680;

// Species → emoji, shared across the owner mobile pages. Seeded with sensible
// fallbacks and augmented at runtime from the admin-managed species catalogue
// (see registerSpeciesEmoji, called whenever the species list loads).
export const SPECIES_EMOJI = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🐦",
  RABBIT: "🐰",
  REPTILE: "🦎",
  FISH: "🐠",
  CATTLE: "🐄",
  GOAT: "🐐",
  OTHER: "🐾",
};

// Merge live species (from the API) into the emoji map so custom species added
// by an admin render their chosen emoji everywhere petEmoji() is used.
export const registerSpeciesEmoji = (list = []) => {
  list.forEach((s) => {
    if (s?.key && s?.emoji) SPECIES_EMOJI[s.key] = s.emoji;
  });
};

export const petEmoji = (species) => SPECIES_EMOJI[species] || "🐾";

// Small centered spinner used while a query loads.
export const Loading = ({ py = 6 }) => (
  <Box sx={{ display: "grid", placeItems: "center", py }}>
    <CircularProgress size={28} />
  </Box>
);

// Friendly empty placeholder with an emoji, a title and a hint.
export const EmptyState = ({ emoji = "🐾", title, hint, action }) => (
  <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, textAlign: "center" }}>
    <Box sx={{ fontSize: 46, lineHeight: 1 }}>{emoji}</Box>
    <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
    {hint && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
        {hint}
      </Typography>
    )}
    {action && <Box sx={{ pt: 1 }}>{action}</Box>}
  </Stack>
);

// Lightweight section header with an optional trailing action. Tightens up a
// step on desktop, where the compact density puts more on screen at once.
export const SectionTitle = ({ children, action, sx }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ mt: { xs: 3, md: 2.25 }, mb: { xs: 1.25, md: 1 }, ...sx }}
  >
    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.05rem", md: "0.95rem" } }}>
      {children}
    </Typography>
    {action}
  </Stack>
);

/**
 * One column on a phone; on desktop, as many `min`-wide columns as fit. Used
 * for the pet / appointment / reminder lists so a wide screen shows a grid of
 * compact cards instead of one long stack of stretched rows.
 */
export const CardGrid = ({ min = 320, children, sx }) => (
  <Box
    sx={{
      display: "grid",
      gap: { xs: 1.5, md: 1.5 },
      gridTemplateColumns: {
        xs: "1fr",
        md: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      },
      alignItems: "start",
      ...sx,
    }}
  >
    {children}
  </Box>
);
