import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { STEPS } from "../data";

const MotionGrid = motion.create(Grid);
const MotionBox = motion.create(Box);

const STEP_ICONS = [PetsRoundedIcon, ShareRoundedIcon, FavoriteRoundedIcon];

const HowItWorks = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.primary.alt;
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`;

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "How It" }, { text: "Works", color: "primary" }]}
        sx={{ mb: 1.5 }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: { xs: 5, md: 7 }, textAlign: "center" }}
      >
        Get started in three simple steps — from your first pet to complete care.
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* Dashed connector showing the flow (desktop only) */}
        <Box
          aria-hidden
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: 44,
            left: "18%",
            right: "18%",
            borderTop: "2px dashed",
            borderColor: `${primary}66`,
            zIndex: 0,
          }}
        />

        <MotionGrid
          container
          spacing={{ xs: 5, md: 4 }}
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? PetsRoundedIcon;
            return (
              <MotionGrid item xs={12} md={4} key={step.id} variants={staggerItem}>
                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
                  {/* Gradient icon badge with step-number chip */}
                  <MotionBox
                    whileHover={{ y: -6, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    sx={{
                      position: "relative",
                      width: 88,
                      height: 88,
                      mx: "auto",
                      mb: 3,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      background: gradient,
                      boxShadow: `0 14px 30px -10px ${accent}99`,
                    }}
                  >
                    <Icon sx={{ fontSize: 38 }} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        color: primary,
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      }}
                    >
                      {step.id}
                    </Box>
                  </MotionBox>

                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 300, mx: "auto" }}
                  >
                    {step.desc}
                  </Typography>
                </Box>
              </MotionGrid>
            );
          })}
        </MotionGrid>
      </Box>
    </Container>
  );
};

export default HowItWorks;
