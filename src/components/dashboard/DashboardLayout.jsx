import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Drawer, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LEAVES } from "./navItems";
import Sidebar from "./Sidebar";
import DashboardAppBar from "./DashboardAppBar";
import DashboardBackground from "./DashboardBackground";
import { CommandPaletteProvider } from "../../context/CommandPaletteContext";
import { ChatProvider } from "../../context/ChatContext";
import { CallProvider } from "../../context/CallContext";
import ScrollTopFab from "../common/ScrollTopFab";

const DRAWER_WIDTH = 264;
const COLLAPSED_WIDTH = 84;
const COLLAPSE_KEY = "petcare:sidebar-collapsed";

const DashboardLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore persistence errors (e.g. private mode) */
    }
  }, [collapsed]);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
  const widthTransition = theme.transitions.create(
    ["width", "margin", "padding"],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }
  );

  // active leaf → drives the app-bar page title
  const activeItem = NAV_LEAVES.find((i) =>
    i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)
  );

  return (
    <ChatProvider>
    <CallProvider>
    <CommandPaletteProvider>
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      {/* Ambient Three.js backdrop */}
      <DashboardBackground />

      <DashboardAppBar
        sidebarWidth={sidebarWidth}
        widthTransition={widthTransition}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onToggleMobile={() => setMobileOpen((o) => !o)}
        title={activeItem?.label || "Dashboard"}
      />

      {/* Sidebar — permanent on desktop, temporary drawer on mobile */}
      <Box
        component="nav"
        sx={{
          width: { md: sidebarWidth },
          flexShrink: { md: 0 },
          transition: widthTransition,
          position: "relative",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: "none" },
          }}
        >
          <Sidebar mini={false} onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              overflowX: "hidden",
              transition: widthTransition,
              borderRight: 1,
              borderColor: "divider",
              backgroundColor: theme.palette.sidebar.bg,
            },
          }}
        >
          <Sidebar mini={collapsed} />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          transition: widthTransition,
        }}
      >
        <Toolbar sx={{ minHeight: 62 }} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Floating "back to top" — appears once the page is scrolled down */}
      <ScrollTopFab />
    </Box>
    </CommandPaletteProvider>
    </CallProvider>
    </ChatProvider>
  );
};

export default DashboardLayout;
