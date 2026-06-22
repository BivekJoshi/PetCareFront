import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useReminders, useReminderMutations } from "../../hooks/reminders/useReminders";
import { humanize, REMINDER_TYPE_COLORS } from "../../constants/domain";
import { formatDate } from "../../utility/format";

const isUnread = (status) => status === "PENDING" || status === "SENT";

const RemindersPage = () => {
  const query = useReminders();
  const { markRead, dismiss } = useReminderMutations();

  const items = query.data?.items ?? [];
  const unread = query.data?.meta?.unread ?? 0;

  return (
    <Box>
      <PageHeader
        title="Reminders"
        subtitle="Vaccine due-dates, checkups and seasonal care tips for your pets."
        action={
          unread > 0 ? (
            <Chip color="primary" icon={<NotificationsActiveOutlinedIcon />} label={`${unread} unread`} />
          ) : null
        }
      />

      <QueryState query={query} isEmpty={items.length === 0} emptyMessage="You're all caught up — no reminders.">
        <Stack spacing={1.5}>
          {items.map((r) => {
            const unreadItem = isUnread(r.status);
            return (
              <Paper
                key={r.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  borderLeft: 4,
                  borderLeftColor: `${REMINDER_TYPE_COLORS[r.type] || "primary"}.main`,
                  bgcolor: unreadItem ? "action.hover" : "background.paper",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Chip size="small" color={REMINDER_TYPE_COLORS[r.type] || "default"} label={humanize(r.type)} />
                      {r.pet && <Typography variant="caption" color="text.secondary">for {r.pet.name}</Typography>}
                      <Typography variant="caption" color="text.secondary">· due {formatDate(r.dueAt)}</Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 700 }}>{r.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.message}
                    </Typography>
                  </Box>
                  <Stack direction="row">
                    {unreadItem && (
                      <Tooltip title="Mark as read">
                        <IconButton onClick={() => markRead.mutate(r.id)} size="small">
                          <DoneAllIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Dismiss">
                      <IconButton onClick={() => dismiss.mutate(r.id)} size="small" color="error">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </QueryState>
    </Box>
  );
};

export default RemindersPage;
