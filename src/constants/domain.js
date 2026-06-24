// Domain enums mirrored from the backend Prisma schema.

export const PET_SPECIES = [
  "DOG",
  "CAT",
  "BIRD",
  "RABBIT",
  "REPTILE",
  "FISH",
  "CATTLE",
  "GOAT",
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

export const VACCINATION_STATUSES = [
  "SCHEDULED",
  "ADMINISTERED",
  "OVERDUE",
  "SKIPPED",
];

export const VACCINATION_STATUS_COLORS = {
  SCHEDULED: "info",
  ADMINISTERED: "success",
  OVERDUE: "error",
  SKIPPED: "default",
};

export const RECORD_TYPES = [
  "CHECKUP",
  "TREATMENT",
  "PRESCRIPTION",
  "DIET",
  "SURGERY",
];

export const REMINDER_TYPES = [
  "VACCINE",
  "CHECKUP",
  "DEWORMING",
  "CARE_TIP",
  "GENERAL",
];

export const REMINDER_TYPE_COLORS = {
  VACCINE: "success",
  CHECKUP: "info",
  DEWORMING: "warning",
  CARE_TIP: "secondary",
  GENERAL: "default",
};

export const AREA_LEVELS = ["PROVINCE", "DISTRICT", "MUNICIPALITY", "WARD"];

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  VET: "VET",
  PET_OWNER: "PET_OWNER",
};

// Roles a user may request for themselves (mirrors REQUESTABLE_ROLES on the API).
export const REQUESTABLE_ROLES = ["VET", "ADMIN"];

// Every assignable role — used by the admin "change role" picker.
export const ASSIGNABLE_ROLES = ["SUPER_ADMIN", "ADMIN", "VET", "PET_OWNER"];

export const ROLE_REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

export const ROLE_REQUEST_STATUS_COLORS = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
  CANCELLED: "default",
};

export const isAdmin = (role) =>
  role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

export const isVet = (role) => role === ROLES.VET;

export const isStaff = (role) => isAdmin(role) || isVet(role);

// Title-case an ENUM_VALUE for display: "PET_OWNER" -> "Pet Owner".
export const humanize = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
