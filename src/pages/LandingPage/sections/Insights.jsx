import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import Counter from "../../../components/motion/Counter";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { INSIGHTS } from "../data";

const MotionGrid = motion.create(Grid);

const Insights = () => (
  <Box sx={{ backgroundColor: "grey.50" }}>
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Data That" }, { text: "Helps Animals", color: "primary" }]}
        sx={{ mb: 1.5, flexWrap: "wrap" }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: 4, textAlign: "center" }}
      >
        {INSIGHTS.body}
      </Typography>
      <MotionGrid
        container
        spacing={3}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {INSIGHTS.metrics.map((metric) => (
          <MotionGrid item xs={6} md={3} key={metric.id} variants={staggerItem}>
            <Box
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                borderRadius: 3,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h2" color="primary" sx={{ fontWeight: 800 }}>
                <Counter value={metric.value} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {metric.label}
              </Typography>
            </Box>
          </MotionGrid>
        ))}
      </MotionGrid>
    </Container>
  </Box>
);

export default Insights;
