// Marketplace design tokens — mirrored from the "Marketplace Design" prototype
// (tokens.jsx). The marketplace area is purple-branded and trust-forward; these
// are the raw hex values used in sx props where a semantic token is clearer than
// leaning on the MUI palette (sponsored/verified chips, voucher gradients, etc.).

export const MK = {
  brand: "#5B2EBF",
  brandDeep: "#3F1F8C",
  brandSoft: "#EFE8FB",
  brandTint: "#F7F4FD",

  ink: "#0E1014",
  ink2: "#2A2D35",
  ink3: "#5B606B",
  ink4: "#8A8F9A",
  hair: "#E6E7EB",
  hair2: "#EFF0F3",
  bg: "#FFFFFF",
  bg2: "#F7F8FA",

  green: "#0F9D58", // verified / success
  greenSoft: "#E6F4EC",
  amber: "#B26A00", // ending soon
  amberSoft: "#FBF1DD",
  red: "#C0362C",
  redSoft: "#FBEBE9",

  // Sponsored — intentionally muted
  sponsoredFg: "#6E5A2A",
  sponsoredBg: "#FAF3DD",
  sponsoredBorder: "#EAD9A6",

  voucher: "linear-gradient(135deg, #5B2EBF 0%, #3F1F8C 100%)",
};

// Business/offer status → MUI Chip color + label.
export const BUSINESS_STATUS = {
  DRAFT: { label: "Draft", color: "default" },
  PENDING_REVIEW: { label: "In review", color: "warning" },
  PUBLISHED: { label: "Published", color: "success" },
  SUSPENDED: { label: "Suspended", color: "error" },
};

export const OFFER_STATUS = {
  SCHEDULED: { label: "Scheduled", color: "info" },
  ACTIVE: { label: "Active", color: "success" },
  PAUSED: { label: "Paused", color: "default" },
  ENDED: { label: "Ended", color: "default" },
};
