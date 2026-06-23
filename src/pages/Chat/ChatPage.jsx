import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { useGroups } from "../../hooks/chat/useChat";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import BroadcastPanel from "./BroadcastPanel";
import GroupThread from "./GroupThread";
import CallsPanel from "./CallsPanel";
import CreateGroupDialog from "./CreateGroupDialog";

const TabButton = ({ active, icon, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
      py: 1.1,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.82rem",
      color: active ? "primary.main" : "text.secondary",
      borderBottom: 2,
      borderColor: active ? "primary.main" : "transparent",
      bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.06) : "transparent",
      transition: "all .2s ease",
    }}
  >
    {icon}
    {label}
  </Box>
);

const EmptyState = ({ text }) => (
  <Box
    sx={{
      flex: 1,
      display: { xs: "none", md: "flex" },
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      color: "text.secondary",
    }}
  >
    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 56, opacity: 0.4 }} />
    <Typography>{text}</Typography>
  </Box>
);

// Left-rail list of the user's groups.
const GroupsList = ({ selectedId, onSelect, onNew }) => {
  const { data: groups = [], isLoading } = useGroups();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onNew}
        >
          New group
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", pb: 1 }}>
        {isLoading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 5 }}>
            <CircularProgress size={22} />
          </Box>
        ) : groups.length === 0 ? (
          <Typography sx={{ textAlign: "center", px: 3, py: 4 }} color="text.secondary">
            No groups yet. Create one to start a group chat.
          </Typography>
        ) : (
          groups.map((g) => {
            const last = g.lastMessage;
            const preview = last
              ? (last.content ||
                  (last.attachmentUrl ? "📎 Attachment" : "")) ||
                "New group"
              : "No messages yet";
            return (
              <Box
                key={g.id}
                onClick={() => onSelect(g)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  mx: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor:
                    g.id === selectedId
                      ? (t) => alpha(t.palette.primary.main, 0.12)
                      : "transparent",
                  "&:hover": {
                    bgcolor: (t) =>
                      alpha(t.palette.primary.main, g.id === selectedId ? 0.12 : 0.06),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    flexShrink: 0,
                    background: (t) =>
                      `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                  }}
                >
                  <GroupsRoundedIcon />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    {g.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {preview}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

/**
 * Full chat experience: a left rail (Direct / Groups / Calls / Broadcast) and a
 * right pane. Collapses to a single pane on mobile.
 */
const ChatPage = () => {
  const { user, role } = useAuth();
  const { connected } = useChatContext();
  const [mode, setMode] = useState("direct"); // direct | groups | calls | broadcast
  const [contact, setContact] = useState(null);
  const [group, setGroup] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState("list"); // "list" | "detail"

  const meId = user?.id;

  const openContact = (u) => {
    setContact(u);
    setMode("direct");
    setMobilePane("detail");
  };

  const openGroup = (g) => {
    setGroup(g);
    setMode("groups");
    setMobilePane("detail");
  };

  const switchMode = (next) => {
    setMode(next);
    // Broadcast and Calls have no list selection — go straight to the pane.
    setMobilePane(next === "broadcast" || next === "calls" ? "detail" : "list");
  };

  const tabs = [
    { key: "direct", icon: <ForumRoundedIcon fontSize="small" />, label: "Direct" },
    { key: "groups", icon: <GroupsRoundedIcon fontSize="small" />, label: "Groups" },
    { key: "calls", icon: <CallRoundedIcon fontSize="small" />, label: "Calls" },
    {
      key: "broadcast",
      icon: <CampaignRoundedIcon fontSize="small" />,
      label: "News",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Messages
        </Typography>
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            bgcolor: connected ? "success.main" : "warning.main",
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {connected ? "Connected" : "Connecting…"}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          height: { xs: "calc(100vh - 170px)", md: "calc(100vh - 180px)" },
          display: "flex",
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        {/* Left rail */}
        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            flexShrink: 0,
            borderRight: { md: 1 },
            borderColor: "divider",
            display: {
              xs: mobilePane === "list" ? "flex" : "none",
              md: "flex",
            },
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", borderBottom: 1, borderColor: "divider" }}>
            {tabs.map((t) => (
              <TabButton
                key={t.key}
                active={mode === t.key}
                icon={t.icon}
                label={t.label}
                onClick={() => switchMode(t.key)}
              />
            ))}
          </Box>

          {mode === "direct" && (
            <ConversationList
              meId={meId}
              selectedUserId={contact?.id}
              onSelect={openContact}
            />
          )}
          {mode === "groups" && (
            <GroupsList
              selectedId={group?.id}
              onSelect={openGroup}
              onNew={() => setCreateOpen(true)}
            />
          )}
          {mode === "calls" && (
            <Box sx={{ p: 3, color: "text.secondary" }}>
              <Typography variant="body2">
                Your recent calls are shown on the right.
              </Typography>
            </Box>
          )}
          {mode === "broadcast" && (
            <Box
              onClick={() => switchMode("broadcast")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                m: 1.5,
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  background: (t) =>
                    `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                }}
              >
                <CampaignRoundedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Announcements</Typography>
                <Typography variant="caption" color="text.secondary">
                  Everyone in PetCare
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Right pane */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: {
              xs: mobilePane === "detail" ? "flex" : "none",
              md: "flex",
            },
            flexDirection: "column",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? alpha(t.palette.background.default, 0.4)
                : alpha(t.palette.primary.main, 0.02),
          }}
        >
          {mode === "broadcast" ? (
            <BroadcastPanel
              meId={meId}
              role={role}
              onBack={() => setMobilePane("list")}
            />
          ) : mode === "calls" ? (
            <CallsPanel onBack={() => setMobilePane("list")} />
          ) : mode === "groups" ? (
            group ? (
              <GroupThread
                key={group.id}
                group={group}
                meId={meId}
                onBack={() => setMobilePane("list")}
                onLeft={() => {
                  setGroup(null);
                  setMobilePane("list");
                }}
              />
            ) : (
              <EmptyState text="Select a group to start chatting" />
            )
          ) : contact ? (
            <MessageThread
              key={contact.id}
              contact={contact}
              meId={meId}
              onBack={() => setMobilePane("list")}
            />
          ) : (
            <EmptyState text="Select a conversation to start messaging" />
          )}
        </Box>
      </Paper>

      <CreateGroupDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={openGroup}
      />
    </Box>
  );
};

export default ChatPage;
