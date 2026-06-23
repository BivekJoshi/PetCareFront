import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupSchema } from "./signupSchema";
import { registerRequest, otpApi } from "../../../api/auth/auth-api";
import { useAuth } from "../../../context/AuthContext";

// "Jane Mary Doe" -> { firstName: "Jane", lastName: "Mary Doe" }
const splitName = (fullName) => {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") || first };
};

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const CHANNEL_NOUN = { email: "email", phone: "WhatsApp" };

// Surface the dev OTP (only returned when a channel has no real sender wired up).
const announce = (step) => {
  if (!step) return;
  if (step.devCode) {
    toast(`Dev code (${CHANNEL_NOUN[step.channel]}): ${step.devCode}`, {
      icon: "🔑",
      duration: 9000,
    });
  } else {
    toast.success(`We sent a code to your ${CHANNEL_NOUN[step.channel]}`);
  }
};

// From the register response's `verification` map, build the ordered list of
// channels that actually need verifying now (enabled + a code was sent).
const buildSteps = (verification = {}) =>
  ["email", "phone"]
    .map((channel) => ({ channel, ...(verification[channel] || {}) }))
    .filter((s) => s.required && s.sent);

/**
 * Drives sign-up: (1) the account form, then (2) one OTP step per enabled
 * verification channel (email and/or WhatsApp). The account is created up front
 * but we hold off persisting the session / navigating until the user verifies
 * every channel OR chooses "verify later" — so the steps render on the sign-up
 * page itself. When no channel is enabled, we go straight into the app.
 */
export const useSignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showValues, setShowValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [pending, setPending] = useState(null); // register response (token, user)
  const [steps, setSteps] = useState([]); // channels still to verify
  const [index, setIndex] = useState(0); // current channel in `steps`
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const current = steps[index] || null;

  const enterApp = (user) => {
    if (!pending) return;
    login({ ...pending, user: user || pending.user });
    navigate("/app", { replace: true });
  };

  const register = useMutation((payload) => registerRequest(payload), {
    onSuccess: (data) => {
      const queue = buildSteps(data?.verification);
      // No verification required → straight into the app.
      if (queue.length === 0) {
        login(data);
        toast.success("Account created successfully!");
        navigate("/app", { replace: true });
        return;
      }
      setPending(data);
      setSteps(queue);
      setIndex(0);
      setStep("otp");
      announce(queue[0]);
    },
    onError: (error) => toast.error(errorMessage(error, "Registration failed")),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: ({ fullName, email, phone, password }) => {
      const { firstName, lastName } = splitName(fullName);
      register.mutate({
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });
    },
  });

  const verify = async (code) => {
    if (!pending || !current) return;
    setVerifying(true);
    try {
      const data = await otpApi[current.channel].verify({
        code,
        token: pending.token,
      });
      // Advance to the next channel, or finish.
      if (index + 1 < steps.length) {
        toast.success(`${CHANNEL_NOUN[current.channel]} verified ✅`);
        setIndex(index + 1);
        announce(steps[index + 1]);
      } else {
        toast.success("You're all verified ✅");
        enterApp(data?.user);
      }
    } catch (error) {
      toast.error(errorMessage(error, "Verification failed"));
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (!pending || !current) return;
    setResending(true);
    try {
      const res = await otpApi[current.channel].send(pending.token);
      announce({ channel: current.channel, ...res });
    } catch (error) {
      toast.error(errorMessage(error, "Could not resend the code"));
    } finally {
      setResending(false);
    }
  };

  // "Verify later" — skip all remaining channels and enter the app.
  const verifyLater = () => {
    enterApp();
    toast("You can verify later from the reminder in your dashboard", {
      icon: "ℹ️",
    });
  };

  const handleClickShowPassword = () =>
    setShowValues((s) => ({ ...s, showPassword: !s.showPassword }));

  const handleClickShowConfirmPassword = () =>
    setShowValues((s) => ({ ...s, showConfirmPassword: !s.showConfirmPassword }));

  const handleMouseDownPassword = (event) => event.preventDefault();

  return {
    formik,
    loading: register.isLoading,
    showValues,
    step,
    // Current verification channel for the OTP step.
    channel: current?.channel || "email",
    destination: current?.destination,
    stepInfo: { current: index + 1, total: steps.length },
    verify,
    resend,
    verifyLater,
    verifying,
    resending,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleMouseDownPassword,
  };
};
