import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { TABS, RAIL_COLLAPSED, RAIL_EXPANDED } from "./ownerNav";
import { SPRING, RAIL_PILL, panelSlide, backdropFade } from "./ownerMotion";
import OwnerSearchPanel from "./OwnerSearchPanel";
import OwnerNotificationsPanel from "./OwnerNotificationsPanel";

const MotionBox = motion(Box);

/**
 * Desktop nav rail for the owner app.
 *
 * Collapsed to icons and expanded on hover, the way Instagram's left nav
 * behaves. Three kinds of row share the rail:
 *
 * - `route`  — navigates, and owns the sliding active pill.
 * - `panel`  — opens a flyout beside the rail (search, notifications) so the
 *              page underneath is never lost.
 * - `menu`   — opens an anchored menu (create, account).
 *
 * The expanded panel is absolutely positioned and overlays the content rather
 * than pushing it: the feed must not reflow every time the pointer crosses the
 * rail. Icons sit in a fixed column so they land on the same x in both states
 * and the expansion reads as labels appearing, not the rail sliding.
 */

const ICON_COL = RAIL_COLLAPSED - 8;
const PANEL_WIDTH = 400;

const tab = (v) => TABS.find((t) => t.value === v);

// Rail order, interleaving destinations with actions. Reminders has no route
// row here — the notifications flyout covers it, and still links through to
// the full page.
const RAIL = [
  { type: "route", ...tab("home") },
  { type: "panel", value: "search", label: "Search", icon: SearchRoundedIcon },
  { type: "route", ...tab("pets") },
  { type: "route", ...tab("appointments"), label: "Appointments" },
  { type: "route", ...tab("marketplace") },
  { type: "route", ...tab("chat") },
  {
    type: "panel",
    value: "notifications",
    label: "Notifications",
    icon: NotificationsRoundedIcon,
    badge: "reminders",
    // The reminders page has no rail row of its own, so this one stands in for
    // it — otherwise landing on /app/reminders lights up nothing at all.
    alias: "reminders",
  },
  { type: "menu", value: "create", label: "Create", icon: AddCircleOutlineRoundedIcon },
  { type: "route", ...tab("profile") },
];

const CREATE_ACTIONS = [
  { label: "Add a pet", icon: PetsRoundedIcon, to: "/app/pets" },
  { label: "Book a visit", icon: EventAvailableRoundedIcon, to: "/app/appointments" },
  { label: "New message", icon: ChatRoundedIcon, to: "/app/chat" },
];

