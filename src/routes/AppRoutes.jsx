import { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import LightThemeScope from "../theme/LightThemeScope";
import { AuthProvider } from "../context/AuthContext";
import ScrollToTop from "../utility/ScrollToTop";
import { ROLES } from "../constants/domain";

const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));
const SignupPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));

const LandingPage = Loadable(
  lazy(() => import("../pages/LandingPage/LandingPage"))
);

// Dashboard (protected) area
const DashboardLayout = Loadable(
  lazy(() => import("../components/dashboard/DashboardLayout"))
);
const DashboardHome = Loadable(
  lazy(() => import("../pages/Dashboard/DashboardHome"))
);
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

const NotFoundPage = Loadable(lazy(() => import("../pages/Error/NotFoundPage")));
const UnauthorizedPage = Loadable(
  lazy(() => import("../pages/Error/UnauthorizedPage"))
);

const { SUPER_ADMIN, ADMIN, VET } = ROLES;

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
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="pets" element={<PetsPage />} />
              <Route path="reminders" element={<RemindersPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="vets" element={<VetsPage />} />

              {/* Vet + admin only */}
              <Route element={<ProtectedRoute roles={[VET, ADMIN, SUPER_ADMIN]} />}>
                <Route path="vet-console" element={<VetConsolePage />} />
              </Route>

              {/* Government / admin only */}
              <Route element={<ProtectedRoute roles={[ADMIN, SUPER_ADMIN]} />}>
                <Route path="insights" element={<InsightsPage />} />
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
