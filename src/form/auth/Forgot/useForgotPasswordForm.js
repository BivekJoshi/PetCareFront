import { useState } from "react";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import {
  forgotPasswordRequest,
  resetPasswordRequest,
} from "../../../api/auth/auth-api";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Surface the dev reset code (only returned when no real mailer is configured).
const announce = (res) => {
  if (res?.devCode) {
    toast(`Dev reset code (email): ${res.devCode}`, { icon: "🔑", duration: 9000 });
  } else {
    toast.success("If that email is registered, a reset code is on its way");
  }
};

/**
 * Drives the "forgot password" flow in two steps:
 *   1. "request" — enter the account email; we email a 6-digit reset code.
 *   2. "reset"   — enter the code + a new password (with confirmation).
 * `onDone()` is called after a successful reset (the page returns to sign-in).
 */
export const useForgotPasswordForm = ({ onDone } = {}) => {
  const [step, setStep] = useState("request"); // "request" | "reset"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const request = useMutation((payload) => forgotPasswordRequest(payload), {
    onSuccess: (data) => {
      announce(data);
      setStep("reset");
    },
    onError: (error) =>
      toast.error(errorMessage(error, "Could not send a reset code")),
  });

  const reset = useMutation((payload) => resetPasswordRequest(payload), {
    onSuccess: () => {
      toast.success("Password reset — sign in with your new password");
      onDone?.();
    },
    onError: (error) =>
      toast.error(errorMessage(error, "Could not reset your password")),
  });

  const sendCode = () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setErrors({});
    request.mutate({ email: value });
  };

  const resend = () => {
    if (request.isLoading) return;
    request.mutate({ email: email.trim() });
  };

  const submitReset = () => {
    const e = {};
    if (!/^\d{6}$/.test(code)) e.code = "Enter the 6-digit code";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (confirm !== password) e.confirm = "Passwords do not match";
    setErrors(e);
    if (Object.keys(e).length) return;
    reset.mutate({
      email: email.trim(),
      code,
      password,
      confirmPassword: confirm,
    });
  };

  return {
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
    showPw,
    toggleShowPw: () => setShowPw((s) => !s),
    sendCode,
    resend,
    submitReset,
    sending: request.isLoading,
    resetting: reset.isLoading,
    backToRequest: () => setStep("request"),
  };
};
