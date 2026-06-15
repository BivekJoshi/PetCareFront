import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { STEPS } from "../data";

const MotionGrid = motion.create(Grid);

const HowItWorks = () => {
  const theme = useTheme();

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "How It" }, { text: "Works", color: "primary" }]}
        sx={{ mb: 4 }}
      />
      <MotionGrid
        container
        spacing={4}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STEPS.map((step) => (
          <MotionGrid item xs={12} md={4} key={step.id} variants={staggerItem}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  color: `${theme.palette.primary.main}33`,
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {step.id}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {step.desc}
              </Typography>
            </Box>
          </MotionGrid>
        ))}
      </MotionGrid>
    </Container>
  );
};

export default HowItWorks;
