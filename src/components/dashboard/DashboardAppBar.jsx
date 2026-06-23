 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";
import ThemeToggle from "../common/ThemeToggle";
import {
  useCommandPalette,
  IS_MAC,
} from "../../context/CommandPaletteContext";
import { useUnreadCount } from "../../hooks/chat/useChat";

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
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { mutate: logout } = useLogout();
  const { openPalette } = useCommandPalette();
  const { data: unread = 0 } = useUnreadCount();
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

        {/* Command palette trigger — pill on desktop, icon on mobile (⌘/Ctrl+K) */}
        <Box
          role="button"
          tabIndex={0}
          onClick={openPalette}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPalette();
            }
          }}
          sx={{
            display: { xs: "none", md: "inline-flex" },
            alignItems: "center",
            gap: 1,
            height: 38,
            pl: 1.5,
            pr: 1,
            cursor: "pointer",
            borderRadius: 999,
            border: 1,
            borderColor: "divider",
            color: "text.secondary",
            bgcolor: alpha(theme.palette.text.primary, 0.03),
            transition: "border-color .2s ease, background-color .2s ease",
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.5),
              bgcolor: alpha(theme.palette.primary.main, 0.06),
            },
          }}
        >
          <SearchRoundedIcon fontSize="small" />
          <Typography variant="body2" sx={{ mr: 2 }}>
            Search…
          </Typography>
          <Box
            component="kbd"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              px: 0.75,
              height: 22,
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: 700,
              color: "text.secondary",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {IS_MAC ? "⌘" : "Ctrl"} K
          </Box>
        </Box>

        <Tooltip title="Search (⌘/Ctrl + K)">
          <IconButton
            onClick={openPalette}
            size="small"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <SearchRoundedIcon />
          </IconButton>
        </Tooltip>

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

        <Tooltip title="Messages">
          <IconButton onClick={() => navigate("/app/chat")} size="small">
            <Badge badgeContent={unread} color="error" max={99}>
              <ChatBubbleOutlineRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

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
              navigate("/app/account/security");
            }}
          >
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {user?.hasPassword ? "Change password" : "Set a password"}
          </MenuItem>
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
