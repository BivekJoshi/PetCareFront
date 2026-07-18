import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { useAppointments } from "../../hooks/appointments/useAppointments";
import { useBusinesses } from "../../hooks/marketplace/useMarketplace";
import { useConversations } from "../../hooks/chat/useChat";
import { usePets } from "../../hooks/pets/usePets";
import { useReminders } from "../../hooks/reminders/useReminders";
import { REMINDER_TYPE_COLORS, humanize } from "../../constants/domain";
import { displayName, fullName, formatDateTime, timeAgo } from "../../utility/format";
import { petEmoji } from "../../pages/Owner/ownerUi";
// Presence-aware avatar, already the standard for anything chat-shaped.
import UserAvatar from "../../pages/Chat/UserAvatar";
import { SPRING, staggerParent, staggerChild } from "./ownerMotion";

const MotionBox = motion(Box);

/**
 * The owner app's right column — the "what's next / who's out there" rail,
 * modelled on Instagram's suggestions sidebar.
 *
 * Stacked, in descending urgency: who you are → your pets → what's next →
 * what's due → who to discover → who's messaging. Everything here is a
 * shortcut into a full page; nothing is edited in place, so each block stays a
 * read-only teaser and the rail never becomes a second form surface.
 *
 * Blocks cascade in on mount rather than appearing at once — with six of them
 * a simultaneous fade reads as a flash.
 *
 * Desktop-only — OwnerLayout hides it below the lg breakpoint, where the
 * content column needs the full width.
 */

export const ASIDE_WIDTH = 340;

// Section heading with an optional "See all" affordance.
const Heading = ({ children, onSeeAll }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
      {children}
    </Typography>
    {onSeeAll && (
      <Typography
        variant="caption"
        onClick={onSeeAll}
        sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "primary.main" } }}
      >
        See all
      </Typography>
    )}
  </Stack>
);

// One avatar + two-line row, shared by every list in the rail. `avatar` is a
// node so chat rows can hand in a presence-aware UserAvatar while business
// rows pass a plain logo.
const Row = ({ avatar, title, subtitle, trailing, onClick }) => (
  <MotionBox
    whileHover={{ x: 3 }}
    transition={SPRING}
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      py: 0.75,
      px: 0.75,
      mx: -0.75,
      borderRadius: 2,
      cursor: "pointer",
      "&:hover": { bgcolor: "action.hover" },
    }}
  >
    {avatar}
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography noWrap sx={{ fontWeight: 700, fontSize: ".85rem", lineHeight: 1.3 }}>
        {title}
      </Typography>
      <Typography noWrap variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {subtitle}
      </Typography>
    </Box>
    {trailing}
  </MotionBox>
);

// One stacked block. Each is a stagger child, so the rail cascades top-down.
const Block = ({ children, first }) => (
  <MotionBox variants={staggerChild} sx={{ mt: first ? 0 : 3 }}>
    {children}
  </MotionBox>
);

// Image-or-initials avatar for the rows that aren't people (businesses) and
// for the viewer's own card, which has a real photo URL.
const Logo = ({ src, fallback }) => (
  <Avatar
    src={src || undefined}
    sx={{ width: 40, height: 40, fontSize: ".9rem", fontWeight: 700, bgcolor: "primary.main" }}
  >
    {fallback}
  </Avatar>
);

const RowSkeleton = () => (
  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 0.75 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} />
    </Box>
  </Stack>
);

