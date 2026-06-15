import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Container, Stack, Typography, useTheme } from "@mui/material";
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

const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);

// Pets of every kind drift in the background. `depth` controls parallax travel.
const FLOATERS = [
  { emoji: "🐶", top: "16%", left: "7%", size: 52, duration: 6, depth: 55 },
  { emoji: "🐱", top: "24%", left: "87%", size: 46, duration: 7, depth: 45 },
  { emoji: "🐴", top: "66%", left: "10%", size: 54, duration: 8, depth: 60 },
  { emoji: "🐮", top: "72%", left: "85%", size: 50, duration: 6.5, depth: 50 },
  { emoji: "🐔", top: "12%", left: "66%", size: 40, duration: 7.5, depth: 35 },
  { emoji: "🐐", top: "56%", left: "92%", size: 42, duration: 6, depth: 40 },
  { emoji: "🐰", top: "82%", left: "44%", size: 42, duration: 7.2, depth: 38 },
  { emoji: "🐦", top: "13%", left: "36%", size: 38, duration: 8.5, depth: 30 },
  { emoji: "🐾", top: "46%", left: "4%", size: 34, duration: 9, depth: 28 },
  { emoji: "🦴", top: "40%", left: "80%", size: 34, duration: 8, depth: 32 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Floater = ({ data, mx, my, reduceMotion }) => {
  const x = useTransform(mx, [-0.5, 0.5], [-data.depth, data.depth]);
  const y = useTransform(my, [-0.5, 0.5], [-data.depth, data.depth]);

  return (
    <MotionBox
      aria-hidden
      style={reduceMotion ? undefined : { x, y }}
      sx={{
        position: "absolute",
        top: data.top,
        left: data.left,
        display: { xs: "none", sm: "block" },
        pointerEvents: "none",
      }}
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0 }}
        animate={
          reduceMotion
            ? { opacity: 0.92, scale: 1 }
            : { opacity: 0.92, scale: 1, y: [0, -16, 0], rotate: [0, 6, -6, 0] }
        }
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          scale: { duration: 0.7, delay: 0.3, type: "spring", stiffness: 200 },
          y: { duration: data.duration, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: data.duration * 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.45, opacity: 1 }}
        sx={{
          fontSize: { sm: data.size * 0.8, md: data.size },
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "auto",
          cursor: "grab",
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.14))",
        }}
      >
        {data.emoji}
      </MotionBox>
    </MotionBox>
  );
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

  // Pointer position (-0.5 → 0.5), smoothed for buttery parallax.
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
          opacity: 0.55,
        }}
      />

      {/* Parallax colour blobs */}
      <Blob
        color={`${primary}55`}
        depth={35}
        pulse={[1, 1.12, 0.96, 1]}
        sx={{ width: 460, height: 460, top: -120, left: -90 }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />
      <Blob
        color={`${accent}40`}
        depth={45}
        pulse={[1, 1.08, 0.94, 1]}
        sx={{ width: 520, height: 520, bottom: -160, right: -120 }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />
      <Blob
        color="#F8D15244"
        depth={25}
        pulse={[1, 1.15, 0.9, 1]}
        sx={{ width: 380, height: 380, top: "28%", right: "12%" }}
        mx={mx}
        my={my}
        reduceMotion={reduceMotion}
      />

      {/* Floating pets */}
      {FLOATERS.map((data) => (
        <Floater
          key={data.emoji}
          data={data}
          mx={mx}
          my={my}
          reduceMotion={reduceMotion}
        />
      ))}

      {/* Content */}
      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ position: "relative", zIndex: 1, py: 6 }}>
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
                backgroundColor: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${primary}55`,
                boxShadow: "0 6px 20px -8px rgba(48,111,107,0.4)",
              }}
            />
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                fontSize: { xs: "2.3rem", sm: "3.1rem", md: "4.1rem" },
                maxWidth: 920,
                mx: "auto",
                color: "#15302E",
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
                  background: `linear-gradient(90deg, ${primary}, ${accent}, ${primary})`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Cared For
              </MotionBox>
            </Typography>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", maxWidth: 640, mx: "auto", fontWeight: 400 }}
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
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <ResButton
                endIcon={<ChevronRightIcon />}
                backgroundColor={accent}
                color="white"
                content={HERO.primaryCta}
                onClick={() => navigate("/login")}
              />
            </MotionBox>
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
            <Typography variant="body2" sx={{ color: "text.secondary", opacity: 0.8 }}>
              🐶 Dogs · 🐱 Cats · 🐴 Horses · 🐮 Cows · 🐔 Hens · and every creature in between
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
