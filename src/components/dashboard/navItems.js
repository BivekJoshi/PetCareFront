import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import { ROLES } from "../../constants/domain";

const { SUPER_ADMIN, ADMIN, VET, PET_OWNER } = ROLES;

// Sidebar entries. `roles` (optional) restricts visibility; omitted = everyone.
export const NAV_ITEMS = [
  { label: "Overview", to: "/app", icon: DashboardOutlinedIcon, end: true },
  {
    label: "Vet Console",
    to: "/app/vet-console",
    icon: QrCodeScannerOutlinedIcon,
    roles: [VET, ADMIN, SUPER_ADMIN],
  },
  {
    label: "Insights",
    to: "/app/insights",
    icon: InsightsOutlinedIcon,
    roles: [ADMIN, SUPER_ADMIN],
  },
  { label: "My Pets", to: "/app/pets", icon: PetsOutlinedIcon },
  {
    label: "Reminders",
    to: "/app/reminders",
    icon: NotificationsActiveOutlinedIcon,
    roles: [PET_OWNER, VET, ADMIN, SUPER_ADMIN],
  },
  { label: "Appointments", to: "/app/appointments", icon: EventOutlinedIcon },
  { label: "Services", to: "/app/services", icon: MedicalServicesOutlinedIcon },
  { label: "Vets", to: "/app/vets", icon: LocalHospitalOutlinedIcon },
];
