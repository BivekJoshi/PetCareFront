import { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import LightThemeScope from "../theme/LightThemeScope";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ScrollToTop from "../utility/ScrollToTop";
import { ROLES } from "../constants/domain";

const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));
const SignupPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));

const LandingPage = Loadable(
  lazy(() => import("../pages/LandingPage/LandingPage"))
);

// Dashboard (protected) area — AppShell picks the owner vs staff shell by role.
const AppShell = Loadable(lazy(() => import("../components/owner/AppShell")));
const DashboardHome = Loadable(
  lazy(() => import("../pages/Dashboard/DashboardHome"))
);

// Pet-owner mobile experience (rendered for PET_OWNER inside OwnerLayout).
const OwnerHome = Loadable(lazy(() => import("../pages/Owner/OwnerHome")));
const OwnerPets = Loadable(lazy(() => import("../pages/Owner/OwnerPets")));
const OwnerAppointments = Loadable(
  lazy(() => import("../pages/Owner/OwnerAppointments"))
);
const OwnerReminders = Loadable(
  lazy(() => import("../pages/Owner/OwnerReminders"))
);
const OwnerProfile = Loadable(lazy(() => import("../pages/Owner/OwnerProfile")));
const PetsPage = Loadable(lazy(() => import("../pages/Pets/PetsPage")));
const AppointmentsPage = Loadable(
  lazy(() => import("../pages/Appointments/AppointmentsPage"))
);
const ServicesPage = Loadable(
  lazy(() => import("../pages/Services/ServicesPage"))
);
const VetsPage = Loadable(lazy(() => import("../pages/Vets/VetsPage")));
const VetConsolePage = Loadable(
  lazy(() => import("../pages/VetConsole/VetConsolePage"))
);
const InsightsPage = Loadable(
  lazy(() => import("../pages/Insights/InsightsPage"))
);
const RemindersPage = Loadable(
  lazy(() => import("../pages/Reminders/RemindersPage"))
);
const ChatPage = Loadable(lazy(() => import("../pages/Chat/ChatPage")));
const SecurityPage = Loadable(
  lazy(() => import("../pages/Account/SecurityPage"))
);
const ChatRetentionPage = Loadable(
  lazy(() => import("../pages/Admin/ChatRetentionPage"))
);
const AuthSettingsPage = Loadable(
  lazy(() => import("../pages/Admin/AuthSettingsPage"))
);
const EmailTemplatesPage = Loadable(
  lazy(() => import("../pages/Admin/EmailTemplatesPage"))
);
const UserManagementPage = Loadable(
  lazy(() => import("../pages/Admin/UserManagementPage"))
);
const RoleRequestsPage = Loadable(
  lazy(() => import("../pages/Admin/RoleRequestsPage"))
);
const RoleRequestPage = Loadable(
  lazy(() => import("../pages/Account/RoleRequestPage"))
);
const SpeciesPage = Loadable(
  lazy(() => import("../pages/Admin/SpeciesPage"))
);

const NotFoundPage = Loadable(lazy(() => import("../pages/Error/NotFoundPage")));
const UnauthorizedPage = Loadable(
  lazy(() => import("../pages/Error/UnauthorizedPage"))
);

const { SUPER_ADMIN, ADMIN, VET, PET_OWNER } = ROLES;

// Render the owner-tailored page for pet owners, the staff page otherwise.
const byRole = (OwnerEl, StaffEl) => {
  const RoleRoute = () => {
    const { role } = useAuth();
    return role === PET_OWNER ? <OwnerEl /> : <StaffEl />;
  };
  return <RoleRoute />;
};

const AppRoutes = () => {
  return (
    <HashRouter hashType="slash">
      <AuthProvider>
        {/* Reset window scroll to the top on every route change */}
        <ScrollToTop />
        <Routes>
          {/* Public — pinned to light mode (not affected by the dark toggle) */}
          <Route
            path="/login"
            element={
              <LightThemeScope>
                <LoginPage />
              </LightThemeScope>
            }
          />
          <Route
            path="/signup"
            element={
              <LightThemeScope>
                <SignupPage initialMode="signup" />
              </LightThemeScope>
            }
          />

          <Route
            path="/"
            element={
              <LightThemeScope>
                <AppLayout />
              </LightThemeScope>
            }
          >
            <Route index element={<LandingPage />} />
            <Route path="home" element={<LandingPage />} />
          </Route>

          {/* Protected dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={byRole(OwnerHome, DashboardHome)} />
              <Route path="pets" element={byRole(OwnerPets, PetsPage)} />
              <Route
                path="reminders"
                element={byRole(OwnerReminders, RemindersPage)}
              />
              <Route
                path="appointments"
                element={byRole(OwnerAppointments, AppointmentsPage)}
              />
              <Route path="services" element={<ServicesPage />} />
              <Route path="vets" element={<VetsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<OwnerProfile />} />
              <Route path="account/security" element={<SecurityPage />} />
              <Route path="account/role-request" element={<RoleRequestPage />} />

              {/* Vet + admin only */}
              <Route element={<ProtectedRoute roles={[VET, ADMIN, SUPER_ADMIN]} />}>
                <Route path="vet-console" element={<VetConsolePage />} />
              </Route>

              {/* Government / admin only */}
              <Route element={<ProtectedRoute roles={[ADMIN, SUPER_ADMIN]} />}>
                <Route path="insights" element={<InsightsPage />} />
                <Route path="admin/users" element={<UserManagementPage />} />
                <Route path="admin/role-requests" element={<RoleRequestsPage />} />
                <Route path="admin/species" element={<SpeciesPage />} />
                <Route path="admin/chat-retention" element={<ChatRetentionPage />} />
              </Route>

              {/* Super admin only */}
              <Route element={<ProtectedRoute roles={[SUPER_ADMIN]} />}>
                <Route path="admin/auth-settings" element={<AuthSettingsPage />} />
                <Route path="admin/email-templates" element={<EmailTemplatesPage />} />
              </Route>
            </Route>
          </Route>

          {/* Access denied (401) */}
          <Route
            path="/401"
            element={
              <LightThemeScope>
                <UnauthorizedPage />
              </LightThemeScope>
            }
          />

          {/* Fallback (404) */}
          <Route
            path="*"
            element={
              <LightThemeScope>
                <NotFoundPage />
              </LightThemeScope>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default AppRoutes;
