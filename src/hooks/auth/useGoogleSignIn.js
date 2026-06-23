import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGoogleAuth } from "./useGoogleAuth";
import { googleAuthRequest } from "../../api/auth/auth-api";
import { useAuth } from "../../context/AuthContext";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Full "Sign in with Google" flow. Opens Google's consent popup, exchanges the
 * access token for a PetCare session, then:
 *   • if the account already has a phone → persist + go to the app, or
 *   • if not (`needsPhone`) → hold the session and surface a phone-collection
 *     dialog; only once the user submits or skips do we persist + navigate.
 *
 * Holding the session until the dialog resolves keeps the user on the auth page
 * (persisting immediately would trip the "already signed in" redirect).
 */
export const useGoogleSignIn = () => {
  const { configured, signIn } = useGoogleAuth();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // session awaiting a phone number

  const enterApp = (data) => {
    login(data);
    navigate("/app", { replace: true });
  };

  const start = async () => {
    if (!configured) {
      toast.error("Google sign-in isn't configured");
      return;
    }
    setLoading(true);
    try {
      const accessToken = await signIn();
      const data = await googleAuthRequest({ accessToken });
      if (data?.needsPhone) {
        setPending(data); // collect a phone before persisting the session
      } else {
        toast.success("Signed in with Google");
        enterApp(data);
      }
    } catch (error) {
      // A user who closes the popup shouldn't see a scary error.
      if (!/cancel|closed|popup/i.test(error?.message || "")) {
        toast.error(errorMessage(error, "Google sign-in failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Called by the phone dialog once the user submits (with a fresh user) or
  // skips (no arg). Either way we persist and head into the app.
  const completePending = (user) => {
    if (!pending) return;
    const data = { ...pending, user: user || pending.user };
    setPending(null);
    toast.success("Welcome to PetCare 🐾");
    enterApp(data);
  };

  return {
    configured,
    loading,
    start,
    pending,
    completePending,
  };
};
