import { useEffect, useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Logo from "../../assets/YejuLogo.png";
import ResButton from "../ResponsiveComponent/ResButton";
import { CONTENT_MAX_WIDTH } from "../../constants/layout";
import { NAV_SECTIONS, SCROLL_OFFSET } from "../../constants/navigation";

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [hoveredId, setHoveredId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up (and always show near the top).
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest > previous && latest > 120) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  // Highlight whichever section is currently in view.
  useEffect(() => {
    const handler = () => {
      const offset = SCROLL_OFFSET + 40;
      let current = NAV_SECTIONS[0].id;
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const goToSection = (id) => {
    closeMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    } else {
      // Not on the landing page — go there first, then let it settle.
      navigate("/home");
    }
  };

  const accent = theme.palette.primary.alt;
  const highlightId = hoveredId ?? activeId;

  const brand = (
    <MotionBox
      component="img"
      src={Logo}
      alt="Yejus Paw"
      onClick={() => goToSection("home")}
      whileHover={{ scale: 1.08, rotate: [0, -6, 6, -3, 0] }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
      sx={{ height: 48, cursor: "pointer", display: "block" }}
    />
  );

  return (
    <MotionBox
      component={motion.header}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <MotionBox
        animate={{
          backgroundColor: scrolled
            ? "rgba(69, 187, 189, 0.82)"
            : "rgba(69, 187, 189, 1)",
          backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
          boxShadow: scrolled
            ? "0 10px 30px -12px rgba(48, 111, 107, 0.55)"
            : "0 0px 0px 0px rgba(48, 111, 107, 0)",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        sx={{ WebkitBackdropFilter: scrolled ? "blur(10px)" : "none" }}
      >
        <Container maxWidth={CONTENT_MAX_WIDTH}>
          <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 56, md: 64 } }}>
            {isMobile && (
              <IconButton
                aria-label="toggle navigation menu"
                onClick={() => setMobileOpen((prev) => !prev)}
                sx={{ color: "white" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "inline-flex" }}
                  >
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                  </motion.span>
                </AnimatePresence>
              </IconButton>
            )}

            {brand}

            {/* Desktop nav links with a sliding "magic" highlight */}
            <Box
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {NAV_SECTIONS.map((item) => {
                const isHighlighted = highlightId === item.id;
                return (
                  <MotionBox
                    key={item.id}
                    onClick={() => goToSection(item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    whileTap={{ scale: 0.92 }}
                    sx={{
                      position: "relative",
                      px: 1.75,
                      py: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                  >
                    {isHighlighted && (
                      <MotionBox
                        layoutId="nav-highlight"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.16)",
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        position: "relative",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        whiteSpace: "nowrap",
                        opacity: activeId === item.id ? 1 : 0.9,
                      }}
                    >
                      {item.label}
                    </Typography>
                    {activeId === item.id && (
                      <MotionBox
                        layoutId="nav-underline"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        sx={{
                          position: "absolute",
                          left: 12,
                          right: 12,
                          bottom: 2,
                          height: 3,
                          borderRadius: 2,
                          backgroundColor: accent,
                        }}
                      />
                    )}
                  </MotionBox>
                );
              })}
            </Box>

            {/* Login — pinned to the far right on every breakpoint */}
            <MotionBox
              sx={{ ml: "auto" }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <ResButton
                onClick={() => navigate("/login")}
                backgroundColor={accent}
                content="Login"
              />
            </MotionBox>
          </Toolbar>
        </Container>
      </MotionBox>

      {/* Animated mobile dropdown menu */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <MotionBox
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            sx={{
              overflow: "hidden",
              backgroundColor: theme.palette.primary.main,
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Container maxWidth={CONTENT_MAX_WIDTH}>
              <Box sx={{ py: 1.5, display: "flex", flexDirection: "column" }}>
                {NAV_SECTIONS.map((item, index) => (
                  <MotionTypography
                    key={item.id}
                    onClick={() => goToSection(item.id)}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ delay: 0.06 * index + 0.05 }}
                    whileTap={{ scale: 0.97, x: 6 }}
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                      py: 1.25,
                      px: 1,
                      borderRadius: 1.5,
                      borderLeft:
                        activeId === item.id
                          ? `4px solid ${accent}`
                          : "4px solid transparent",
                      backgroundColor:
                        activeId === item.id
                          ? "rgba(255,255,255,0.10)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.10)",
                      },
                    }}
                  >
                    {item.label}
                  </MotionTypography>
                ))}
              </Box>
            </Container>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default Navbar;
