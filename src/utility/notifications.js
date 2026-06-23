// Thin wrapper around the browser Notification API for "normal" system
// notifications (no Firebase required). Used as a fallback / complement to
// in-app toasts when the tab is in the background.

export const notificationsSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

/**
 * Ask for notification permission once. Returns the resulting permission
 * string ("granted" | "denied" | "default"). Safe to call repeatedly.
 */
export const ensureNotificationPermission = async () => {
  if (!notificationsSupported()) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
};

/**
 * Show a system notification. By default it only fires when the tab is hidden
 * (so foreground users get the in-app toast instead). Clicking focuses the
 * window and runs `onClick`.
 */
export const showSystemNotification = (
  title,
  { body, icon = "/vite.svg", tag, onClick, onlyWhenHidden = true } = {}
) => {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  if (onlyWhenHidden && typeof document !== "undefined" && !document.hidden) return;

  try {
    const n = new Notification(title, { body, icon, tag });
    n.onclick = () => {
      window.focus();
      onClick?.();
      n.close();
    };
  } catch {
    /* some browsers throw if called without a user gesture — ignore */
  }
};
