import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import BroadcastPanel from "./BroadcastPanel";

const TabButton = ({ active, icon, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.75,
      py: 1.1,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.9rem",
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

const EmptyState = () => (
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
    <Typography>Select a conversation to start messaging</Typography>
  </Box>
);

/**
 * Full chat experience: a left rail (Direct conversations / Broadcast) and a
 * right pane (thread or announcements). Collapses to a single pane on mobile.
 */
const ChatPage = () => {
  const { user, role } = useAuth();
  const { connected } = useChatContext();
  const [mode, setMode] = useState("direct"); // "direct" | "broadcast"
  const [contact, setContact] = useState(null);
  const [mobilePane, setMobilePane] = useState("list"); // "list" | "detail"

  const meId = user?.id;

  const openContact = (u) => {
    setContact(u);
    setMode("direct");
    setMobilePane("detail");
  };

  const openBroadcast = () => {
    setMode("broadcast");
    setMobilePane("detail");
  };

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
            <TabButton
              active={mode === "direct"}
              icon={<ForumRoundedIcon fontSize="small" />}
              label="Direct"
              onClick={() => setMode("direct")}
            />
            <TabButton
              active={mode === "broadcast"}
              icon={<CampaignRoundedIcon fontSize="small" />}
              label="Broadcast"
              onClick={openBroadcast}
            />
          </Box>

          {mode === "direct" ? (
            <ConversationList
              meId={meId}
              selectedUserId={contact?.id}
              onSelect={openContact}
            />
          ) : (
            <Box
              onClick={openBroadcast}
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
          ) : contact ? (
            <MessageThread
              key={contact.id}
              contact={contact}
              meId={meId}
              onBack={() => setMobilePane("list")}
            />
          ) : (
            <EmptyState />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
