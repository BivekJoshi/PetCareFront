 
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
  useScrollTrigger,
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

  // Scroll-aware "tint": the bar is near-transparent at the very top of the
  // page and fades into a frosted, primary-tinted glass as soon as the user
  // scrolls. `solid` flips once past a small threshold.
  const solid = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
  const tint = theme.palette.primary.main;

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Shared hover treatment so every action icon in the bar feels like one set.
  const actionIconSx = {
    color: "text.secondary",
    transition: "color .2s ease, background-color .2s ease",
    "&:hover": {
      color: "primary.main",
      bgcolor: alpha(theme.palette.primary.main, 0.08),
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        transition:
          "background-color .35s ease, box-shadow .35s ease, border-color .35s ease, backdrop-filter .35s ease, " +
          widthTransition,
        color: "text.primary",
        // Scroll-aware teal "tint": always a frosted glass bar, but lighter at
        // the top of the page and deeper / more tinted once scrolled. The paper
        // base keeps it readable in both light & dark mode; the primary-tinted
        // gradient on top is what reads as the tint.
        backgroundColor: alpha(
          theme.palette.background.paper,
          solid ? 0.85 : 0.7,
        ),
        backgroundImage: `linear-gradient(90deg, ${alpha(
          tint,
          solid ? 0.1 : 0.05,
        )} 0%, ${alpha(tint, solid ? 0.04 : 0.02)} 55%, ${alpha(
          tint,
          solid ? 0.08 : 0.04,
        )} 100%)`,
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        borderBottom: 1,
        borderColor: solid ? alpha(tint, 0.18) : alpha(tint, 0.1),
        boxShadow: solid
          ? `0 8px 24px -16px ${alpha(tint, 0.9)}, 0 1px 0 ${alpha(tint, 0.06)}`
          : `0 2px 8px -6px ${alpha(tint, 0.5)}`,
      }}
    >
      <Toolbar sx={{ gap: 0.5, minHeight: 64, px: { xs: 1.5, sm: 2 } }}>
        {/* Mobile drawer toggle */}
        <IconButton
          edge="start"
          onClick={onToggleMobile}
          sx={{ ...actionIconSx, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop collapse toggle */}
        <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <IconButton
            edge="start"
            onClick={onToggleCollapse}
            sx={{ ...actionIconSx, display: { xs: "none", md: "inline-flex" }, mr: 0.5 }}
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
            sx={{ ...actionIconSx, display: { xs: "inline-flex", md: "none" } }}
          >
            <SearchRoundedIcon />
          </IconButton>
        </Tooltip>

        <Chip
          label={humanize(role || "")}
          size="small"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            ml: 0.5,
            fontWeight: 700,
            letterSpacing: 0.2,
            border: 1,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        />

        {/* Action cluster: messages / theme / back-to-site, grouped together
            and separated from the avatar by a hairline divider. */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.25,
            ml: { xs: 0, sm: 0.5 },
          }}
        >
          <Tooltip title="Messages">
            <IconButton onClick={() => navigate("/app/chat")} size="small" sx={actionIconSx}>
              <Badge badgeContent={unread} color="error" max={99}>
                <ChatBubbleOutlineRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <ThemeToggle />

          <Tooltip title="Back to site">
            <IconButton onClick={() => navigate("/")} size="small" sx={actionIconSx}>
              <HomeOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 0.75, my: 1.5, borderColor: "divider" }}
        />

        <Tooltip title="Account">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{
              p: 0.5,
              borderRadius: 999,
              transition: "background-color .2s ease",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
            }}
          >
            <Avatar
              src={user?.avatarUrl || undefined}
              sx={{
                bgcolor: "primary.alt",
                color: "primary.main",
                fontWeight: 700,
                fontSize: 15,
                width: 36,
                height: 36,
                border: 2,
                borderColor: alpha(theme.palette.primary.main, 0.25),
              }}
            >
              {initials || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                mt: 1,
                minWidth: 248,
                borderRadius: 2.5,
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
                boxShadow: `0 10px 15px -3px ${alpha(theme.palette.common.black, 0.12)}, 0 4px 6px -4px ${alpha(theme.palette.common.black, 0.1)}`,
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
            <Avatar
              src={user?.avatarUrl || undefined}
              sx={{
                bgcolor: "primary.alt",
                color: "primary.main",
                fontWeight: 700,
                width: 40,
                height: 40,
              }}
            >
              {initials || "U"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {fullName(user)}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
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
