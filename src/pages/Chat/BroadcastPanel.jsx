/* eslint-disable react/prop-types */
import { Box, IconButton, Typography } from "@mui/material";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import toast from "react-hot-toast";
import { useBroadcast } from "../../hooks/chat/useChat";
import { useChatContext } from "../../context/ChatContext";
import { isAdmin } from "../../constants/domain";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";

/**
 * The shared announcement channel. Everyone sees broadcasts; only admins get
 * the composer (others see a read-only notice).
 */
const BroadcastPanel = ({ meId, role, onBack }) => {
  const { data, isLoading } = useBroadcast();
  const { sendBroadcast, connected } = useChatContext();
  const canPost = isAdmin(role);

  const handleSend = async (content) => {
    try {
      await sendBroadcast(content);
    } catch (err) {
      toast.error(err.message || "Broadcast failed");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.25,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <IconButton
          onClick={onBack}
          size="small"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box
          sx={{
            width: 42,
            height: 42,
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
            Broadcast channel · everyone
          </Typography>
        </Box>
      </Box>

      <MessageList
        messages={data?.items || []}
        meId={meId}
        loading={isLoading}
        showSender
        emptyText="No announcements yet."
      />

      {canPost ? (
        <ChatComposer
          onSend={handleSend}
          disabled={!connected}
          placeholder={
            connected ? "Write an announcement to everyone…" : "Connecting…"
          }
        />
      ) : (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: 1,
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            Only administrators can post announcements.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BroadcastPanel;
