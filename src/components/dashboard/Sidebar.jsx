 
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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import { NAV_SECTIONS, isVisible } from "./navItems";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";

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
      })
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
    activeBg,
    activeBgChild,
  } = theme.palette.sidebar;

  const activeStyles = {
    color: accent,
    bgcolor: activeBg,
    "&::before": { backgroundColor: accent },
    "& .MuiListItemIcon-root": { color: accent },
    "& .MuiListItemText-primary": { fontWeight: 700 },
  };

  const navItemSx = {
    position: "relative",
    borderRadius: "0 10px 10px 0",
    mb: 0.25,
    py: 1,
    pl: mini ? 1 : 2.25,
    pr: mini ? 1 : 1.5,
    justifyContent: mini ? "center" : "flex-start",
    color: sbTextDim,
    overflow: "hidden",
    transition: "background-color .2s ease, color .2s ease",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "18%",
      bottom: "18%",
      width: 3,
      borderRadius: "0 4px 4px 0",
      backgroundColor: "transparent",
      transition: "background-color .2s ease",
    },
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
    borderRadius: "0 8px 8px 0",
    mb: 0.25,
    py: 0.65,
    pl: 3,
    ml: 1.5,
    color: sbTextDim,
    transition: "background-color .2s ease, color .2s ease",
    // guide line down the left of the child group
    "&::before": {
      content: '""',
      position: "absolute",
      left: -2,
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: sbDivider,
    },
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
      bgcolor: activeBgChild,
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
        <ListItemIcon sx={{ minWidth: mini ? 0 : 38, justifyContent: "center" }}>
          {leaf.icon ? <leaf.icon fontSize="small" /> : null}
        </ListItemIcon>
        {!mini && (
          <ListItemText
            primary={leaf.label}
            primaryTypographyProps={{ fontWeight: 600, fontSize: ".9rem" }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );

  const renderGroup = (group) => {
    const Icon = group.icon;
    const groupActive = isGroupActive(group, pathname);
    const visibleChildren = (group.children || []).filter((c) =>
      isVisible(c, role)
    );

    // --- mini rail: icon opens a flyout menu with the children ---
    if (mini) {
      return (
        <Tooltip key={group.label} title={group.label} placement="right" arrow>
          <ListItemButton
            onClick={(e) =>
              setFlyout({ anchorEl: e.currentTarget, group })
            }
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
          <ListItemIcon sx={{ minWidth: 38, justifyContent: "center" }}>
            {Icon ? <Icon fontSize="small" /> : null}
          </ListItemIcon>
          <ListItemText
            primary={group.label}
            primaryTypographyProps={{ fontWeight: 600, fontSize: ".9rem" }}
          />
          {open ? (
            <ExpandLessIcon fontSize="small" sx={{ opacity: 0.6 }} />
          ) : (
            <ExpandMoreIcon fontSize="small" sx={{ opacity: 0.6 }} />
          )}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {visibleChildren.map((child) => (
              <ListItemButton
                key={child.to}
                component={RouterNavLink}
                to={child.to}
                end={child.end}
                onClick={handleNavigate}
                sx={childItemSx}
              >
                <ListItemIcon sx={{ minWidth: 32, justifyContent: "center" }}>
                  {child.icon ? <child.icon sx={{ fontSize: 18 }} /> : null}
                </ListItemIcon>
                <ListItemText
                  primary={child.label}
                  primaryTypographyProps={{ fontSize: ".85rem", fontWeight: 500 }}
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
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // solid dark backdrop for the sidebar
        backgroundColor: sidebarBg,
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
        }}
        onClick={() => navigate("/")}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            fontSize: 22,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${primary} 0%, ${alpha(
              primary,
              0.7
            )} 100%)`,
            boxShadow: `0 8px 18px -8px ${alpha(primary, 0.9)}`,
          }}
        >
          🐾
        </Box>
        {!mini && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.01em", color: sbText }}
            >
              PetCare
            </Typography>
            <Typography variant="caption" sx={{ color: sbTextDim }}>
              Care, simplified
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sectioned navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          pl: 0,
          pr: mini ? 1 : 1.5,
          py: 1.5,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: sbScrollThumb,
            borderRadius: 3,
          },
        }}
      >
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter((it) => isVisible(it, role));
          if (!items.length) return null;
          return (
            <Box key={section.heading} sx={{ mb: 1.5 }}>
              {mini ? (
                <Divider sx={{ mx: 1, my: 1, borderColor: sbDivider }} />
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    pl: 2.25,
                    pr: 1.5,
                    mb: 0.5,
                    fontWeight: 700,
                    fontSize: ".68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: sbTextFaint,
                  }}
                >
                  {section.heading}
                </Typography>
              )}
              <List disablePadding>
                {items.map((item) =>
                  item.children ? renderGroup(item) : renderLeaf(item)
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
        slotProps={{ paper: { sx: { ml: 1, minWidth: 200, borderRadius: 2.5 } } }}
      >
        {flyout.group && (
          <Box sx={{ px: 2, py: 0.75 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: ".06em" }}>
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
                "&.active": {
                  color: "primary.main",
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
      <Box sx={{ p: 1.5 }}>
        {mini ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Tooltip title={fullName(user) || "User"} placement="right" arrow>
              <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontWeight: 700 }}>
                {initials || "U"}
              </Avatar>
            </Tooltip>
            <Tooltip title="Sign out" placement="right" arrow>
              <IconButton size="small" onClick={() => logout()} sx={{ color: sbTextDim }}>
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
              p: 1.25,
              borderRadius: 3,
              bgcolor: sbSurface,
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontWeight: 700 }}>
              {initials || "U"}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: ".9rem", lineHeight: 1.2, color: sbText }}>
                {fullName(user) || "User"}
              </Typography>
              <Typography noWrap variant="caption" sx={{ color: sbTextDim }}>
                {humanize(role || "")}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton size="small" onClick={() => logout()} sx={{ color: sbTextDim }}>
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
