import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import ResButton from "../../../components/ResponsiveComponent/ResButton";
import { CONTENT_MAX_WIDTH } from "../../../constants/layout";
import { HERO } from "../data";
import petHeroVideo from "../../../assets/Videos/petHero.mp4";

// Three.js is heavy — load the 3D pet field only when the hero renders.
const PetField = lazy(() => import("../components/PetField"));

const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Blob = ({ color, depth, pulse, sx, mx, my, reduceMotion }) => {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth]);

  return (
    <MotionBox
      aria-hidden
      style={reduceMotion ? undefined : { x, y }}
      animate={reduceMotion ? undefined : { scale: pulse }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      sx={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(70px)",
        background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        pointerEvents: "none",
        ...sx,
      }}
    />
  );
};

const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const accent = theme.palette.primary.alt;
  const primary = theme.palette.primary.main;

  // Pointer position (-0.5 → 0.5), smoothed for buttery blob parallax.
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 50, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 50, damping: 18 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mxRaw.set((event.clientX - rect.left) / rect.width - 0.5);
    myRaw.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    mxRaw.set(0);
    myRaw.set(0);
  };

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      onMouseMove={reduceMotion ? undefined : handlePointerMove}
      onMouseLeave={reduceMotion ? undefined : resetPointer}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
        // Pad below the fixed navbar so content centers in the visible area.
        pt: { xs: "56px", md: "64px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background:
          "linear-gradient(160deg, #FDF7DE 0%, #EAFBFB 55%, #FFFFFF 100%)",
      }}
    >
      {/* Background video watermark */}
      <Box
        component="video"
        src={petHeroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.52,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Slowly rotating aurora wash */}
      <MotionBox
        aria-hidden
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          inset: "-60%",
          background: `conic-gradient(from 0deg, ${primary}22, ${accent}1f, #F8D15226, ${primary}22)`,
          filter: "blur(50px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Parallax colour blobs */}
      <Blob
        color={`${primary}55`}
        depth={35}
        pulse={[1, 1.12, 0.96, 1]}
        sx={{ width: 460, height: 460, top: -120, left: -90, zIndex: 0 }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />
      <Blob
        color={`${accent}40`}
        depth={45}
        pulse={[1, 1.08, 0.94, 1]}
        sx={{ width: 520, height: 520, bottom: -160, right: -120, zIndex: 0 }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />
      <Blob
        color="#F8D15244"
        depth={25}
        pulse={[1, 1.15, 0.9, 1]}
        sx={{ width: 380, height: 380, top: "28%", right: "12%", zIndex: 0 }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />

      {/* 3D floating pets (Three.js) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Suspense fallback={null}>
          <PetField reduceMotion={reduceMotion} />
        </Suspense>
      </Box>

      {/* Content */}
      <Container
        maxWidth={CONTENT_MAX_WIDTH}
        sx={{ position: "relative", zIndex: 1, py: 6 }}
      >
        <MotionStack
          variants={containerVariants}
          initial="hidden"
          animate="show"
          spacing={3}
          alignItems="center"
        >
          <MotionBox variants={itemVariants}>
            <Chip
              label={HERO.badge}
              sx={{
                px: 1,
                py: 2.2,
                fontWeight: 700,
                fontSize: "0.85rem",
                color: primary,
                backgroundColor: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px) saturate(140%)",
                WebkitBackdropFilter: "blur(12px) saturate(140%)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow:
                  "0 6px 24px -10px rgba(48,111,107,0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            />
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Baloo 2", system-ui, sans-serif',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.8rem" },
                maxWidth: 960,
                mx: "auto",
                color: "#13302C",
                textShadow:
                  "0 2px 4px rgba(255,255,255,0.55), 0 6px 22px rgba(255,255,255,0.45)",
              }}
            >
              Every Pet in Your Community,{" "}
              <MotionBox
                component="span"
                animate={
                  reduceMotion
                    ? undefined
                    : { backgroundPosition: ["0% 50%", "200% 50%"] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                sx={{
                  display: "inline-block",
                  fontFamily: '"Kaushan Script", cursive',
                  fontWeight: 400,
                  fontSize: "1.2em",
                  lineHeight: 1.3,
                  pr: "0.1em",
                  background: `linear-gradient(90deg, #FF7A00, #FFA033, #FF7A00)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#FB9C43",
                  filter: "drop-shadow(0 2px 6px rgba(255,122,0,0.15))",
                }}
              >
                Cared For
              </MotionBox>
            </Typography>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                maxWidth: 640,
                mx: "auto",
                fontWeight:"bold"
              }}
            >
              {HERO.subtitle}
            </Typography>
          </MotionBox>

          <MotionStack
            variants={itemVariants}
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              endIcon={<ChevronRightIcon />}
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700, px: 3 }}
              onClick={() => navigate("/login")}
            >
              {HERO.primaryCta}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 700, px: 3 }}
              onClick={scrollToNext}
            >
              {HERO.secondaryCta}
            </Button>
          </MotionStack>

          <MotionBox variants={itemVariants}>
            <Typography
              variant="body2"
              sx={{ opacity: 0.85 }}
            >
              🐶 Dogs · 🐱 Cats  · 🐮 Cows · 🐔 Hens · and every
              creature in between
            </Typography>
          </MotionBox>
        </MotionStack>
      </Container>

      {/* Scroll cue */}
      <MotionBox
        aria-hidden
        onClick={scrollToNext}
        initial={{ opacity: 0, x: "-50%" }}
        animate={
          reduceMotion
            ? { opacity: 1, x: "-50%" }
            : { opacity: 1, x: "-50%", y: [0, 10, 0] }
        }
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          color: primary,
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </MotionBox>
    </Box>
  );
};

export default Hero;
