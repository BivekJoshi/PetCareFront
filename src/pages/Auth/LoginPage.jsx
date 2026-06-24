import { useEffect, useState } from "react";
import LoginImage from "../../assets/LogoYeju.svg";
import ImageMobile from "../../assets/ImageMobile.png";
import googleIcon from "../../assets/devicon_google.png";

import "../../app.css";
import { useLoginForm } from "../../form/auth/Login/useLoginForm";
import { useSignupForm } from "../../form/auth/Signup/useSignupForm";
import { useForgotPasswordForm } from "../../form/auth/Forgot/useForgotPasswordForm";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import OtpForm from "../../components/auth/OtpForm";
import {
  RenderForm,
  controlledControl,
} from "../../components/common/RenderInput";
import {
  loginFields,
  signupFields,
  forgotRequestFields,
  forgotResetFields,
} from "../../form/auth/fieldConfigs";
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
import { useGoogleSignIn } from "../../hooks/auth/useGoogleSignIn";
import PostOAuthPhoneDialog from "../../components/auth/PostOAuthPhoneDialog";

const MotionBox = motion(Box);

const EASE = [0.22, 1, 0.36, 1];

/* Per-letter cursive heading reveal */
const AnimatedHeading = ({ text }) => (
  <MotionBox
    initial="hidden"
    animate="show"
    variants={{
      show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
    }}
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
          show: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: { duration: 0.5, ease: EASE },
          },
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

/* ----------------------------- Login form ----------------------------- */
const LoginForm = ({ onSwitch, onForgot, onGoogle, googleLoading }) => {
  const { formik, loading } = useLoginForm();

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
        <RenderForm fields={loginFields} formik={formik} />

        <MotionBox
          variants={item}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel
            control={<Checkbox size="small" color="primary" />}
            label={
              <Typography sx={{ fontSize: "0.875rem" }}>Remember me</Typography>
            }
          />
          <Link
            component="button"
            type="button"
            onClick={onForgot}
            underline="hover"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Forgot password?
          </Link>
        </MotionBox>

        <MotionBox
          variants={item}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
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

        <MotionBox
          variants={item}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <GoogleButton
            label="Sign in with Google"
            onClick={onGoogle}
            loading={googleLoading}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "text.secondary",
              mt: 1,
            }}
          >
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
const SignupForm = ({ onSwitch, onGoogle, googleLoading }) => {
  const {
    formik,
    loading,
    step,
    channel,
    destination,
    stepInfo,
    verify,
    resend,
    verifyLater,
    verifying,
    resending,
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
        <RenderForm fields={signupFields} formik={formik} />

        <MotionBox
          variants={item}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
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

        <MotionBox
          variants={item}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <GoogleButton
            label="Sign up with Google"
            onClick={onGoogle}
            loading={googleLoading}
          />
        </MotionBox>

        <MotionBox variants={item}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "text.secondary",
              mt: 1,
            }}
          >
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

/* -------------------------- Forgot password form ----------------------- */
const ForgotPasswordForm = ({ onBack }) => {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirm,
    setConfirm,
    errors,
    sendCode,
    resend,
    submitReset,
    sending,
    resetting,
  } = useForgotPasswordForm({ onDone: onBack });

  // This flow drives plain useState (not Formik) — `controlledControl` maps each
  // field's state into the same control contract the Formik forms use.
  const requestControl = controlledControl({
    email: {
      value: email,
      set: setEmail,
      error: errors.email,
      onEnter: sendCode,
    },
  });

  const resetControl = controlledControl({
    code: {
      value: code,
      set: (v) => setCode(String(v).replace(/\D/g, "").slice(0, 6)),
      error: errors.code,
    },
    password: { value: password, set: setPassword, error: errors.password },
    confirmPassword: {
      value: confirm,
      set: setConfirm,
      error: errors.confirm,
      onEnter: submitReset,
    },
  });

  // Step 1 — request a reset code by email.
  if (step === "request") {
    return (
      <MotionBox variants={container} initial="hidden" animate="show">
        <MotionBox variants={item}>
          <AnimatedHeading text="Forgot password?" />
        </MotionBox>
        <MotionBox variants={item}>
          <Typography sx={{ color: "text.secondary", mb: 4 }}>
            Enter your account email and we&apos;ll send you a 6-digit reset
            code.
          </Typography>
        </MotionBox>

        <Stack spacing={2.5} component="form" noValidate>
          <RenderForm fields={forgotRequestFields} control={requestControl} />

          <MotionBox
            variants={item}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            <LoadingButton
              loading={sending}
              variant="contained"
              onClick={sendCode}
              fullWidth
              size="large"
              sx={{ py: 1.25, fontSize: "1rem" }}
            >
              Send reset code
            </LoadingButton>
          </MotionBox>

          <MotionBox variants={item}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "text.secondary",
                mt: 1,
              }}
            >
              Remembered it?{" "}
              <Link
                component="button"
                type="button"
                onClick={onBack}
                underline="hover"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                Back to sign in
              </Link>
            </Typography>
          </MotionBox>
        </Stack>
      </MotionBox>
    );
  }

  // Step 2 — enter the code + a new password.
  return (
    <MotionBox variants={container} initial="hidden" animate="show">
      <MotionBox variants={item}>
        <AnimatedHeading text="Check your email 📬" />
      </MotionBox>
      <MotionBox variants={item}>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Enter the 6-digit code we sent to{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
            {email}
          </Box>{" "}
          and choose a new password.
        </Typography>
      </MotionBox>

      <Stack spacing={2.5} component="form" noValidate>
        <RenderForm fields={forgotResetFields} control={resetControl} />

        <MotionBox
          variants={item}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <LoadingButton
            loading={resetting}
            variant="contained"
            onClick={submitReset}
            fullWidth
            size="large"
            sx={{ py: 1.25, fontSize: "1rem" }}
          >
            Reset password
          </LoadingButton>
        </MotionBox>

        <MotionBox variants={item}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            Didn&apos;t get it?{" "}
            <Link
              component="button"
              type="button"
              onClick={resend}
              underline="hover"
              sx={{ fontWeight: 700 }}
            >
              {sending ? "Resending…" : "Resend code"}
            </Link>
            {"  ·  "}
            <Link
              component="button"
              type="button"
              onClick={onBack}
              underline="hover"
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              Back to sign in
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
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });
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
              `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 60%)`,
          ),
        }}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "soft-light",
        }}
      />
    </MotionBox>
  );
};

