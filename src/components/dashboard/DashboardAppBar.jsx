/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";
import ThemeToggle from "../common/ThemeToggle";

/**
 * Top app bar for the dashboard shell. Layout concerns (sidebar width and the
 * width/margin transition) are passed in; everything else — user menu, logout,
 * sidebar toggles — is handled here.
 */
const DashboardAppBar = ({
  sidebarWidth,
  widthTransition,
  collapsed,
  onToggleCollapse,
  onToggleMobile,
  title = "Dashboard",
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { mutate: logout } = useLogout();
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        transition: widthTransition,
        color: "text.primary",
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(10px)",
        borderBottom: 1,
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 62 }}>
        {/* Mobile drawer toggle */}
        <IconButton
          edge="start"
          onClick={onToggleMobile}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop collapse toggle */}
        <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <IconButton
            edge="start"
            onClick={onToggleCollapse}
            sx={{ display: { xs: "none", md: "inline-flex" }, mr: 0.5 }}
          >
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Tooltip>

        {/* Page title + breadcrumb trail */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: { xs: "none", sm: "block" }, mt: 0.25 }}>
            <DashboardBreadcrumbs variant="inline" />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Chip
          label={humanize(role || "")}
          size="small"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            fontWeight: 700,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          }}
        />

        <ThemeToggle />

        <Tooltip title="Back to site">
          <IconButton onClick={() => navigate("/")} size="small">
            <HomeOutlinedIcon />
          </IconButton>
        </Tooltip>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
          <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38 }}>
            {initials || "U"}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 224, borderRadius: 2 } } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography sx={{ fontWeight: 700 }}>{fullName(user)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardAppBar;
