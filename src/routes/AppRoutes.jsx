import { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import LightThemeScope from "../theme/LightThemeScope";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ScrollToTop from "../utility/ScrollToTop";
import { ROLES } from "../constants/domain";
import Loader from "../components/loader/Loader";

const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));
const SignupPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));

const LandingPage = Loadable(
  lazy(() => import("../pages/LandingPage/LandingPage")),
);

// Dashboard (protected) area — AppShell picks the owner vs staff shell by role.
const AppShell = Loadable(lazy(() => import("../components/owner/AppShell")));
const DashboardHome = Loadable(
  lazy(() => import("../pages/Dashboard/DashboardHome")),
);

// Pet-owner mobile experience (rendered for PET_OWNER inside OwnerLayout).
const OwnerHome = Loadable(lazy(() => import("../pages/Owner/OwnerHome")));
const OwnerPets = Loadable(lazy(() => import("../pages/Owner/OwnerPets")));
const OwnerAppointments = Loadable(
  lazy(() => import("../pages/Owner/OwnerAppointments")),
);
const OwnerReminders = Loadable(
  lazy(() => import("../pages/Owner/OwnerReminders")),
);
const OwnerProfile = Loadable(
  lazy(() => import("../pages/Owner/OwnerProfile")),
);
const PetsPage = Loadable(lazy(() => import("../pages/Pets/PetsPage")));
const AppointmentsPage = Loadable(
  lazy(() => import("../pages/Appointments/AppointmentsPage")),
);
const ServicesPage = Loadable(
  lazy(() => import("../pages/Services/ServicesPage")),
);
const VetsPage = Loadable(lazy(() => import("../pages/Vets/VetsPage")));
const VetConsolePage = Loadable(
  lazy(() => import("../pages/VetConsole/VetConsolePage")),
);
const InsightsPage = Loadable(
  lazy(() => import("../pages/Insights/InsightsPage")),
);
const RemindersPage = Loadable(
  lazy(() => import("../pages/Reminders/RemindersPage")),
);
const ChatPage = Loadable(lazy(() => import("../pages/Chat/ChatPage")));
const SecurityPage = Loadable(
  lazy(() => import("../pages/Account/SecurityPage")),
);
const ChatRetentionPage = Loadable(
  lazy(() => import("../pages/Admin/ChatRetentionPage")),
);
const AuthSettingsPage = Loadable(
  lazy(() => import("../pages/Admin/AuthSettingsPage")),
);
const EmailTemplatesPage = Loadable(
  lazy(() => import("../pages/Admin/EmailTemplatesPage")),
);
const VetUsersPage = Loadable(
  lazy(() => import("../pages/Admin/VetUsersPage")),
);
const CustomerUsersPage = Loadable(
  lazy(() => import("../pages/Admin/CustomerUsersPage")),
);
const AdminUsersPage = Loadable(
  lazy(() => import("../pages/Admin/AdminUsersPage")),
);
const RoleRequestsPage = Loadable(
  lazy(() => import("../pages/Admin/RoleRequestsPage")),
);
const RoleRequestFieldsPage = Loadable(
  lazy(() => import("../pages/Admin/RoleRequestFieldsPage")),
);
const MarketplaceListingsPage = Loadable(
  lazy(() => import("../pages/Admin/MarketplaceListingsPage")),
);
const MarketplaceCategoriesPage = Loadable(
  lazy(() => import("../pages/Admin/MarketplaceCategoriesPage")),
);
const RoleRequestPage = Loadable(
  lazy(() => import("../pages/Account/RoleRequestPage")),
);
const SpeciesPage = Loadable(lazy(() => import("../pages/Admin/SpeciesPage")));

// Marketplace — customer discovery (all authenticated roles) + public share page.
const MarketplaceScopeLayout = Loadable(
  lazy(() => import("../pages/Marketplace/MarketplaceScopeLayout")),
);
const MarketplaceHome = Loadable(
  lazy(() => import("../pages/Marketplace/MarketplaceHome")),
);
const CategoryListing = Loadable(
  lazy(() => import("../pages/Marketplace/CategoryListing")),
);
const BusinessDetail = Loadable(
  lazy(() => import("../pages/Marketplace/BusinessDetail")),
);
const OfferDetail = Loadable(lazy(() => import("../pages/Marketplace/OfferDetail")));
const MarketplaceSearch = Loadable(
  lazy(() => import("../pages/Marketplace/MarketplaceSearch")),
);
const MyCollection = Loadable(
  lazy(() => import("../pages/Marketplace/MyCollection")),
);
const SellOnMarketplace = Loadable(
  lazy(() => import("../pages/Marketplace/SellOnMarketplace")),
);
const PublicBusinessPage = Loadable(
  lazy(() => import("../pages/Marketplace/PublicBusinessPage")),
);

