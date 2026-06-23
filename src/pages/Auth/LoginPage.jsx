import { useEffect, useState } from "react";
import LoginImage from "../../assets/Logo-login.png";
import ImageMobile from "../../assets/ImageMobile.png";
import googleIcon from "../../assets/devicon_google.png";

import "../../app.css";
import TextField from "@mui/material/TextField";
import { useLoginForm } from "../../form/auth/Login/useLoginForm";
import { useSignupForm } from "../../form/auth/Signup/useSignupForm";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import OtpForm from "../../components/auth/OtpForm";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import AuthBackground from "./AuthBackground";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MotionBox = motion(Box);

const EASE = [0.22, 1, 0.36, 1];

/* Per-letter cursive heading reveal */
const AnimatedHeading = ({ text }) => (
  <MotionBox
    initial="hidden"
    animate="show"
    variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
    sx={{
      fontFamily: '"Kaushan Script", cursive',
      fontWeight: 400,
      fontSize: { xs: "2rem", sm: "2.6rem" },
      color: "text.primary",
      mb: 0.5,
      display: "flex",
      flexWrap: "wrap",
    }}
  >
    {text.split("").map((ch, i) => (
      <motion.span
        key={`${ch}-${i}`}
        variants={{
          hidden: { opacity: 0, y: 24, rotate: -8 },
          show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        style={{ display: "inline-block", whiteSpace: "pre" }}
      >
        {ch}
      </motion.span>
    ))}
  </MotionBox>
);

// Staggered entrance for the fields inside a form
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

// Direction-aware swap for the whole form block
const formVariants = {
  enter: (dir) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: (dir) => ({
    x: dir > 0 ? -70 : 70,
    opacity: 0,
    transition: { duration: 0.35, ease: "easeIn" },
  }),
};

const labelSx = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "text.primary",
  mb: 0.75,
};

/* ----------------------------- Login form ----------------------------- */
const LoginForm = ({ onSwitch }) => {
  const {
    formik,
    showValues,
    loading,
    handleClickShowPassword,
    handleMouseDownPassword,
  } = useLoginForm();

  return (
    <MotionBox variants={container} initial="hidden" animate="show">
      <MotionBox variants={item}>
        <AnimatedHeading text="Welcome back 👋" />
      </MotionBox>
      <MotionBox variants={item}>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Sign in to continue managing your pets.
        </Typography>
      </MotionBox>

      <Stack spacing={2.5} component="form" noValidate>
        <MotionBox variants={item}>
          <Typography sx={labelSx}>Email</Typography>
          <TextField
            required
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            placeholder="you@example.com"
            fullWidth
            variant="outlined"
            type="text"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={labelSx}>Password</Typography>
          <TextField
            required
            name="password"
            variant="outlined"
            placeholder="Enter your password"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                formik.handleSubmit();
                ev.preventDefault();
              }
            }}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            type={showValues.showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showValues.showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox
          variants={item}
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <FormControlLabel
            control={<Checkbox size="small" color="primary" />}
            label={<Typography sx={{ fontSize: "0.875rem" }}>Remember me</Typography>}
          />
          <Link
            href="#"
            underline="hover"
            sx={{ fontSize: "0.875rem", fontWeight: 600, color: "primary.main" }}
          >
            Forgot password?
          </Link>
        </MotionBox>

        <MotionBox variants={item} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={() => formik.submitForm()}
            fullWidth
            size="large"
            sx={{ py: 1.25, fontSize: "1rem" }}
          >
            Sign in
          </LoadingButton>
        </MotionBox>

        <MotionBox variants={item}>
          <Divider sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
            or continue with
          </Divider>
        </MotionBox>

        <MotionBox variants={item} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
          <GoogleButton label="Sign in with Google" />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={{ textAlign: "center", fontSize: "0.875rem", color: "text.secondary", mt: 1 }}>
            Don&apos;t have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={onSwitch}
              underline="hover"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Sign up
            </Link>
          </Typography>
        </MotionBox>
      </Stack>
    </MotionBox>
  );
};

