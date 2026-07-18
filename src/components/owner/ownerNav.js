import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

/**
 * The owner app's nav model, shared by the desktop rail (OwnerNavRail) and the
 * phone tab bar (OwnerLayout). One list, two presentations.
 *
 * `match` decides which destination is active for the current path; `home` is
 * the fallback when nothing else matches. `badge` names the counter the rail
 * should hang off the icon, if any.
 */
export const TABS = [
  { value: "home", label: "Home", to: "/app", icon: HomeRoundedIcon, match: (p) => p === "/app" },
  { value: "pets", label: "Pets", to: "/app/pets", icon: PetsRoundedIcon, match: (p) => p.startsWith("/app/pets") },
  { value: "appointments", label: "Visits", to: "/app/appointments", icon: EventRoundedIcon, match: (p) => p.startsWith("/app/appointments") },
  { value: "marketplace", label: "Market", to: "/app/marketplace", icon: StorefrontRoundedIcon, match: (p) => p.startsWith("/app/marketplace") },
  { value: "chat", label: "Messages", to: "/app/chat", icon: ChatRoundedIcon, badge: "messages", match: (p) => p.startsWith("/app/chat") },
  { value: "reminders", label: "Alerts", to: "/app/reminders", icon: NotificationsRoundedIcon, badge: "reminders", match: (p) => p.startsWith("/app/reminders") },
  { value: "profile", label: "Profile", to: "/app/profile", icon: PersonRoundedIcon, match: (p) => p.startsWith("/app/profile") || p.startsWith("/app/account") },
];

// The rail lists every destination. The phone tab bar keeps Home centered and
// drops Messages — it lives under Profile there rather than eating a tab.
export const BOTTOM_ORDER = ["pets", "appointments", "home", "marketplace", "reminders", "profile"];
export const BOTTOM_TABS = BOTTOM_ORDER.map((v) => TABS.find((t) => t.value === v));

export const activeTabFor = (pathname) =>
  TABS.find((t) => t.match(pathname))?.value ?? "home";

// Header title per top-level section, for the phone top bar.
export const titleFor = (p) => {
  if (p.startsWith("/app/pets")) return "My Pets";
  if (p.startsWith("/app/appointments")) return "Appointments";
  if (p.startsWith("/app/marketplace")) return "Marketplace";
  if (p.startsWith("/app/reminders")) return "Reminders";
  if (p.startsWith("/app/profile") || p.startsWith("/app/account")) return "Profile";
  if (p.startsWith("/app/chat")) return "Messages";
  return "PetCare";
};

// Rail geometry, shared with OwnerLayout so the content column can reserve the
// collapsed width while the expanded panel overlays it.
export const RAIL_COLLAPSED = 76;
export const RAIL_EXPANDED = 244;
