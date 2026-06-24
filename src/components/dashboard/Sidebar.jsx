import { useState } from "react";
import {
  useLocation,
  useNavigate,
  NavLink as RouterNavLink,
} from "react-router-dom";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import { NAV_SECTIONS, isVisible } from "./navItems";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";

import Logo from "../../assets/LogoYejuDark.svg";
import LogoIcon from "../../assets/LogoIcon.svg";

const matchLeaf = (leaf, pathname) =>
  leaf.end ? pathname === leaf.to : pathname.startsWith(leaf.to);

const isGroupActive = (group, pathname) =>
  (group.children || []).some((c) => matchLeaf(c, pathname));

/**
 * Dashboard sidebar — sectioned, supports nested (expandable) groups, a
 * compact "mini" rail mode with flyout sub-menus, and a user footer.
 * Stateless about width: the parent decides `mini`; everything else is local.
 */
const Sidebar = ({ mini = false, onNavigate }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { mutate: logout } = useLogout();

  // which groups are expanded (expanded mode) — seed open the active group
  const [openGroups, setOpenGroups] = useState(() => {
    const seed = {};
    NAV_SECTIONS.forEach((s) =>
      s.items.forEach((it) => {
        if (it.children && isGroupActive(it, pathname)) seed[it.label] = true;
      }),
    );
    return seed;
  });

  // mini-mode flyout state (anchor + the group whose children to show)
  const [flyout, setFlyout] = useState({ anchorEl: null, group: null });

  const toggleGroup = (label) =>
    setOpenGroups((o) => ({ ...o, [label]: !o[label] }));

  const primary = theme.palette.primary.main;

  // Sidebar palette — centralized in the theme (theme.palette.sidebar) so it
  // tracks the active color mode instead of hard-coding hex values here.
  const {
    bg: sidebarBg,
    text: sbText,
    textDim: sbTextDim,
    textFaint: sbTextFaint,
    divider: sbDivider,
    hover: sbHover,
    surface: sbSurface,
    scrollThumb: sbScrollThumb,
    accent,
    activeBgChild,
  } = theme.palette.sidebar;

  // A soft, layered backdrop: the flat sidebar colour with two faint radial
  // accents bleeding in from the corners + a vertical sheen. Reads as depth
  // without fighting the content.
  const backdrop = `
    radial-gradient(120% 90% at 0% 0%, ${alpha(primary, 0.14)} 0%, transparent 42%),
    radial-gradient(120% 80% at 100% 100%, ${alpha(primary, 0.1)} 0%, transparent 46%),
    linear-gradient(180deg, ${alpha("#FFFFFF", 0.03)} 0%, transparent 22%),
    ${sidebarBg}
  `;

  // Active nav item — a soft accent-tinted gradient fill. No bars, no chips.
  const activeStyles = {
    color: accent,
    background: `linear-gradient(100deg, ${alpha(primary, 0.22)} 0%, ${alpha(
      primary,
      0.1,
    )} 60%, transparent 100%)`,
    "& .MuiListItemIcon-root": { color: accent },
    "& .MuiListItemText-primary": { fontWeight: 700 },
  };

  const navItemSx = {
    position: "relative",
    borderRadius: 1,
    mx: mini ? 0 : 0.5,
    mb: 0.2,
    py: 0.55,
    pl: mini ? 1 : 1.5,
    pr: mini ? 1 : 1.25,
    justifyContent: mini ? "center" : "flex-start",
    color: sbTextDim,
    transition: "background-color .2s ease, color .2s ease",
    "& .MuiListItemIcon-root": {
      color: sbTextFaint,
      transition: "color .2s ease",
    },
    "&:hover": {
      bgcolor: sbHover,
      color: sbText,
      "& .MuiListItemIcon-root": { color: sbText },
    },
    "&.active": activeStyles,
  };

  const childItemSx = {
    position: "relative",
    borderRadius: 1,
    mb: 0.15,
    py: 0.35,
    pl: 2,
    ml: 2,
    color: sbTextDim,
    transition: "background-color .2s ease, color .2s ease",
    "& .MuiListItemIcon-root": {
      color: sbTextFaint,
      transition: "color .2s ease",
    },
    "&:hover": {
      bgcolor: sbHover,
      color: sbText,
      "& .MuiListItemIcon-root": { color: sbText },
    },
    "&.active": {
      color: accent,
      background: `linear-gradient(100deg, ${activeBgChild} 0%, transparent 90%)`,
      "& .MuiListItemIcon-root": { color: accent },
      "& .MuiListItemText-primary": { fontWeight: 700 },
    },
  };

  const closeFlyout = () => setFlyout({ anchorEl: null, group: null });

  const handleNavigate = () => {
    closeFlyout();
    onNavigate?.();
  };

  /* ---------- renderers ---------- */

  const renderLeaf = (leaf) => (
    <Tooltip
      key={leaf.to}
      title={mini ? leaf.label : ""}
      placement="right"
      arrow
      disableHoverListener={!mini}
      disableFocusListener={!mini}
      disableTouchListener={!mini}
    >
      <ListItemButton
        component={RouterNavLink}
        to={leaf.to}
        end={leaf.end}
        onClick={handleNavigate}
        sx={navItemSx}
      >
        <ListItemIcon
          sx={{ minWidth: mini ? 0 : 30, mr: mini ? 0 : 1, justifyContent: "center" }}
        >
          {leaf.icon ? <leaf.icon fontSize="small" /> : null}
        </ListItemIcon>
        {!mini && (
          <ListItemText
            primary={leaf.label}
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: ".875rem",
              noWrap: true,
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );

  const renderGroup = (group) => {
    const Icon = group.icon;
    const groupActive = isGroupActive(group, pathname);
    const visibleChildren = (group.children || []).filter((c) =>
      isVisible(c, role),
    );

    // --- mini rail: icon opens a flyout menu with the children ---
    if (mini) {
      return (
        <Tooltip key={group.label} title={group.label} placement="right" arrow>
          <ListItemButton
            onClick={(e) => setFlyout({ anchorEl: e.currentTarget, group })}
            sx={{ ...navItemSx, ...(groupActive ? activeStyles : {}) }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              {Icon ? <Icon fontSize="small" /> : null}
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      );
    }

    // --- expanded: toggle a Collapse of child links ---
    const open = !!openGroups[group.label];
    return (
      <Box key={group.label}>
        <ListItemButton
          onClick={() => toggleGroup(group.label)}
          sx={{ ...navItemSx, ...(groupActive ? activeStyles : {}) }}
        >
          <ListItemIcon sx={{ minWidth: 30, mr: 1, justifyContent: "center" }}>
            {Icon ? <Icon fontSize="small" /> : null}
          </ListItemIcon>
          <ListItemText
            primary={group.label}
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: ".875rem",
              noWrap: true,
            }}
          />
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              opacity: 0.55,
              transition: "transform .25s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ mt: 0.25 }}>
            {visibleChildren.map((child) => (
              <ListItemButton
                key={child.to}
                component={RouterNavLink}
                to={child.to}
                end={child.end}
                onClick={handleNavigate}
                sx={childItemSx}
              >
                <ListItemIcon sx={{ minWidth: 30, justifyContent: "center" }}>
                  {child.icon ? <child.icon sx={{ fontSize: 17 }} /> : null}
                </ListItemIcon>
                <ListItemText
                  primary={child.label}
                  primaryTypographyProps={{
                    fontSize: ".82rem",
                    fontWeight: 500,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 1)
    .join("")
    .toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // layered backdrop for depth (see `backdrop` above)
        background: backdrop,
        color: sbText,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: mini ? "center" : "flex-start",
          gap: 1.5,
          px: mini ? 1 : 2.5,
          minHeight: 62,
          cursor: "pointer",
          borderBottom: 1,
          borderColor: sbDivider,
          transition: "background-color .2s ease",
          "&:hover": { backgroundColor: sbHover },
        }}
        onClick={() => navigate("/")}
      >
        {mini ? (
          <Box
            component="img"
            src={LogoIcon}
            alt="logo"
            sx={{
              height: 30,
              width: "auto",
              display: "block",
              filter: `drop-shadow(0 2px 8px ${alpha(primary, 0.5)})`,
            }}
          />
        ) : (
          <Box
            component="img"
            src={Logo}
            alt="logo"
            sx={{ height: 60, width: "auto", display: "block" }}
          />
        )}
      </Box>

      {/* Sectioned navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: mini ? 1 : 0.75,
          py: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: sbScrollThumb,
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: alpha(accent, 0.4),
          },
        }}
      >
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter((it) => isVisible(it, role));
          if (!items.length) return null;
          return (
            <Box key={section.heading} sx={{ mb: 0.75 }}>
              {mini ? (
                <Divider sx={{ mx: 1, my: 0.75, borderColor: sbDivider }} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pl: 2,
                    pr: 1.5,
                    mb: 0.35,
                  }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${accent}, ${alpha(
                        accent,
                        0.3,
                      )})`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: ".66rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: sbTextFaint,
                    }}
                  >
                    {section.heading}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      background: `linear-gradient(90deg, ${sbDivider}, transparent)`,
                    }}
                  />
                </Box>
              )}
              <List disablePadding>
                {items.map((item) =>
                  item.children ? renderGroup(item) : renderLeaf(item),
                )}
              </List>
            </Box>
          );
        })}
      </Box>

      {/* Mini-mode flyout for a group's children */}
      <Menu
        anchorEl={flyout.anchorEl}
        open={Boolean(flyout.anchorEl)}
        onClose={closeFlyout}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              ml: 1.25,
              minWidth: 210,
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${alpha(primary, 0.18)}`,
              boxShadow: `0 16px 40px -12px ${alpha("#000", 0.5)}`,
            },
          },
        }}
      >
        {flyout.group && (
          <Box
            sx={{
              px: 2,
              py: 1,
              mb: 0.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: `linear-gradient(135deg, ${alpha(primary, 0.1)}, transparent)`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: ".08em",
                color: "primary.main",
              }}
            >
              {flyout.group.label.toUpperCase()}
            </Typography>
          </Box>
        )}
        {(flyout.group?.children || [])
          .filter((c) => isVisible(c, role))
          .map((child) => (
            <MenuItem
              key={child.to}
              component={RouterNavLink}
              to={child.to}
              end={child.end}
              onClick={handleNavigate}
              sx={{
                borderRadius: 1.5,
                mx: 0.75,
                my: 0.15,
                py: 0.75,
                "&.active": {
                  color: "primary.main",
                  bgcolor: alpha(primary, 0.1),
                  fontWeight: 700,
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34 }}>
                {child.icon ? <child.icon fontSize="small" /> : null}
              </ListItemIcon>
              {child.label}
            </MenuItem>
          ))}
      </Menu>

      <Divider sx={{ mx: mini ? 1 : 2, borderColor: sbDivider }} />

      {/* User footer */}
      <Box sx={{ p: 1.25 }}>
        {mini ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Sign out" placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => logout()}
                sx={{
                  color: sbTextDim,
                  "&:hover": {
                    color: "#F87171",
                    bgcolor: alpha("#F87171", 0.12),
                  },
                }}
              >
                <LogoutOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              p: 0.5,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${alpha(primary, 0.12)} 0%, ${sbSurface} 55%)`,
              border: `1px solid ${sbDivider}`,
              boxShadow: `inset 0 1px 0 ${alpha("#FFFFFF", 0.05)}`,
              transition: "border-color .2s ease, background .2s ease",
              "&:hover": {
                borderColor: alpha(accent, 0.4),
              },
            }}
          >
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Avatar
                src={user?.avatarUrl || undefined}
                sx={{
                  bgcolor: "primary.main",
                  width: 30,
                  height: 30,
                  fontWeight: 700,
                  boxShadow: `0 4px 14px -4px ${alpha(primary, 0.8)}`,
                }}
              >
                {initials || "U"}
              </Avatar>
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 700,
                  fontSize: ".88rem",
                  lineHeight: 1.25,
                  color: sbText,
                }}
              >
                {fullName(user) || "User"}
              </Typography>
              <Typography
                noWrap
                variant="caption"
                sx={{
                  color: accent,
                  fontWeight: 600,
                  fontSize: ".7rem",
                  letterSpacing: ".02em",
                }}
              >
                {humanize(role || "")}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton
                size="small"
                onClick={() => logout()}
                sx={{
                  color: sbTextDim,
                  "&:hover": {
                    color: "#F87171",
                    bgcolor: alpha("#F87171", 0.12),
                  },
                }}
              >
                <LogoutOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