/* ----------------------------- Sign up form ---------------------------- */
const SignupForm = ({ onSwitch }) => {
  const {
    formik,
    loading,
    showValues,
    step,
    channel,
    destination,
    stepInfo,
    verify,
    resend,
    verifyLater,
    verifying,
    resending,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleMouseDownPassword,
  } = useSignupForm();

  // Step 2 — OTP verification (one step per enabled channel).
  if (step === "otp") {
    const multi = stepInfo.total > 1;
    return (
      <MotionBox variants={container} initial="hidden" animate="show">
        <MotionBox variants={item}>
          <AnimatedHeading text="One last step ✨" />
        </MotionBox>
        <MotionBox variants={item} sx={{ mb: 3 }}>
          <Typography sx={{ color: "text.secondary" }}>
            {multi
              ? `Verify your details (${stepInfo.current} of ${stepInfo.total}) — or do it later.`
              : "Confirm the code we just sent — or do it later."}
          </Typography>
        </MotionBox>
        <MotionBox variants={item}>
          <OtpForm
            channel={channel}
            destination={destination}
            onVerify={verify}
            onResend={resend}
            onSkip={verifyLater}
            verifying={verifying}
            resending={resending}
            skipLabel="Verify later"
          />
        </MotionBox>
      </MotionBox>
    );
  }

  return (
    <MotionBox variants={container} initial="hidden" animate="show">
      <MotionBox variants={item}>
        <AnimatedHeading text="Join the pack 🐾" />
      </MotionBox>
      <MotionBox variants={item}>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Create your account and start caring smarter.
        </Typography>
      </MotionBox>

      <Stack spacing={2.5} component="form" noValidate>
        <MotionBox variants={item}>
          <Typography sx={labelSx}>Full name</Typography>
          <TextField
            required
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            placeholder="Jane Doe"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlineIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={labelSx}>Email</Typography>
          <TextField
            required
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            placeholder="you@example.com"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={labelSx}>WhatsApp number</Typography>
          <TextField
            required
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={
              (formik.touched.phone && formik.errors.phone) ||
              "Include country code — we'll send a verification code here"
            }
            placeholder="+9779812345678"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PhoneIphoneIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={labelSx}>Password</Typography>
          <TextField
            required
            name="password"
            placeholder="Create a password"
            fullWidth
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            type={showValues.showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showValues.showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={labelSx}>Confirm password</Typography>
          <TextField
            required
            name="confirmPassword"
            placeholder="Re-enter your password"
            fullWidth
            variant="outlined"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                formik.handleSubmit();
                ev.preventDefault();
              }
            }}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            type={showValues.showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showValues.showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <MotionBox variants={item} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={() => formik.submitForm()}
            fullWidth
            size="large"
            sx={{ py: 1.25, fontSize: "1rem" }}
          >
            Create account
          </LoadingButton>
        </MotionBox>

        <MotionBox variants={item}>
          <Divider sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
            or sign up with
          </Divider>
        </MotionBox>

        <MotionBox variants={item} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
          <GoogleButton label="Sign up with Google" />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography sx={{ textAlign: "center", fontSize: "0.875rem", color: "text.secondary", mt: 1 }}>
            Already have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={onSwitch}
              underline="hover"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Sign in
            </Link>
          </Typography>
        </MotionBox>
      </Stack>
    </MotionBox>
  );
};

/* Slowly cross-fading random pet images (Ken Burns) */
const SLIDES = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=900&q=80",
];

const ImageCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AnimatePresence>
        <MotionBox
          key={idx}
          component="img"
          src={SLIDES[idx]}
          onError={(e) => {
            e.currentTarget.src = ImageMobile;
          }}
          alt="Pets"
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.6, ease: "easeInOut" },
            scale: { duration: 6.2, ease: "easeOut" },
          }}
          sx={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </AnimatePresence>
    </Box>
  );
};

/* Mouse-tilt 3D card with a moving light shine */
const TiltCard = ({ children }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 18 });
  const shineX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const shineY = useTransform(my, [0, 1], ["0%", "100%"]);

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <MotionBox
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 30px 60px -25px rgba(0,0,0,0.45)",
        perspective: 1000,
      }}
    >
      {children}
      <MotionBox
        aria-hidden
        style={{
          background: useTransform(
            [shineX, shineY],
            ([x, y]) =>
              `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 60%)`
          ),
        }}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "soft-light" }}
      />
    </MotionBox>
  );
};

