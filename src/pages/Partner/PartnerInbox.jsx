import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import {
  useEnquiries,
  useEnquiryThread,
  useEnquiryMutations,
  useEnquirySocket,
} from "../../hooks/marketplace/useEnquiries";
import NoStorefront, { isNoStorefront } from "./NoStorefront";

const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const ThreadList = ({ items, activeId, onSelect }) => (
  <Box sx={{ overflowY: "auto", flex: 1 }}>
    {items.map((t) => (
      <Box
        key={t.id}
        onClick={() => onSelect(t.id)}
        sx={{
          p: 1.5,
          display: "flex",
          gap: 1.5,
          cursor: "pointer",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: t.id === activeId ? "action.selected" : "transparent",
          borderLeft: t.id === activeId ? "3px solid" : "3px solid transparent",
          borderLeftColor: t.id === activeId ? "primary.main" : "transparent",
        }}
      >
        <Badge color="primary" variant="dot" invisible={!t.partnerUnread}>
          <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{t.customer?.firstName?.[0]}</Avatar>
        </Badge>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: t.partnerUnread ? 700 : 600 }}>
              {t.customer?.firstName} {t.customer?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(t.lastMessageAt)}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {t.subject}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

const Conversation = ({ threadId, meId }) => {
  const query = useEnquiryThread(threadId);
  const { send } = useEnquiryMutations();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  const messages = query.data?.messages || [];
  const thread = query.data?.thread;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = () => {
    if (!text.trim()) return;
    send.mutate({ id: threadId, body: text.trim() }, { onSuccess: () => setText("") });
  };

  if (query.isLoading) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <Box sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {thread?.customer?.firstName} {thread?.customer?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {thread?.subject}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "action.hover" }}>
        {messages.map((m) => {
          const mine = m.senderId === meId;
          return (
            <Box key={m.id} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", mb: 1 }}>
              <Box
                sx={{
                  maxWidth: "72%",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2.5,
                  bgcolor: mine ? "primary.main" : "background.paper",
                  color: mine ? "#fff" : "text.primary",
                  border: mine ? "none" : "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2">{m.body}</Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={endRef} />
      </Box>

      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a reply…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <IconButton color="primary" onClick={submit} disabled={!text.trim() || send.isLoading}>
          <SendRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

const PartnerInbox = () => {
  const { user } = useAuth();
  const query = useEnquiries("inbox");
  const [activeId, setActiveId] = useState(null);
  useEnquirySocket(activeId);

  const items = query.data?.items || [];

  // Auto-select the first thread once loaded.
  useEffect(() => {
    if (!activeId && items.length) setActiveId(items[0].id);
  }, [items, activeId]);

  const noBusiness = isNoStorefront(query);

  return (
    <Box>
      <PageHeader title="Inbox" subtitle="Customer enquiries about your storefront." />
      {noBusiness ? (
        <NoStorefront />
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No enquiries yet.</Typography>
      ) : (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            height: 560,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: 300, borderRight: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column" }}>
            <ThreadList items={items} activeId={activeId} onSelect={setActiveId} />
          </Box>
          {activeId ? (
            <Conversation threadId={activeId} meId={user?.id} />
          ) : (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography color="text.secondary">Select a conversation</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PartnerInbox;
