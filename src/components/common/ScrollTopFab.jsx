import { useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

const MotionBox = motion(Box);

/**
 * Floating "back to top" button. Stays hidden until the page is scrolled past
 * `threshold`, then fades/scales in at the bottom-right. Smooth-scrolls the
 * window to the top on click. Styled with the brand gradient so it reads as a
 * primary affordance in either light or dark mode.
 */
const ScrollTopFab = ({ threshold = 320 }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll(); // sync on mount in case we land mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollUp = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <Tooltip title="Back to top" placement="left">
          <MotionBox
            component="button"
            type="button"
            aria-label="Scroll back to top"
            onClick={scrollUp}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            sx={{
              position: "fixed",
              bottom: { xs: 20, md: 32 },
              right: { xs: 20, md: 32 },
              zIndex: (t) => t.zIndex.tooltip,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              border: "none",
              cursor: "pointer",
              borderRadius: "50%",
              color: "#fff",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 6px 12px -4px ${alpha(
                theme.palette.primary.main,
                0.5
              )}`,
            }}
          >
            <KeyboardArrowUpRoundedIcon />
          </MotionBox>
        </Tooltip>
      )}
    </AnimatePresence>
  );
};

export default ScrollTopFab;