const GoogleButton = ({ label }) => (
  <Button
    variant="outlined"
    fullWidth
    size="large"
    startIcon={
      <Box component="img" src={googleIcon} alt="" sx={{ height: 20, width: 20 }} />
    }
    sx={{
      py: 1.15,
      borderColor: "divider",
      color: "text.primary",
      borderRadius: 999,
      "&:hover": { borderColor: "text.secondary", backgroundColor: "action.hover" },
    }}
  >
    {label}
  </Button>
);

/* ------------------------------ Auth page ------------------------------ */
const LoginPage = ({ initialMode = "login" }) => {
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [mode, setMode] = useState(initialMode);
  const isLogin = mode === "login";
  // direction: +1 when moving to signup, -1 when moving to login
  const direction = isLogin ? -1 : 1;

  // Already signed in? Skip the auth screen.
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  const toggle = () => setMode((m) => (m === "login" ? "signup" : "login"));

  const panelSpring = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 };

  return (
    <MotionBox
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: isLogin ? "row" : "row-reverse",
        },
        bgcolor: "background.default",
      }}
    >
      {/* Form panel — swaps sides with the image */}
      <MotionBox
        layout
        transition={panelSpring}
        sx={{
          width: { xs: "100%", md: "55%" },
          display: "flex",
          flexDirection: "column",
          minHeight: { md: "100vh" },
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #eef6f8 0%, #ffffff 55%, #fbf7e8 100%)",
        }}
      >
        {/* Creative interactive 3D background */}
        <Box
          aria-hidden
          sx={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, filter: "blur(1px)", pointerEvents: "none" }}
        >
          <AuthBackground mode={mode} />
        </Box>

        {/* Light-sweep wipe that fires on each mode switch */}
        <AnimatePresence>
          <MotionBox
            key={mode}
            aria-hidden
            initial={{ x: "-40%", opacity: 0 }}
            animate={{ x: "140%", opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.85, ease: EASE }}
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "45%",
              zIndex: 2,
              pointerEvents: "none",
              transform: "skewX(-12deg)",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(69,187,189,0.35) 50%, rgba(255,255,255,0) 100%)",
              filter: "blur(6px)",
            }}
          />
        </AnimatePresence>
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0) 100%)",
          }}
        />

        {isXsScreen && (
          <Box
            component="img"
            src={ImageMobile}
            alt=""
            sx={{ width: "100%", height: 180, objectFit: "cover", display: "block", position: "relative", zIndex: 1 }}
          />
        )}

        <Box sx={{ px: { xs: 3, sm: 6 }, py: { xs: 4, md: 5 }, position: "relative", zIndex: 1 }}>
          <Box component="img" src={LoginImage} alt="logo" sx={{ height: 40, width: "auto", display: "block" }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6 },
            pb: 6,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <MotionBox
                key={mode}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {isLogin ? (
                  <LoginForm onSwitch={toggle} />
                ) : (
                  <SignupForm onSwitch={toggle} />
                )}
              </MotionBox>
            </AnimatePresence>
          </Box>
        </Box>
      </MotionBox>

      {/* Image panel — swaps sides with the form */}
      {!isXsScreen && (
        <MotionBox
          layout
          transition={panelSpring}
          sx={{ width: "45%", position: "sticky", top: 0, height: "100vh", p: 2 }}
        >
          <TiltCard>
            <ImageCarousel />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            <Box sx={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
              <AnimatePresence mode="wait">
                <MotionBox
                  key={mode}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.25, mb: 0.5 }}>
                    {isLogin ? "Care that your pets can feel." : "Every tail deserves a great home."}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
                    {isLogin
                      ? "Track health, reminders and everything in one place."
                      : "Join thousands of owners managing their pets with ease."}
                  </Typography>
                </MotionBox>
              </AnimatePresence>
            </Box>
          </TiltCard>
        </MotionBox>
      )}
    </MotionBox>
  );
};

export default LoginPage;
