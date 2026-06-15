import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { EASE } from "./variants";

const MotionBox = motion.create(Box);

/**
 * Reveals its children with a fade/slide as they scroll into view.
 *
 * @param {{ delay?: number, y?: number, sx?: object, children: React.ReactNode }} props
 */
const Reveal = ({ children, delay = 0, y = 36, sx }) => (
  <MotionBox
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
    }}
    sx={sx}
  >
    {children}
  </MotionBox>
);

export default Reveal;
