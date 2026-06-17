import { Box, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import PetsIcon from "@mui/icons-material/Pets";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CategoryIcon from "@mui/icons-material/Category";
import Counter from "../../../components/motion/Counter";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH } from "../../../constants/layout";
import { STATS } from "../data";

const MotionGrid = motion.create(Grid);
const MotionBox = motion.create(Box);

const ICONS = {
  pets: PetsIcon,
  communities: Diversity3Icon,
  vets: MedicalServicesIcon,
  species: CategoryIcon,
};

const Stats = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme.palette.primary.main,
        color: "#FFFFFF",
        py: { xs: 5, md: 7 },
      }}
    >
      {/* soft decorative glows */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -140,
          right: -60,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ position: "relative" }}>
        <MotionBox
          variants={staggerItem}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.18em", opacity: 0.85, fontWeight: 700 }}
          >
            Trusted by pet lovers everywhere
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
            One growing map for every animal
          </Typography>
        </MotionBox>

        <MotionGrid
          container
          spacing={{ xs: 3, md: 2 }}
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {STATS.map((stat, index) => {
            const Icon = ICONS[stat.icon] ?? PetsIcon;
            return (
              <MotionGrid
                item
                xs={6}
                md={3}
                key={stat.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                sx={{
                  textAlign: "center",
                  position: "relative",
                  // subtle vertical separators on desktop
                  ...(index > 0 && {
                    [theme.breakpoints.up("md")]: {
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "15%",
                        height: "70%",
                        width: "1px",
                        backgroundColor: "rgba(255,255,255,0.18)",
                      },
                    },
                  }),
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(2px)",
                      transition: "transform 0.25s ease, background-color 0.25s ease",
                      ".MuiGrid-item:hover &": {
                        transform: "scale(1.08)",
                        backgroundColor: "rgba(255,255,255,0.24)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 30, color: "#FFFFFF" }} />
                  </Box>

                  <Typography variant="h1" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    <Counter value={stat.value} />
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {stat.label}
                  </Typography>

                  {stat.caption && (
                    <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 180 }}>
                      {stat.caption}
                    </Typography>
                  )}
                </Stack>
              </MotionGrid>
            );
          })}
        </MotionGrid>
      </Container>
    </Box>
  );
};

export default Stats;
