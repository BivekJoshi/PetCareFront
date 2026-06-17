// Domain enums mirrored from the backend Prisma schema.

export const PET_SPECIES = [
  "DOG",
  "CAT",
  "BIRD",
  "RABBIT",
  "REPTILE",
  "FISH",
  "OTHER",
];

export const PET_GENDERS = ["MALE", "FEMALE", "UNKNOWN"];

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export const STATUS_COLORS = {
  PENDING: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  CANCELLED: "default",
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  VET: "VET",
  PET_OWNER: "PET_OWNER",
};

export const isAdmin = (role) =>
  role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

// Title-case an ENUM_VALUE for display: "PET_OWNER" -> "Pet Owner".
export const humanize = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
