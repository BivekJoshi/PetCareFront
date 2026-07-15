import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import { ChatProvider } from "../../context/ChatContext";
import { CallProvider } from "../../context/CallContext";
import { useAuth } from "../../context/AuthContext";
import { useReminders } from "../../hooks/reminders/useReminders";
import { fullName } from "../../utility/format";
import VerificationBanners from "../auth/VerificationBanners";

/**
 * Mobile-app shell for the PET_OWNER role.
 *
 * On a phone it fills the screen edge-to-edge; on a tablet/desktop it renders
 * as a centered "device" — a tall, rounded card floating in the middle of an
 * ambient backdrop, so the experience always reads as a focused mobile app.
 *
 * Layout is a single flex column inside the device: a sticky top bar, a
 * scrollable content area (the routed page), and a bottom tab bar.
 */

// Bottom-nav tabs, in order. `match` decides which tab is highlighted for the
// current path; the first matching tab (top-down) wins, so put specific paths
// before the catch-all home tab.
const TABS = [
  { value: "pets", label: "Pets", to: "/app/pets", icon: PetsRoundedIcon, match: (p) => p.startsWith("/app/pets") },
  { value: "appointments", label: "Visits", to: "/app/appointments", icon: EventRoundedIcon, match: (p) => p.startsWith("/app/appointments") },
  { value: "marketplace", label: "Market", to: "/app/marketplace", icon: StorefrontRoundedIcon, match: (p) => p.startsWith("/app/marketplace") },
  { value: "home", label: "Home", to: "/app", icon: HomeRoundedIcon, match: () => true },
  { value: "reminders", label: "Alerts", to: "/app/reminders", icon: NotificationsRoundedIcon, match: (p) => p.startsWith("/app/reminders") },
  { value: "profile", label: "Profile", to: "/app/profile", icon: PersonRoundedIcon, match: (p) => p.startsWith("/app/profile") || p.startsWith("/app/account") },
];

// Header title per top-level section.
const titleFor = (p) => {
  if (p.startsWith("/app/pets")) return "My Pets";
  if (p.startsWith("/app/appointments")) return "Appointments";
  if (p.startsWith("/app/reminders")) return "Reminders";
  if (p.startsWith("/app/profile") || p.startsWith("/app/account")) return "Profile";
  if (p.startsWith("/app/chat")) return "Messages";
  return "PetCare";
};

const OwnerLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const remindersQ = useReminders({ limit: 1 });
  const unread = remindersQ.data?.meta?.unread ?? 0;

  const activeTab = useMemo(
    () => TABS.find((t) => t.match(pathname))?.value ?? "home",
    [pathname]
  );

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const onHome = pathname === "/app";

  return (
    <ChatProvider>
      <CallProvider>
        {/* Ambient desktop backdrop — the device floats in the middle of it */}
        <Box
          sx={{
            minHeight: "100dvh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            // Phones AND tablets (up to ~900px) get the full-screen app; only
            // a true desktop shows the centered, floating "device".
            alignItems: { xs: "stretch", md: "center" },
            p: { xs: 0, md: 0 },
            background: {
              xs: "transparent",
              md: `radial-gradient(1200px circle at 20% 0%, ${alpha(
                theme.palette.primary.main,
                0.18
              )}, transparent 45%), radial-gradient(1000px circle at 100% 100%, ${alpha(
                theme.palette.secondary.main,
                0.16
              )}, transparent 45%), ${theme.palette.background.default}`,
            },
          }}
        >
          {/* The device */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: { xs: "100%", md: 480 },
              height: { xs: "100dvh" },
              bgcolor: "background.paper",
              borderRadius: { xs: 0},
              border: { md: 1 },
              borderColor: { md: "divider" },
              boxShadow: {
                md: "0 20px 25px -5px rgba(0,0,0,0.18), 0 8px 10px -6px rgba(0,0,0,0.14)",
              },
              overflow: "hidden",
            }}
          >
            {/* ---------------------------- Top bar --------------------------- */}
            <Box
              sx={{
                flexShrink: 0,
                px: 2.5,
                pt: 2,
                pb: 1.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                zIndex: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ cursor: "pointer", minWidth: 0 }}
                onClick={() => navigate("/app/profile")}
              >
                <Avatar
                  src={user?.avatarUrl || undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    fontWeight: 800,
                    fontSize: ".95rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {initials || "🐾"}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  {onHome && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1, display: "block" }}
                    >
                      Welcome back
                    </Typography>
                  )}
                  <Typography
                    noWrap
                    sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: "1.05rem" }}
                  >
                    {onHome ? user?.firstName || "Pet parent" : titleFor(pathname)}
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                onClick={() => navigate("/app/reminders")}
                sx={{
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <Badge badgeContent={unread} color="error" max={9}>
                  {unread > 0 ? (
                    <NotificationsRoundedIcon />
                  ) : (
                    <NotificationsNoneRoundedIcon />
                  )}
                </Badge>
              </IconButton>
            </Box>

            {/* ---------------------------- Content --------------------------- */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                px: 2,
                pt: 2,
                pb: 3,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: alpha(theme.palette.text.primary, 0.18),
                  borderRadius: 3,
                },
              }}
            >
              <VerificationBanners />
              <Outlet />
            </Box>

            {/* -------------------------- Bottom tabs ------------------------- */}
            <BottomNavigation
              value={activeTab}
              showLabels
              sx={{
                flexShrink: 0,
                height: 68,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                px: 0.5,
                "& .MuiBottomNavigationAction-root": {
                  minWidth: 0,
                  color: "text.disabled",
                  borderRadius: 3,
                  m: 0.5,
                  transition: "color .2s ease, background-color .2s ease",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
                "& .MuiBottomNavigationAction-label": {
                  fontWeight: 700,
                  fontSize: "0.7rem !important",
                },
              }}
            >
              {TABS.map((t) => (
                <BottomNavigationAction
                  key={t.value}
                  value={t.value}
                  label={t.label}
                  icon={<t.icon />}
                  onClick={() => navigate(t.to)}
                />
              ))}
            </BottomNavigation>
          </Box>
        </Box>
      </CallProvider>
    </ChatProvider>
  );
};

export default OwnerLayout;
