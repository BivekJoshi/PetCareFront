import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
// child-level icons
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { ROLES } from "../../constants/domain";

const { SUPER_ADMIN, ADMIN, VET, PET_OWNER } = ROLES;

/**
 * Grouped sidebar navigation.
 *
 * Each section has a `heading` and a list of `items`. An item is either:
 *   - a leaf  → { label, to, icon, end?, roles? }
 *   - a group → { label, icon, roles?, children: [ leaf, leaf, ... ] }
 *
 * A group has no `to` of its own; it expands to reveal its child links.
 * `roles` (optional, on items or children) restricts visibility.
 */
export const NAV_SECTIONS = [
  {
    heading: "General",
    items: [
      { label: "Overview", to: "/app", icon: DashboardOutlinedIcon, end: true },
      {
        label: "Insights",
        icon: InsightsOutlinedIcon,
        roles: [ADMIN, SUPER_ADMIN],
        children: [
          { label: "Summary", to: "/app/insights", icon: SummarizeOutlinedIcon, end: true },
          { label: "Reports", to: "/app/insights/reports", icon: AssessmentOutlinedIcon },
          { label: "Trends", to: "/app/insights/trends", icon: TrendingUpOutlinedIcon },
        ],
      },
    ],
  },
  {
    heading: "Care",
    items: [
      {
        label: "My Pets",
        icon: PetsOutlinedIcon,
        children: [
          { label: "All Pets", to: "/app/pets", icon: PetsOutlinedIcon, end: true },
          { label: "Add Pet", to: "/app/pets/new", icon: AddCircleOutlineIcon },
          { label: "Medical Records", to: "/app/pets/records", icon: FolderSharedOutlinedIcon },
        ],
      },
      {
        label: "Appointments",
        icon: EventOutlinedIcon,
        children: [
          { label: "Upcoming", to: "/app/appointments", icon: EventAvailableOutlinedIcon, end: true },
          { label: "History", to: "/app/appointments/history", icon: HistoryOutlinedIcon },
          { label: "Book New", to: "/app/appointments/new", icon: EditCalendarOutlinedIcon },
        ],
      },
      {
        label: "Reminders",
        to: "/app/reminders",
        icon: NotificationsActiveOutlinedIcon,
        roles: [PET_OWNER, VET, ADMIN, SUPER_ADMIN],
      },
      {
        label: "Messages",
        to: "/app/chat",
        icon: ChatOutlinedIcon,
      },
      {
        label: "Request Role Change",
        to: "/app/account/role-request",
        icon: BadgeOutlinedIcon,
        // Vets/staff can apply to become an admin; admins don't need this.
        roles: [VET],
      },
    ],
  },
  {
    heading: "Clinic",
    items: [
      {
        label: "Vet Console",
        to: "/app/vet-console",
        icon: QrCodeScannerOutlinedIcon,
        roles: [VET, ADMIN, SUPER_ADMIN],
      },
      {
        label: "Services",
        icon: MedicalServicesOutlinedIcon,
        children: [
          { label: "Grooming", to: "/app/services/grooming", icon: ContentCutOutlinedIcon },
          { label: "Boarding", to: "/app/services/boarding", icon: HotelOutlinedIcon },
          { label: "Vet Visit", to: "/app/services/vet", icon: VaccinesOutlinedIcon },
        ],
      },
      { label: "Vets", to: "/app/vets", icon: LocalHospitalOutlinedIcon },
    ],
  },
  {
    heading: "Administration",
    items: [
      {
        label: "Control Panel",
        icon: AdminPanelSettingsOutlinedIcon,
        roles: [ADMIN, SUPER_ADMIN],
        children: [
          {
            label: "User Management",
            to: "/app/admin/users",
            icon: ManageAccountsOutlinedIcon,
          },
          {
            label: "Role Requests",
            to: "/app/admin/role-requests",
            icon: HowToRegOutlinedIcon,
          },
          {
            label: "Role Request Fields",
            to: "/app/admin/role-request-fields",
            icon: BadgeOutlinedIcon,
          },
          {
            label: "Species",
            to: "/app/admin/species",
            icon: CategoryOutlinedIcon,
          },
          {
            label: "Chat Retention",
            to: "/app/admin/chat-retention",
            icon: AutoDeleteOutlinedIcon,
          },
          {
            label: "Authentication",
            to: "/app/admin/auth-settings",
            icon: VerifiedUserOutlinedIcon,
            roles: [SUPER_ADMIN],
          },
          {
            label: "Email Templates",
            to: "/app/admin/email-templates",
            icon: MarkEmailReadOutlinedIcon,
            roles: [SUPER_ADMIN],
          },
        ],
      },
    ],
  },
];

// Flat list of every navigable leaf — handy for breadcrumb / active-title lookup.
export const NAV_LEAVES = NAV_SECTIONS.flatMap((section) =>
  section.items.flatMap((item) => (item.children ? item.children : [item]))
);

// Filter a nav node (and its children) by the current role.
export const isVisible = (node, role) =>
  !node.roles || node.roles.includes(role);

const leafMatches = (leaf, pathname) =>
  leaf.end ? pathname === leaf.to : pathname.startsWith(leaf.to);

const humanizeSegment = (seg = "") =>
  seg
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Build a breadcrumb trail for a dashboard pathname using the nav structure.
 * Returns an ordered array of crumbs: { label, to?, icon?, current? }.
 * The root "Dashboard" crumb is included by the consumer, not here.
 *
 *   /app/pets            → [ My Pets, All Pets ]
 *   /app/insights/trends → [ Insights, Trends ]
 *   /app/pets/42         → [ My Pets, All Pets, 42 ]   (deep/unknown segments)
 */
export const getBreadcrumbTrail = (pathname = "") => {
  let best = null;
  NAV_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      const leaves = item.children ? item.children : [item];
      leaves.forEach((leaf) => {
        if (
          leafMatches(leaf, pathname) &&
          (!best || leaf.to.length > best.leaf.to.length)
        ) {
          best = { leaf, group: item.children ? item : null };
        }
      });
    });
  });

  const trail = [];
  if (!best) return trail;

  // The parent group (if any) — groups have no route, so it isn't a link.
  if (best.group) {
    trail.push({ label: best.group.label, icon: best.group.icon });
  }

  trail.push({
    label: best.leaf.label,
    to: best.leaf.to,
    icon: best.leaf.icon,
  });

  // Append any extra path segments beyond the matched leaf (e.g. an id).
  const extra = pathname.slice(best.leaf.to.length).split("/").filter(Boolean);
  extra.forEach((seg) => trail.push({ label: humanizeSegment(seg) }));

  // The last crumb is the current page.
  if (trail.length) trail[trail.length - 1].current = true;
  return trail;
};
