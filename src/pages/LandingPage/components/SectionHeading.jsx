import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

/**
 * Two-tone centered section heading with a playful animated paw, revealed on
 * scroll. E.g. "Our Services" or "Why Us?".
 *
 * @param {{ segments: { text: string, color?: "primary" | "alt" }[], sx?: object, paw?: boolean }} props
 */
const SectionHeading = ({ segments, sx, paw = true }) => {
  const theme = useTheme();

  const resolveColor = (color) => {
    if (color === "primary") return theme.palette.primary.main;
    if (color === "alt") return theme.palette.primary.alt;
    return "inherit";
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      {paw && (
        <MotionBox
          component="span"
          aria-hidden
          animate={{ rotate: [0, -14, 14, -8, 0], y: [0, -4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          sx={{ fontSize: 30, lineHeight: 1, mb: 0.5 }}
        >
          🐾
        </MotionBox>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", gap: "0.6rem", flexWrap: "wrap" }}>
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
    </MotionBox>
  );
};

export default SectionHeading;
