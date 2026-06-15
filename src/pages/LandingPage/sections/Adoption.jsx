import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Chip, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { ADOPTION } from "../data";

const MotionGrid = motion.create(Grid);
const MotionCard = motion.create(Card);

const Adoption = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const accent = theme.palette.primary.alt;

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Find Your" }, { text: "Forever Friend", color: "primary" }]}
        sx={{ mb: 1.5 }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: 4, textAlign: "center" }}
      >
        {ADOPTION.body}
      </Typography>

      <MotionGrid
        container
        spacing={3}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {ADOPTION.pets.map((pet) => (
          <MotionGrid item xs={12} sm={6} md={3} key={pet.id} variants={staggerItem}>
            <MotionCard
              elevation={0}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              sx={{
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {/* Animated emoji "portrait" */}
              <Box
                sx={{
                  position: "relative",
                  py: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}1f, ${accent}1f)`,
                }}
              >
                <Box
                  component={motion.div}
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.25 }}
                  sx={{ fontSize: 72, lineHeight: 1 }}
                >
                  {pet.emoji}
                </Box>
                <Chip
                  label={pet.type}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: 700,
                    backgroundColor: "#fff",
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {pet.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pet.detail}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ color: "text.secondary", my: 1 }}
                >
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{pet.location}</Typography>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Box
                      component={motion.span}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      sx={{ display: "inline-flex" }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </Box>
                  }
                  onClick={() => navigate("/login")}
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    borderRadius: 2,
                    backgroundColor: accent,
                    "&:hover": { backgroundColor: accent, filter: "brightness(0.95)" },
                  }}
                >
                  Adopt Me
                </Button>
              </Box>
            </MotionCard>
          </MotionGrid>
        ))}
      </MotionGrid>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ fontWeight: 700, px: 4, borderRadius: 2 }}
          onClick={() => navigate("/login")}
        >
          {ADOPTION.cta}
        </Button>
      </Box>
    </Container>
  );
};

export default Adoption;
