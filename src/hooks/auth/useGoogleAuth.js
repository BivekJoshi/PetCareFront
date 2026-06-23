import { useCallback, useEffect, useRef, useState } from "react";

// Google Identity Services. We use the OAuth 2.0 token model so the user can
// trigger sign-in from our own custom-styled button (rather than Google's
// rendered widget). The resulting access token is sent to the backend, which
// validates it and returns our session.
const GSI_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-identity-services";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Load the GSI script once; resolve when the OAuth2 namespace is available.
const loadGsi = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("gsi-load-failed")));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gsi-load-failed"));
    document.body.appendChild(script);
  });

/**
 * Loads Google Identity Services and exposes `signIn()`, which opens Google's
 * consent popup and resolves with an OAuth access token. `configured` is false
 * when no client ID is set, so callers can disable the Google button.
 */
export const useGoogleAuth = () => {
  const configured = Boolean(CLIENT_ID);
  const [ready, setReady] = useState(false);
  const tokenClientRef = useRef(null);
  const callbackRef = useRef(null);

  useEffect(() => {
    if (!configured) return;
    let active = true;

    loadGsi()
      .then(() => {
        if (!active) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: "openid email profile",
          // Routed through a ref so each signIn() call gets its own resolver.
          callback: (response) => callbackRef.current?.(response),
        });
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      active = false;
    };
  }, [configured]);

  const signIn = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!tokenClientRef.current) {
          reject(new Error("Google sign-in is not ready yet"));
          return;
        }
        callbackRef.current = (response) => {
          if (response?.error) {
            reject(new Error(response.error_description || response.error));
          } else if (response?.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error("Google sign-in was cancelled"));
          }
        };
        tokenClientRef.current.requestAccessToken();
      }),
    []
  );

  return { configured, ready, signIn };
};
