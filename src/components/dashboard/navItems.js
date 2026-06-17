import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

// Sidebar entries. `roles` (optional) restricts visibility; omitted = everyone.
export const NAV_ITEMS = [
  { label: "Overview", to: "/app", icon: DashboardOutlinedIcon, end: true },
  { label: "My Pets", to: "/app/pets", icon: PetsOutlinedIcon },
  { label: "Appointments", to: "/app/appointments", icon: EventOutlinedIcon },
  { label: "Services", to: "/app/services", icon: MedicalServicesOutlinedIcon },
  { label: "Vets", to: "/app/vets", icon: LocalHospitalOutlinedIcon },
];
