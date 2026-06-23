// Optional Firebase Cloud Messaging (web push) integration.
//
// Everything here is a no-op unless the VITE_FIREBASE_* env vars are set, so
// the chat works perfectly with just Socket.IO + system notifications. When
// configured, this registers the device's FCM token with the backend and
// surfaces foreground push messages.
import { registerDevice } from "./chat/chat-api";
import { showSystemNotification } from "../utility/notifications";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.messagingSenderId && vapidKey
);

let started = false;

/**
 * Initialise FCM: register the service worker, fetch the device token, send it
 * to the backend, and wire up foreground message handling. Call once after the
 * user is authenticated. Silently returns when push isn't configured.
 */
export const initPushNotifications = async () => {
  if (!isFirebaseConfigured || started) return;
  if (!("serviceWorker" in navigator)) return;
  started = true;

  try {
    const { initializeApp } = await import("firebase/app");
    const { getMessaging, getToken, onMessage } = await import(
      "firebase/messaging"
    );

    const app = initializeApp(config);
    const messaging = getMessaging(app);

    // The background handler lives in /firebase-messaging-sw.js. We pass the
    // config to it via query params so the SW can initialise the same app.
    const swUrl = `/firebase-messaging-sw.js?${new URLSearchParams(config).toString()}`;
    const registration = await navigator.serviceWorker.register(swUrl);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
    if (token) {
      await registerDevice({ token, platform: "web" });
    }

    // Foreground messages don't trigger the SW — show them ourselves.
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title) {
        showSystemNotification(title, { body, onlyWhenHidden: false });
      }
    });
  } catch (err) {
    // Push is best-effort; never let it break the app.
    // eslint-disable-next-line no-console
    console.warn("Push notifications unavailable:", err?.message || err);
    started = false;
  }
};
