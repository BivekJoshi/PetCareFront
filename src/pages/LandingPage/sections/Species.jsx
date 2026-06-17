import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { SPECIES } from "../data";

const MotionGrid = motion.create(Grid);
const MotionPaper = motion.create(Paper);

const Species = () => (
  <Box sx={{ backgroundColor: "grey.50" }}>
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Every" }, { text: "Animal Counts", color: "primary" }]}
        sx={{ mb: 1.5 }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: 4, textAlign: "center" }}
      >
        Not just dogs. We help communities track, care for and rehome every kind
        of pet and street animal.
      </Typography>
      <MotionGrid
        container
        spacing={2}
        justifyContent="center"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {SPECIES.map((species) => {
          const tint = species.tint;
          return (
            <MotionGrid item xs={6} sm={4} md={3} key={species.id} variants={staggerItem}>
              <MotionPaper
                elevation={0}
                whileHover={{ y: -6, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                sx={{
                  py: 3,
                  px: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    borderColor: `${tint}80`,
                    boxShadow: `0 16px 32px -16px ${tint}80`,
                  },
                }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ rotate: [0, -15, 15, -8, 0], scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: 38,
                    lineHeight: 1,
                    backgroundColor: `${tint}1A`,
                  }}
                >
                  {species.emoji}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1.5 }}>
                  {species.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: tint, mt: 0.25 }}>
                  {species.count} tracked
                </Typography>
              </MotionPaper>
            </MotionGrid>
          );
        })}
      </MotionGrid>
    </Container>
  </Box>
);

export default Species;