// Partner dashboard (PARTNER role — KYB-gated storefront management).
const PartnerScopeLayout = Loadable(
  lazy(() => import("../pages/Partner/PartnerScopeLayout")),
);
const ListingEditor = Loadable(lazy(() => import("../pages/Partner/ListingEditor")));
const OffersManager = Loadable(lazy(() => import("../pages/Partner/OffersManager")));
const ReviewsManager = Loadable(lazy(() => import("../pages/Partner/ReviewsManager")));
const PartnerInbox = Loadable(lazy(() => import("../pages/Partner/PartnerInbox")));

const NotFoundPage = Loadable(
  lazy(() => import("../pages/Error/NotFoundPage")),
);
const UnauthorizedPage = Loadable(
  lazy(() => import("../pages/Error/UnauthorizedPage")),
);

const { SUPER_ADMIN, ADMIN, VET, PARTNER, PET_OWNER } = ROLES;

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
          <Route path="/loader" element={<Loader />} />

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

          {/* Public, shareable business page (marketplace share links) */}
          <Route path="/m/:slug" element={<PublicBusinessPage />} />

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

              {/* Marketplace — customer discovery, any signed-in role */}
              <Route path="marketplace" element={<MarketplaceScopeLayout />}>
                <Route index element={<MarketplaceHome />} />
                <Route path="search" element={<MarketplaceSearch />} />
                <Route path="sell" element={<SellOnMarketplace />} />
                <Route path="saved" element={<MyCollection />} />
                <Route path="category/:slug" element={<CategoryListing />} />
                <Route path="business/:slug" element={<BusinessDetail />} />
                <Route path="offer/:id" element={<OfferDetail />} />
              </Route>

              {/* Partner dashboard — PARTNER (admins allowed for support) */}
              <Route element={<ProtectedRoute roles={[PARTNER, ADMIN, SUPER_ADMIN]} />}>
                <Route path="partner" element={<PartnerScopeLayout />}>
                  <Route index element={<ListingEditor />} />
                  <Route path="offers" element={<OffersManager />} />
                  <Route path="reviews" element={<ReviewsManager />} />
                  <Route path="inbox" element={<PartnerInbox />} />
                </Route>
              </Route>
              <Route path="account/security" element={<SecurityPage />} />
              <Route
                path="account/role-request"
                element={<RoleRequestPage />}
              />

              {/* Vet + admin only */}
              <Route
                element={<ProtectedRoute roles={[VET, ADMIN, SUPER_ADMIN]} />}
              >
                <Route path="vet-console" element={<VetConsolePage />} />
              </Route>

              {/* Government / admin only */}
              <Route element={<ProtectedRoute roles={[ADMIN, SUPER_ADMIN]} />}>
                <Route path="insights" element={<InsightsPage />} />
                <Route path="admin/vets" element={<VetUsersPage />} />
                <Route path="admin/customers" element={<CustomerUsersPage />} />
                <Route path="admin/admins" element={<AdminUsersPage />} />
                <Route
                  path="admin/role-requests"
                  element={<RoleRequestsPage />}
                />
                <Route
                  path="admin/role-request-fields"
                  element={<RoleRequestFieldsPage />}
                />
                <Route path="admin/species" element={<SpeciesPage />} />
                <Route
                  path="admin/chat-retention"
                  element={<ChatRetentionPage />}
                />
              </Route>

              {/* Marketplace administration — a distinct service, managed
                  separately from the core Control Panel above */}
              <Route element={<ProtectedRoute roles={[ADMIN, SUPER_ADMIN]} />}>
                <Route
                  path="admin/marketplace/listings"
                  element={<MarketplaceListingsPage />}
                />
                <Route
                  path="admin/marketplace/categories"
                  element={<MarketplaceCategoriesPage />}
                />
              </Route>

              {/* Super admin only */}
              <Route element={<ProtectedRoute roles={[SUPER_ADMIN]} />}>
                <Route
                  path="admin/auth-settings"
                  element={<AuthSettingsPage />}
                />
                <Route
                  path="admin/email-templates"
                  element={<EmailTemplatesPage />}
                />
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
