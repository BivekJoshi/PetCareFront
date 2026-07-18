import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import { useReminders, useReminderMutations } from "../../hooks/reminders/useReminders";
import { REMINDER_TYPE_COLORS, humanize } from "../../constants/domain";
import { timeAgo } from "../../utility/format";
import { staggerParent, staggerChild } from "./ownerMotion";

const MotionBox = motion(Box);

/**
 * Rail notifications flyout.
 *
 * Reminders are actionable here rather than read-only: opening one marks it
 * read, and each row can be dismissed in place. Rows exit with AnimatePresence
 * so a dismissal reads as the item leaving rather than the list jumping.
 *
 * Mutations invalidate the reminders key, which is the same key feeding the
 * rail badge and the aside — so the count and the "Due soon" block settle on
 * their own without any cross-component wiring.
 */

const PAGE = 8;

const Row = ({ reminder, onOpen, onDismiss }) => {
  const theme = useTheme();
  const tone = REMINDER_TYPE_COLORS?.[reminder.type] || "primary";
  const color = theme.palette[tone]?.main || theme.palette.primary.main;
  const unread = !(reminder.isRead ?? reminder.read);

  return (
    <MotionBox
      variants={staggerChild}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
      layout
      onClick={onOpen}
      sx={{
        position: "relative",
        display: "flex",
        gap: 1.25,
        p: 1.25,
        mb: 0.5,
        borderRadius: 2.5,
        cursor: "pointer",
        bgcolor: unread ? alpha(color, 0.07) : "transparent",
        "&:hover": { bgcolor: alpha(color, 0.12) },
        "&:hover .dismiss": { opacity: 1 },
      }}
    >
      {/* Unread marker doubles as the type colour key. */}
      <Box
        sx={{
          width: 6,
          borderRadius: 3,
          flexShrink: 0,
          bgcolor: unread ? color : "transparent",
        }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
          <Typography noWrap sx={{ fontWeight: unread ? 700 : 600, fontSize: ".875rem" }}>
            {reminder.title}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
            {timeAgo(reminder.dueAt)}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {reminder.message}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 0.25, color, fontWeight: 700 }}>
          {humanize(reminder.type)}
          {reminder.pet?.name && ` · ${reminder.pet.name}`}
        </Typography>
      </Box>

      <Tooltip title="Dismiss">
        <IconButton
          className="dismiss"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          sx={{ opacity: 0, transition: "opacity .15s", alignSelf: "flex-start" }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </MotionBox>
  );
};

const OwnerNotificationsPanel = ({ onNavigate }) => {
  const navigate = useNavigate();
  const remindersQ = useReminders({ limit: PAGE });
  const { markRead, dismiss } = useReminderMutations();

  const items = remindersQ.data?.items ?? [];
  const unreadCount = remindersQ.data?.meta?.unread ?? 0;

  const open = (r) => {
    if (!(r.isRead ?? r.read)) markRead.mutate(r.id);
    onNavigate?.();
    navigate("/app/reminders");
  };

  // No bulk endpoint exists, so "mark all read" fans out over the unread rows
  // currently loaded. Each settles independently; the shared key invalidation
  // collapses them into one refetch.
  const markAllRead = () =>
    items.filter((r) => !(r.isRead ?? r.read)).forEach((r) => markRead.mutate(r.id));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, pt: 2.5, pb: 1.5, flexShrink: 0 }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1.35rem" }}>Notifications</Typography>
        {unreadCount > 0 && (
          <Tooltip title="Mark all as read">
            <IconButton size="small" onClick={markAllRead} disabled={markRead.isLoading}>
              <DoneAllRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
        {remindersQ.isLoading ? (
          <Stack spacing={1} sx={{ px: 0.5 }}>
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={64} />
          </Stack>
        ) : items.length ? (
          <MotionBox variants={staggerParent} initial="hidden" animate="show">
            <AnimatePresence initial={false}>
              {items.map((r) => (
                <Row
                  key={r.id}
                  reminder={r}
                  onOpen={() => open(r)}
                  onDismiss={() => dismiss.mutate(r.id)}
                />
              ))}
            </AnimatePresence>
          </MotionBox>
        ) : (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, textAlign: "center" }}>
            <Box sx={{ fontSize: 38 }}>🔔</Box>
            <Typography sx={{ fontWeight: 700 }}>All caught up</Typography>
            <Typography variant="body2" color="text.secondary">
              New reminders will show up here.
            </Typography>
          </Stack>
        )}
      </Box>

      <Box sx={{ p: 2, flexShrink: 0, borderTop: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          onClick={() => {
            onNavigate?.();
            navigate("/app/reminders");
          }}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5 }}
        >
          See all reminders
        </Button>
      </Box>
    </Box>
  );
};

export default OwnerNotificationsPanel;