const initialsOf = (name) =>
  (name || "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const OwnerAside = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useChatContext();

  // The appointments endpoint has no "upcoming" filter and always sorts newest
  // scheduled first, so over-fetch a page and narrow it here.
  const apptQ = useAppointments({ limit: 20 });
  const nextVisit = useMemo(() => {
    const now = Date.now();
    return (apptQ.data?.items ?? [])
      .filter(
        (a) =>
          ["PENDING", "CONFIRMED"].includes(a.status) &&
          new Date(a.scheduledAt).getTime() >= now
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0] ?? null;
  }, [apptQ.data]);

  const bizQ = useBusinesses({ sort: "topRated", limit: 5 });
  const businesses = bizQ.data?.items ?? [];

  const convQ = useConversations();
  const conversations = (convQ.data ?? []).slice(0, 3);

  const petsQ = usePets({ limit: 8 });
  const pets = petsQ.data?.items ?? [];

  // Unread reminders, soonest first — the panel handles the full list, so the
  // rail only ever teases the top three.
  const remindersQ = useReminders({ limit: 10 });
  const dueSoon = useMemo(
    () =>
      (remindersQ.data?.items ?? [])
        .filter((r) => !(r.isRead ?? r.read))
        .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
        .slice(0, 3),
    [remindersQ.data]
  );

  return (
    <MotionBox
      component="aside"
      variants={staggerParent}
      initial="hidden"
      animate="show"
      sx={{
        width: ASIDE_WIDTH,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        pt: 2.5,
        pb: 4,
        // Six blocks overrun a laptop viewport, and a sticky element taller
        // than the screen strands its own bottom — so the rail scrolls itself.
        // The scrollbar is hidden: it sits beside the page scrollbar and two
        // parallel tracks look broken.
        maxHeight: "100dvh",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* ------------------------------- Identity ------------------------------ */}
      <Block first>
      <Row
        avatar={<Logo src={user?.avatarUrl} fallback={initialsOf(fullName(user)) || "🐾"} />}
        title={fullName(user) || "Pet parent"}
        subtitle="Pet parent"
        onClick={() => navigate("/app/profile")}
        trailing={
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "primary.main", flexShrink: 0 }}
          >
            View
          </Typography>
        }
      />
      </Block>

      {/* -------------------------------- Pets --------------------------------- */}
      <Block>
        <Heading onSeeAll={() => navigate("/app/pets")}>Your pets</Heading>
        {petsQ.isLoading ? (
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="circular" width={48} height={48} />
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {pets.map((p) => (
              <Tooltip key={p.id} title={p.name}>
                <MotionBox
                  whileHover={{ y: -4, scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  onClick={() => navigate("/app/pets")}
                  sx={{
                    width: 48,
                    height: 48,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 24,
                    lineHeight: 1,
                    borderRadius: "50%",
                    cursor: "pointer",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.18),
                  }}
                >
                  {petEmoji(p.species)}
                </MotionBox>
              </Tooltip>
            ))}
            {/* Always offer the add affordance — an owner with no pets yet sees
                only this, which is the right first step for them. */}
            <Tooltip title="Add a pet">
              <MotionBox
                whileHover={{ y: -4, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={() => navigate("/app/pets")}
                sx={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "text.disabled",
                  border: 2,
                  borderStyle: "dashed",
                  borderColor: "divider",
                }}
              >
                <AddRoundedIcon fontSize="small" />
              </MotionBox>
            </Tooltip>
          </Stack>
        )}
      </Block>

      {/* ------------------------------ Next visit ----------------------------- */}
      <Block>
        <Heading onSeeAll={() => navigate("/app/appointments")}>Next visit</Heading>
        {apptQ.isLoading ? (
          <Skeleton variant="rounded" height={72} />
        ) : nextVisit ? (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            onClick={() => navigate("/app/appointments")}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              cursor: "pointer",
              bgcolor: alpha(theme.palette.primary.main, 0.07),
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
            }}
          >
            <Box sx={{ fontSize: 26, lineHeight: 1 }}>{petEmoji(nextVisit.pet?.species)}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: ".875rem" }}>
                {nextVisit.pet?.name || "Your pet"}
                {nextVisit.vet?.user && ` · Dr. ${nextVisit.vet.user.lastName}`}
              </Typography>
              <Typography noWrap variant="caption" color="text.secondary">
                {formatDateTime(nextVisit.scheduledAt)}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EventRoundedIcon />}
            onClick={() => navigate("/app/appointments")}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5, py: 1 }}
          >
            Book a visit
          </Button>
        )}
      </Block>

      {/* ------------------------------- Due soon ------------------------------- */}
      {dueSoon.length > 0 && (
        <Block>
          <Heading onSeeAll={() => navigate("/app/reminders")}>Due soon</Heading>
          <Stack spacing={0.75}>
            {dueSoon.map((r) => {
              const tone = REMINDER_TYPE_COLORS?.[r.type] || "warning";
              const color = theme.palette[tone]?.main || theme.palette.warning.main;
              return (
                <MotionBox
                  key={r.id}
                  whileHover={{ x: 3 }}
                  transition={SPRING}
                  onClick={() => navigate("/app/reminders")}
                  sx={{
                    display: "flex",
                    gap: 1.25,
                    alignItems: "center",
                    p: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: alpha(color, 0.08),
                    "&:hover": { bgcolor: alpha(color, 0.14) },
                  }}
                >
                  <Box sx={{ width: 4, alignSelf: "stretch", borderRadius: 2, bgcolor: color }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: ".8rem" }}>
                      {r.title}
                    </Typography>
                    <Typography noWrap variant="caption" color="text.secondary">
                      {humanize(r.type)}
                      {r.pet?.name && ` · ${r.pet.name}`}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color, fontWeight: 700, flexShrink: 0 }}>
                    {timeAgo(r.dueAt)}
                  </Typography>
                </MotionBox>
              );
            })}
          </Stack>
        </Block>
      )}

      {/* --------------------------- Suggested for you -------------------------- */}
      <Block>
        <Heading onSeeAll={() => navigate("/app/marketplace")}>Suggested for you</Heading>
        {bizQ.isLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : businesses.length ? (
          businesses.map((b) => (
            <Row
              key={b.id}
              avatar={<Logo src={b.logoUrl} fallback={initialsOf(b.name)} />}
              title={b.name}
              subtitle={b.tagline || b.primaryCategory?.label || "Local business"}
              onClick={() => navigate(`/app/marketplace/business/${b.slug}`)}
              trailing={
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "primary.main", flexShrink: 0 }}
                >
                  Visit
                </Typography>
              }
            />
          ))
        ) : (
          <Typography variant="caption" color="text.secondary">
            No businesses listed yet.
          </Typography>
        )}
      </Block>

      {/* ------------------------------- Messages ------------------------------- */}
      <Block>
        <Heading onSeeAll={() => navigate("/app/chat")}>Messages</Heading>
        {convQ.isLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : conversations.length ? (
          conversations.map((c) => (
            <Row
              key={c.user.id}
              avatar={<UserAvatar user={c.user} online={isOnline?.(c.user.id)} size={40} />}
              title={displayName(c.user)}
              subtitle={c.lastMessage?.content || "📎 Attachment"}
              onClick={() => navigate("/app/chat")}
              trailing={
                <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(c.lastMessage?.createdAt)}
                  </Typography>
                  {c.unread > 0 && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main" }} />
                  )}
                </Stack>
              }
            />
          ))
        ) : (
          <Typography variant="caption" color="text.secondary">
            No conversations yet.
          </Typography>
        )}
      </Block>

      {/* -------------------------------- Footer -------------------------------- */}
      <Block>
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", lineHeight: 1.8 }}>
          About · Help · Privacy · Terms
          <br />© {new Date().getFullYear()} PetCare
        </Typography>
      </Block>
    </MotionBox>
  );
};

export default OwnerAside;
