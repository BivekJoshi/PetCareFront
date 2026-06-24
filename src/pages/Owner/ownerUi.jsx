import { Box, CircularProgress, Stack, Typography } from "@mui/material";

// Species → emoji, shared across the owner mobile pages.
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

// Lightweight section header with an optional trailing action.
export const SectionTitle = ({ children, action, sx }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ mt: 3, mb: 1.25, ...sx }}
  >
    <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>{children}</Typography>
    {action}
  </Stack>
);
