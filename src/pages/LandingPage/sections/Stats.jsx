import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Counter from "../../../components/motion/Counter";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH } from "../../../constants/layout";
import { STATS } from "../data";

const MotionGrid = motion.create(Grid);

const Stats = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, color: "#FFFFFF", py: { xs: 3, md: 4 } }}>
      <Container maxWidth={CONTENT_MAX_WIDTH}>
        <MotionGrid
          container
          spacing={2}
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {STATS.map((stat) => (
            <MotionGrid item xs={6} md={3} key={stat.id} variants={staggerItem} sx={{ textAlign: "center" }}>
              <Typography variant="h1" sx={{ fontWeight: 800 }}>
                <Counter value={stat.value} />
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5 }}>
                {stat.label}
              </Typography>
            </MotionGrid>
          ))}
        </MotionGrid>
      </Container>
    </Box>
  );
};

export default Stats;
