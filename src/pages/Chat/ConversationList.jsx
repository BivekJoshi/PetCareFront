/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Badge,
  Box,
  CircularProgress,
  InputBase,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useConversations, useContacts } from "../../hooks/chat/useChat";
import { useChatContext } from "../../context/ChatContext";
import { displayName } from "../../utility/format";
import { humanize } from "../../constants/domain";
import { callPreview } from "../../utility/call";
import UserAvatar from "./UserAvatar";

// Short preview line for a conversation's most recent activity.
const previewOf = (lastMessage, meId) => {
  if (!lastMessage) return "";
  const mine = lastMessage.senderId === meId;
  if (lastMessage.type === "CALL") return callPreview(lastMessage, mine);
  const body =
    lastMessage.content || (lastMessage.attachmentUrl ? "📎 Attachment" : "");
  return (mine ? "You: " : "") + body;
};

const timeAgo = (value) => {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
};

const Row = ({ user, online, selected, onClick, subtitle, time, unread }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 1.5,
      py: 1.25,
      mx: 1,
      borderRadius: 2,
      cursor: "pointer",
      bgcolor: selected ? (t) => alpha(t.palette.primary.main, 0.12) : "transparent",
      "&:hover": {
        bgcolor: (t) => alpha(t.palette.primary.main, selected ? 0.12 : 0.06),
      },
    }}
  >
    <UserAvatar user={user} online={online} size={46} />
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }} noWrap>
          {displayName(user)}
        </Typography>
        {time && (
          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
            {time}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ fontWeight: unread ? 700 : 400 }}
        >
          {subtitle}
        </Typography>
        {unread > 0 && (
          <Badge
            badgeContent={unread}
            color="primary"
            sx={{ "& .MuiBadge-badge": { position: "static", transform: "none" } }}
          />
        )}
      </Box>
    </Box>
  </Box>
);

/**
 * Left rail: a search box plus either the user's existing conversations or, while
 * searching, the matching contacts to start a brand-new chat with.
 */
const ConversationList = ({ meId, selectedUserId, onSelect }) => {
  const [search, setSearch] = useState("");
  const { isOnline } = useChatContext();
  const conversations = useConversations();
  const contacts = useContacts(search.trim() ? search.trim() : undefined);

  const searching = search.trim().length > 0;
  const loading = searching ? contacts.isLoading : conversations.isLoading;
  const convoItems = conversations.data || [];
  const contactItems = (contacts.data || []).filter((u) => u.id !== meId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Search */}
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            bgcolor: "action.hover",
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            fullWidth
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.9rem" }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", pb: 1 }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
            <CircularProgress size={24} />
          </Box>
        ) : searching ? (
          <>
            <Typography
              variant="caption"
              sx={{ px: 2.5, color: "text.disabled", fontWeight: 700 }}
            >
              CONTACTS
            </Typography>
            {contactItems.length === 0 ? (
              <Typography sx={{ px: 2.5, py: 2 }} color="text.secondary">
                No people found.
              </Typography>
            ) : (
              contactItems.map((u) => (
                <Row
                  key={u.id}
                  user={u}
                  online={isOnline(u.id)}
                  selected={u.id === selectedUserId}
                  subtitle={humanize(u.role || "")}
                  onClick={() => {
                    onSelect(u);
                    setSearch("");
                  }}
                />
              ))
            )}
          </>
        ) : convoItems.length === 0 ? (
          <Box sx={{ textAlign: "center", px: 3, py: 6 }}>
            <Typography color="text.secondary">
              No conversations yet. Search above to start one.
            </Typography>
          </Box>
        ) : (
          convoItems.map((c) => (
            <Row
              key={c.user.id}
              user={c.user}
              online={isOnline(c.user.id)}
              selected={c.user.id === selectedUserId}
              subtitle={previewOf(c.lastMessage, meId)}
              time={timeAgo(c.lastMessage?.createdAt)}
              unread={c.unread}
              onClick={() => onSelect(c.user)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ConversationList;