const OwnerNavRail = ({ activeTab, badges = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const [hovering, setHovering] = useState(false);
  const [panel, setPanel] = useState(null); // "search" | "notifications" | null
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [createAnchor, setCreateAnchor] = useState(null);

  const menuOpen = Boolean(moreAnchor) || Boolean(createAnchor);
  // A flyout takes the rail's place as the wide surface, so the rail itself
  // stays narrow while one is open.
  const expanded = (hovering && !panel) || menuOpen;

  useEffect(() => {
    if (!panel) return undefined;
    const onKey = (e) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const closeAll = () => {
    setPanel(null);
    setMoreAnchor(null);
    setCreateAnchor(null);
  };

  const go = (to) => {
    closeAll();
    navigate(to);
  };

  const onRowClick = (item, event) => {
    if (item.type === "route") {
      setPanel(null);
      navigate(item.to);
    } else if (item.type === "panel") {
      setPanel((p) => (p === item.value ? null : item.value));
    } else if (item.value === "create") {
      setCreateAnchor(event.currentTarget);
    }
  };

  // An open flyout owns the active state outright — otherwise both it and the
  // underlying page's row would light up and the pill would have two homes.
  const isActive = (item) => {
    if (item.type === "panel") return panel === item.value || (!panel && item.alias === activeTab);
    return !panel && activeTab === item.value;
  };

  const rowSx = {
    position: "relative",
    minHeight: 48,
    px: 0,
    mx: 0.5,
    mb: 0.25,
    borderRadius: 2,
    color: "text.secondary",
    overflow: "hidden",
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      width: ICON_COL,
      display: "flex",
      justifyContent: "center",
      color: "text.disabled",
      zIndex: 1,
    },
    "& .MuiListItemText-root": { zIndex: 1 },
    "&:hover": { bgcolor: "action.hover", color: "text.primary" },
  };

  const activeRowSx = {
    color: "text.primary",
    "& .MuiListItemIcon-root": { color: "primary.main" },
    "& .MuiListItemText-primary": { fontWeight: 700 },
    "&:hover": { bgcolor: "transparent", color: "text.primary" },
  };

  const labelSx = {
    whiteSpace: "nowrap",
    opacity: expanded ? 1 : 0,
    transition: theme.transitions.create("opacity", { duration: 150 }),
  };

  const renderRow = (item) => {
    const active = isActive(item);
    const count = item.badge ? badges[item.badge] ?? 0 : 0;
    const Icon = item.icon;

    const row = (
      <ListItemButton
        onClick={(e) => onRowClick(item, e)}
        sx={{ ...rowSx, ...(active ? activeRowSx : {}) }}
      >
        {/* One pill instance across the whole rail — framer springs it between
            rows on navigation instead of cross-fading two backgrounds. */}
        {active && (
          <MotionBox
            layoutId={RAIL_PILL}
            transition={SPRING}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          />
        )}
        <ListItemIcon>
          {count > 0 ? (
            <Badge badgeContent={count} color="error" max={9}>
              <Icon />
            </Badge>
          ) : (
            <Icon />
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ fontSize: ".95rem", fontWeight: 600 }}
          sx={labelSx}
        />
      </ListItemButton>
    );

    // Collapsed rows are icon-only, so they need a name on hover. The Tooltip
    // stays mounted and is merely disabled when expanded — swapping it in and
    // out would remount the button underneath and restart the pill's layout
    // animation every time the pointer entered the rail.
    return (
      <Tooltip
        key={item.value}
        title={item.label}
        placement="right"
        disableHoverListener={expanded}
        disableFocusListener={expanded}
        disableTouchListener={expanded}
      >
        {row}
      </Tooltip>
    );
  };

  return (
    <Box component="nav" sx={{ width: RAIL_COLLAPSED, flexShrink: 0, position: "relative" }}>
      {/* ------------------------------- Flyout -------------------------------- */}
      {/* Both children are keyed rather than wrapped in a fragment —
          AnimatePresence tracks its children by key, and a bare fragment gives
          it nothing to diff on exit. */}
      <AnimatePresence>
        {panel && (
            <MotionBox
              key="panel-backdrop"
              variants={backdropFade}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setPanel(null)}
              sx={{
                position: "fixed",
                inset: 0,
                left: RAIL_COLLAPSED,
                zIndex: (t) => t.zIndex.appBar - 1,
                bgcolor: alpha(theme.palette.common.black, 0.2),
              }}
            />
        )}
        {panel && (
            <MotionBox
              key="panel-body"
              variants={panelSlide}
              initial="hidden"
              animate="show"
              exit="exit"
              sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: RAIL_COLLAPSED,
                width: PANEL_WIDTH,
                zIndex: (t) => t.zIndex.appBar,
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                boxShadow: `8px 0 32px -12px ${alpha(theme.palette.common.black, 0.24)}`,
              }}
            >
              {panel === "search" ? (
                <OwnerSearchPanel onNavigate={closeAll} />
              ) : (
                <OwnerNotificationsPanel onNavigate={closeAll} />
              )}
            </MotionBox>
        )}
      </AnimatePresence>

      {/* -------------------------------- Rail --------------------------------- */}
      <Box
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: expanded ? RAIL_EXPANDED : RAIL_COLLAPSED,
          zIndex: (t) => t.zIndex.appBar + 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: theme.transitions.create("width", { duration: 200 }),
          boxShadow: expanded ? `0 0 24px ${alpha(theme.palette.common.black, 0.08)}` : "none",
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => go("/app")}
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: 72,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <MotionBox
            whileHover={{ rotate: -12, scale: 1.12 }}
            transition={SPRING}
            sx={{ width: ICON_COL, display: "flex", justifyContent: "center", fontSize: 24, lineHeight: 1 }}
          >
            🐾
          </MotionBox>
          <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.01em", ...labelSx }}>
            PetCare
          </Typography>
        </Box>

        <List sx={{ flex: 1, py: 1, overflowY: "auto", overflowX: "hidden" }} disablePadding>
          {RAIL.map(renderRow)}
        </List>

        {/* More — account actions, mirroring Instagram's bottom-of-rail menu */}
        <Box sx={{ pb: 1, flexShrink: 0 }}>
          <ListItemButton onClick={(e) => setMoreAnchor(e.currentTarget)} sx={rowSx}>
            <ListItemIcon>
              <MenuRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="More"
              primaryTypographyProps={{ fontSize: ".95rem", fontWeight: 600 }}
              sx={labelSx}
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* ------------------------------ Create menu ----------------------------- */}
      <Menu
        anchorEl={createAnchor}
        open={Boolean(createAnchor)}
        onClose={() => setCreateAnchor(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { ml: 1, minWidth: 208, borderRadius: 2.5, border: 1, borderColor: "divider" },
          },
        }}
      >
        {CREATE_ACTIONS.map((a) => (
          <MenuItem key={a.to} onClick={() => go(a.to)}>
            <ListItemIcon>
              <a.icon fontSize="small" />
            </ListItemIcon>
            {a.label}
          </MenuItem>
        ))}
      </Menu>

      {/* ------------------------------- More menu ------------------------------ */}
      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              ml: 1,
              minWidth: 248,
              borderRadius: 2.5,
              border: 1,
              borderColor: "divider",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
          <Avatar
            src={user?.avatarUrl || undefined}
            sx={{ width: 40, height: 40, fontWeight: 800, bgcolor: "primary.main" }}
          >
            {initials || "🐾"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700 }} noWrap>
              {fullName(user) || "Pet parent"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => go("/app/profile")}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          My profile
        </MenuItem>
        <MenuItem onClick={() => go("/app/account/security")}>
          <ListItemIcon>
            <LockOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {user?.hasPassword ? "Change password" : "Set a password"}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setMoreAnchor(null);
            logout();
          }}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OwnerNavRail;
