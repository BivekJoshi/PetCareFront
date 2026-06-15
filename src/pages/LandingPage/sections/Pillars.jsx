import { Box, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
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
  const theme = useTheme();

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "One Platform," }, { text: "Every Need", color: "primary" }]}
        sx={{ mb: 4 }}
      />
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
          return (
            <MotionGrid item xs={12} sm={6} md={3} key={pillar.id} variants={staggerItem}>
              <MotionPaper
                elevation={0}
                whileHover={{ y: -8, boxShadow: "0 18px 36px rgba(0,0,0,0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                sx={{
                  height: "100%",
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: `${theme.palette.primary.main}1A`,
                    color: theme.palette.primary.main,
                  }}
                >
                  {Icon && <Icon fontSize="large" />}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pillar.desc}
                </Typography>
              </MotionPaper>
            </MotionGrid>
          );
        })}
      </MotionGrid>
    </Container>
  );
};

export default Pillars;
