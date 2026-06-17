import { Box, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { PILLARS } from "../data";

const MotionGrid = motion.create(Grid);
const MotionPaper = motion.create(Paper);

const ICONS = {
  track: TravelExploreIcon,
  adopt: FavoriteIcon,
  vets: LocalHospitalIcon,
  care: MedicalServicesIcon,
};

const Pillars = () => {
  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "One Platform," }, { text: "Every Need", color: "primary" }]}
        sx={{ mb: 1 }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", maxWidth: 620, mx: "auto", mb: 5 }}
      >
        From the first sighting of a stray to a lifetime of care — everything you need to look
        after the animals around you lives in one place.
      </Typography>

      <MotionGrid
        container
        spacing={3}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {PILLARS.map((pillar) => {
          const Icon = ICONS[pillar.icon];
          const accent = pillar.accent;
          return (
            <MotionGrid item xs={12} sm={6} md={3} key={pillar.id} variants={staggerItem}>
              <MotionPaper
                elevation={0}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                sx={{
                  position: "relative",
                  height: "100%",
                  p: 3,
                  pt: 3.5,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  // colored accent bar along the top
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${accent}, ${accent}66)`,
                  },
                  "&:hover": {
                    borderColor: `${accent}80`,
                    boxShadow: `0 20px 40px -18px ${accent}66`,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box
                    component={motion.div}
                    whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: `${accent}1A`,
                      color: accent,
                    }}
                  >
                    {Icon && <Icon fontSize="large" />}
                  </Box>
                  <Chip
                    label={pillar.tag}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      color: accent,
                      backgroundColor: `${accent}14`,
                      border: `1px solid ${accent}33`,
                    }}
                  />
                </Stack>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pillar.desc}
                </Typography>

                {pillar.points && (
                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    {pillar.points.map((point) => (
                      <Stack key={point} direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 17, color: accent, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {point}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    color: accent,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    "& .arrow": { transition: "transform 0.25s ease" },
                    "&:hover .arrow": { transform: "translateX(4px)" },
                  }}
                >
                  <span>Learn more</span>
                  <ArrowForwardIcon className="arrow" sx={{ fontSize: 17 }} />
                </Stack>
              </MotionPaper>
            </MotionGrid>
          );
        })}
      </MotionGrid>
    </Container>
  );
};

export default Pillars;
