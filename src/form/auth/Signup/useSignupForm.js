import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupSchema } from "./signupSchema";
import {
  registerRequest,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "../../../api/auth/auth-api";
import { useAuth } from "../../../context/AuthContext";

// "Jane Mary Doe" -> { firstName: "Jane", lastName: "Mary Doe" }
const splitName = (fullName) => {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") || first };
};

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Surface the dev OTP (only returned when no real WhatsApp provider is wired up).
const announceCode = (otp) => {
  if (otp?.devCode) {
    toast(`Dev code: ${otp.devCode}`, { icon: "🔑", duration: 9000 });
  } else {
    toast.success("We sent a verification code to your WhatsApp");
  }
};

/**
 * Drives the two-step signup: (1) the account form, then (2) a WhatsApp OTP
 * step. The account is created (and the user logged in) but we hold off
 * persisting the session / navigating until the user verifies OR chooses
 * "verify later" — so the OTP step can render on the signup page itself.
 */
export const useSignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showValues, setShowValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [pending, setPending] = useState(null); // register response (token, user, otp)
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const register = useMutation((payload) => registerRequest(payload), {
    onSuccess: (data) => {
      // OTP disabled by the super admin → no verification step; enter the app.
      if (data?.otp?.required === false) {
        login(data);
        toast.success("Account created successfully!");
        navigate("/app", { replace: true });
        return;
      }
      setPending(data);
      setStep("otp");
      announceCode(data?.otp);
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

  // Persist the session and enter the app. `user` overrides the cached one
  // (e.g. the now-verified user returned by the verify call).
  const enterApp = (user) => {
    if (!pending) return;
    login({ ...pending, user: user || pending.user });
    navigate("/app", { replace: true });
  };

  const verify = async (code) => {
    if (!pending) return;
    setVerifying(true);
    try {
      const data = await verifyPhoneOtp({ code, token: pending.token });
      toast.success("Phone number verified ✅");
      enterApp(data?.user);
    } catch (error) {
      toast.error(errorMessage(error, "Verification failed"));
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (!pending) return;
    setResending(true);
    try {
      const otp = await sendPhoneOtp(pending.token);
      announceCode(otp);
    } catch (error) {
      toast.error(errorMessage(error, "Could not resend the code"));
    } finally {
      setResending(false);
    }
  };

  // "Verify later" — proceed unverified; the app shows a reminder to verify.
  const verifyLater = () => {
    enterApp();
    toast("You can verify your number later from the banner", { icon: "ℹ️" });
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
    phone: pending?.otp?.phone || formik.values.phone,
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
