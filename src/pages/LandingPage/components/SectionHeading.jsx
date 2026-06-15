import { Box, Typography, useTheme } from "@mui/material";

/**
 * Two-tone centered section heading used across the landing page,
 * e.g. "Our Services" or "Why Us?".
 *
 * @param {{ segments: { text: string, color?: "primary" | "alt" }[], sx?: object }} props
 */
const SectionHeading = ({ segments, sx }) => {
  const theme = useTheme();

  const resolveColor = (color) => {
    if (color === "primary") return theme.palette.primary.main;
    if (color === "alt") return theme.palette.primary.alt;
    return "inherit";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        ...sx,
      }}
    >
      {segments.map((segment) => (
        <Typography
          key={segment.text}
          variant="h2"
          sx={{ fontWeight: 700, color: resolveColor(segment.color) }}
        >
          {segment.text}
        </Typography>
      ))}
    </Box>
  );
};

export default SectionHeading;
