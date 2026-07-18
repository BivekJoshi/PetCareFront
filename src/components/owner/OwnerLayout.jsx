import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

import { ChatProvider } from "../../context/ChatContext";
import { CallProvider } from "../../context/CallContext";
import { useAuth } from "../../context/AuthContext";
import { useUnreadCount } from "../../hooks/chat/useChat";
import { useReminders } from "../../hooks/reminders/useReminders";
import { fullName } from "../../utility/format";
import VerificationBanners from "../auth/VerificationBanners";
import DashboardBackground from "../dashboard/DashboardBackground";
import { OWNER_MAX_WIDTH } from "../../pages/Owner/ownerUi";
import OwnerNavRail from "./OwnerNavRail";
import OwnerAside, { ASIDE_WIDTH } from "./OwnerAside";
import OwnerTabBar from "./OwnerTabBar";
import { activeTabFor, titleFor, BOTTOM_TABS } from "./ownerNav";
import { pageTransition, EASE } from "./ownerMotion";

const MotionBox = motion(Box);

/**
 * App shell for the PET_OWNER role. Owners are customers, not operators, so
 * this is a consumer-app shell rather than the staff console's dense nav tree.
 *
 * Three shapes off one nav model (see ownerNav.js):
 *
 * - Phone/tablet (< md): sticky top bar, scrolling content, bottom tab bar.
 * - Desktop (>= md): icon rail on the left that expands on hover; no top bar,
 *   since the rail carries the brand and the account menu.
 * - Wide (>= lg): the suggestions aside joins on the right.
 *
 * The rail sits outside the scroll container so it stays put; the content
 * column and the aside scroll together, with the aside sticking to the top.
 */

// Gap between the content column and the aside. Kept in px rather than theme
// spacing units because it also feeds the centered shell's max width.
const ASIDE_GAP = 32;

const OwnerLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const { user } = useAuth();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const showAside = useMediaQuery(theme.breakpoints.up("lg"));

  const remindersQ = useReminders({ limit: 1 });
  const unread = remindersQ.data?.meta?.unread ?? 0;
  const unreadMessagesQ = useUnreadCount();
  const unreadMessages = unreadMessagesQ.data ?? 0;

  const activeTab = activeTabFor(pathname);

  // Messages has no bottom tab, so fall back to Home rather than leaving the
  // phone tab bar with nothing highlighted.
  const bottomTab = BOTTOM_TABS.some((t) => t.value === activeTab) ? activeTab : "home";

  const initials = fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const onHome = pathname === "/app";

  // Feed + aside are centered as a group, so the content column doesn't jump
  // sideways when the aside drops out below lg.
  const shellWidth = showAside ? OWNER_MAX_WIDTH + ASIDE_GAP + ASIDE_WIDTH : OWNER_MAX_WIDTH;

  /* --------------------------- Back to top -------------------------------- */
  // The shell scrolls an inner container, not the window, so the shared
  // ScrollTopFab (which listens to window.scrollY) can't see this scroll. A
  // local listener on the container is the cheaper fix.
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrolled(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Land at the top on every navigation — without this the new page inherits
  // the previous page's scroll offset, which is disorienting mid-transition.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  /* -------------------------- Phone top bar -------------------------------- */
  const mobileHeader = (
    <Box
      component="header"
      sx={{
        flexShrink: 0,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: OWNER_MAX_WIDTH,
          mx: "auto",
          px: 2.5,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Tapping the avatar opens Profile; the title says where you are. */}
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ cursor: "pointer", minWidth: 0 }}
          onClick={() => navigate("/app/profile")}
        >
          <Avatar
            src={user?.avatarUrl || undefined}
            sx={{ width: 40, height: 40, fontWeight: 800, fontSize: ".95rem", bgcolor: "primary.main" }}
          >
            {initials || "🐾"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            {onHome && (
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, display: "block" }}>
                Welcome back
              </Typography>
            )}
            <Typography noWrap sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: "1.05rem" }}>
              {onHome ? user?.firstName || "Pet parent" : titleFor(pathname)}
            </Typography>
          </Box>
        </Stack>

        <Tooltip title="Reminders">
          <IconButton
            onClick={() => navigate("/app/reminders")}
            sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
          >
            <Badge badgeContent={unread} color="error" max={9}>
              {unread > 0 ? <NotificationsRoundedIcon /> : <NotificationsNoneRoundedIcon />}
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <ChatProvider>
      <CallProvider>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            height: "100dvh",
            width: "100%",
            overflow: "hidden",
            // Stays as the fallback surface: the shader canvas paints over it,
            // but if WebGL is unavailable this is what's left.
            bgcolor: "background.default",
          }}
        >
          {/* Ambient Three.js backdrop, shared with the staff shell. Fixed at
              z-index 0 and pointer-events: none — everything else in this shell
              is lifted above it below. */}
          <DashboardBackground />

          {isDesktop && (
            <OwnerNavRail
              activeTab={activeTab}
              badges={{ reminders: unread, messages: unreadMessages }}
            />
          )}

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {!isDesktop && mobileHeader}

            {/* ---------------------------- Scroll area --------------------------- */}
            <Box
              ref={scrollRef}
              sx={{
                flex: 1,
                position: "relative",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: alpha(theme.palette.text.primary, 0.18),
                  borderRadius: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: `${ASIDE_GAP}px`,
                  maxWidth: shellWidth,
                  mx: "auto",
                  px: { xs: 2, md: 3 },
                }}
              >
                {/* Content column */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    maxWidth: OWNER_MAX_WIDTH,
                    pt: { xs: 2, md: 2.5 },
                    pb: { xs: 3, md: 4 },
                  }}
                >
                  {/* VerificationBanners renders nothing when there's nothing to
                      verify, so the gap is conditioned on the box being non-empty
                      — otherwise every page starts with a stray 16px. */}
                  <Box sx={{ "&:not(:empty)": { mb: 2 } }}>
                    <VerificationBanners />
                  </Box>

                  {/* There is no desktop top bar, so the section heading lives in
                      the content. Home has its own greeting hero, and Messages
                      owns its chrome. */}
                  {isDesktop && !onHome && !pathname.startsWith("/app/chat") && (
                    <Typography
                      component="h1"
                      sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.2, mb: 2 }}
                    >
                      {titleFor(pathname)}
                    </Typography>
                  )}

                  {/* Keyed on pathname so each route change is a discrete
                      enter/exit; mode="wait" stops the two pages overlapping
                      and doubling the column height mid-transition.

                      useOutlet() rather than <Outlet /> is load-bearing: the
                      exiting copy stays mounted through its animation, and a
                      live <Outlet /> would re-read route context and render
                      the *incoming* page — so you'd watch the new content play
                      the exit animation. useOutlet() hands back an element that
                      AnimatePresence can hold frozen. */}
                  <AnimatePresence mode="wait" initial={false}>
                    <MotionBox
                      key={pathname}
                      initial={pageTransition.initial}
                      animate={pageTransition.animate}
                      exit={pageTransition.exit}
                    >
                      {outlet}
                    </MotionBox>
                  </AnimatePresence>
                </Box>

                {showAside && <OwnerAside />}
              </Box>

              {/* --------------------------- Back to top -------------------------- */}
              <AnimatePresence>
                {scrolled && (
                  <Tooltip title="Back to top" placement="left">
                    <MotionBox
                      component="button"
                      type="button"
                      aria-label="Scroll back to top"
                      onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                      initial={{ opacity: 0, scale: 0.6, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 12 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.92 }}
                      sx={{
                        position: "fixed",
                        // Clears the 68px phone tab bar; on desktop there is no
                        // tab bar, so it sits closer to the edge. Fixed (not
                        // sticky) because no ancestor here is transformed —
                        // the page-transition wrapper is a sibling, not a
                        // parent, so it can't break the containing block.
                        bottom: { xs: 84, md: 32 },
                        right: { xs: 20, md: 32 },
                        zIndex: (t) => t.zIndex.fab,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "50%",
                        color: "#fff",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: `0 6px 12px -4px ${alpha(theme.palette.primary.main, 0.5)}`,
                      }}
                    >
                      <KeyboardArrowUpRoundedIcon />
                    </MotionBox>
                  </Tooltip>
                )}
              </AnimatePresence>
            </Box>

            {/* ---------------------------- Bottom tabs --------------------------- */}
            {!isDesktop && (
              <OwnerTabBar
                activeTab={bottomTab}
                badges={{ reminders: unread, messages: unreadMessages }}
              />
            )}
          </Box>
        </Box>
      </CallProvider>
    </ChatProvider>
  );
};

export default OwnerLayout;
