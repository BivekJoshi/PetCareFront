import React, { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "../components/Errorboundary/ErrorPage";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
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

const { SUPER_ADMIN, ADMIN, VET } = ROLES;

const AppRoutes = () => {
  return (
    <HashRouter hashType="slash">
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage initialMode="signup" />} />

          <Route path="/" element={<AppLayout />}>
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

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default AppRoutes;
