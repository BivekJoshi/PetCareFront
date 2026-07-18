import {
  Box,
  Card,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  useReminders,
  useReminderMutations,
} from "../../hooks/reminders/useReminders";
import { humanize, REMINDER_TYPE_COLORS } from "../../constants/domain";
import { Loading, EmptyState, CardGrid } from "./ownerUi";

const OwnerReminders = () => {
  const query = useReminders({ limit: 100 });
  const { markRead, dismiss } = useReminderMutations();

  const reminders = query.data?.items ?? [];
  const unread = query.data?.meta?.unread ?? 0;

  return (
    <Box>
      {unread > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          You have <b>{unread}</b> unread {unread === 1 ? "reminder" : "reminders"}.
        </Typography>
      )}

      {query.isLoading ? (
        <Loading />
      ) : reminders.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="You're all caught up"
          hint="Care reminders for vaccines, check-ups and deworming will show up here."
        />
      ) : (
        <CardGrid min={340}>
          {reminders.map((r) => {
            const tone = REMINDER_TYPE_COLORS[r.type] || "primary";
            const isUnread = !(r.isRead ?? r.read);
            return (
              <Card
                key={r.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: { xs: 1.75, md: 1.5 },
                  borderLeft: 4,
                  borderLeftColor: `${tone}.main`,
                  bgcolor: isUnread ? "action.hover" : "transparent",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        color={tone}
                        label={humanize(r.type || "GENERAL")}
                      />
                      <Typography sx={{ fontWeight: 800 }}>{r.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {r.message}
                    </Typography>
                  </Box>
                  <Stack spacing={0.5}>
                    {isUnread && (
                      <Tooltip title="Mark read">
                        <IconButton
                          size="small"
                          onClick={() => markRead.mutate(r.id)}
                        >
                          <CheckRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Dismiss">
                      <IconButton
                        size="small"
                        onClick={() => dismiss.mutate(r.id)}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </CardGrid>
      )}
    </Box>
  );
};

export default OwnerReminders;
