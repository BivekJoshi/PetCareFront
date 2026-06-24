import OwnerLayout from "./OwnerLayout";
import DashboardLayout from "../dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/domain";

/**
 * Picks the post-login shell by role: pet owners get the focused, mobile-app
 * OwnerLayout; staff (vet/admin/super-admin) keep the full DashboardLayout.
 * Both render the routed page through their own <Outlet/>.
 */
const AppShell = () => {
  const { role } = useAuth();
  return role === ROLES.PET_OWNER ? <OwnerLayout /> : <DashboardLayout />;
};

export default AppShell;
