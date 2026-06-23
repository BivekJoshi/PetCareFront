// Presentation helpers shared across pages.

export const formatPrice = (cents) =>
  typeof cents === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      }).format(cents / 100)
    : "—";

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

// Format a Date for an <input type="datetime-local"> value.
export const toDateTimeLocal = (date = new Date()) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export const fullName = (user) =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "—";

// Prefer a viewer-set nickname over the real name, when present on the object.
export const displayName = (user) =>
  user?.nickname ? user.nickname : fullName(user);