const GoogleButton = ({ label, onClick, loading = false }) => (
  <LoadingButton
    variant="outlined"
    fullWidth
    size="large"
    onClick={onClick}
    loading={loading}
    loadingPosition="start"
    startIcon={
      <Box
        component="img"
        src={googleIcon}
        alt=""
        sx={{ height: 20, width: 20 }}
      />
    }
    sx={{
      py: 1.15,
      borderColor: "divider",
      color: "text.primary",
      borderRadius: 999,
      "&:hover": {
        borderColor: "text.secondary",
        backgroundColor: "action.hover",
      },
    }}
  >
    {label}
  </LoadingButton>
);

/* ------------------------------ Auth page ------------------------------ */
const LoginPage = ({ initialMode = "login" }) => {
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [mode, setMode] = useState(initialMode);
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  // Signup sits on the right; login & forgot share the left layout.
  // direction: +1 when moving to signup, -1 otherwise.
  const direction = isSignup ? 1 : -1;

  // Already signed in? Skip the auth screen.
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  // Shared "Sign in with Google" flow for both the login and signup forms.
  const {
    start: onGoogle,
    loading: googleLoading,
    pending,
    completePending,
  } = useGoogleSignIn();

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
          md: isSignup ? "row-reverse" : "row",
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
          background:
            "linear-gradient(135deg, #eef6f8 0%, #ffffff 55%, #fbf7e8 100%)",
        }}
      >
        {/* Creative interactive 3D background */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.55,
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
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
            sx={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              display: "block",
              position: "relative",
              zIndex: 1,
            }}
          />
        )}

        <Box
          sx={{
            px: { xs: 3, sm: 6 },
            py: { xs: 4, md: 5 },
            position: "relative",
            zIndex: 1,
            cursor: "pointer",
          }}
          onClick={()=>navigate("/")}
        >
          <Box
            component="img"
            src={LoginImage}
            alt="logo"
            sx={{ height: 70, width: "auto", display: "block" }}
          />
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
                {isLogin && (
                  <LoginForm
                    onSwitch={toggle}
                    onForgot={() => setMode("forgot")}
                    onGoogle={onGoogle}
                    googleLoading={googleLoading}
                  />
                )}
                {isSignup && (
                  <SignupForm
                    onSwitch={toggle}
                    onGoogle={onGoogle}
                    googleLoading={googleLoading}
                  />
                )}
                {mode === "forgot" && (
                  <ForgotPasswordForm onBack={() => setMode("login")} />
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
          sx={{
            width: "45%",
            position: "sticky",
            top: 0,
            height: "100vh",
            p: 2,
          }}
        >
          <TiltCard>
            <ImageCarousel />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
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
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      lineHeight: 1.25,
                      mb: 0.5,
                    }}
                  >
                    {isSignup
                      ? "Every tail deserves a great home."
                      : "Care that your pets can feel."}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {isSignup
                      ? "Join thousands of owners managing their pets with ease."
                      : "Track health, reminders and everything in one place."}
                  </Typography>
                </MotionBox>
              </AnimatePresence>
            </Box>
          </TiltCard>
        </MotionBox>
      )}

      {/* After Google sign-in with no phone on file — collect one (then verify). */}
      {pending && (
        <PostOAuthPhoneDialog
          open={Boolean(pending)}
          token={pending.token}
          onDone={completePending}
        />
      )}
    </MotionBox>
  );
};

export default LoginPage;
