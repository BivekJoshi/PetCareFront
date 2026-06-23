/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import toast from "react-hot-toast";
import { useBroadcast } from "../../hooks/chat/useChat";
import { uploadAttachment } from "../../api/chat/chat-api";
import { useChatContext } from "../../context/ChatContext";
import { useMessageActions } from "../../hooks/chat/useMessageActions";
import { isAdmin } from "../../constants/domain";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";
import ForwardDialog from "./ForwardDialog";

/**
 * The shared announcement channel. Everyone sees broadcasts; only admins get
 * the composer (others see a read-only notice). Everyone can forward or hide
 * messages; admins can also reply/edit/delete-for-everyone.
 */
const BroadcastPanel = ({ meId, role, onBack }) => {
  const { data, isLoading, hasMore, fetchOlder, isFetchingOlder } =
    useBroadcast();
  const { sendBroadcast, connected } = useChatContext();
  const { edit, remove } = useMessageActions();
  const canPost = isAdmin(role);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [forwarding, setForwarding] = useState(null);

  const handleSend = async (content, file) => {
    if (editing) {
      const target = editing;
      setEditing(null);
      try {
        await edit(target.id, content);
      } catch {
        /* toast handled in the hook */
      }
      return;
    }

    setSending(true);
    try {
      const attachment = file ? await uploadAttachment(file) : undefined;
      await sendBroadcast(content, attachment, replyTo?.id);
      setReplyTo(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Broadcast failed"
      );
    } finally {
      setSending(false);
    }
  };

  const actions = {
    onForward: (m) => setForwarding(m),
    onDelete: (m, scope) => remove(m.id, scope),
    ...(canPost
      ? {
          onReply: (m) => {
            setEditing(null);
            setReplyTo(m);
          },
          onEdit: (m) => {
            setReplyTo(null);
            setEditing(m);
          },
        }
      : {}),
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
        actions={actions}
        emptyText="No announcements yet."
        hasMore={hasMore}
        loadingOlder={isFetchingOlder}
        onLoadOlder={fetchOlder}
      />

      {canPost ? (
        <ChatComposer
          onSend={handleSend}
          disabled={!connected}
          sending={sending}
          replyTo={replyTo}
          editing={editing}
          onCancelReply={() => setReplyTo(null)}
          onCancelEdit={() => setEditing(null)}
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

      <ForwardDialog
        open={Boolean(forwarding)}
        message={forwarding}
        onClose={() => setForwarding(null)}
      />
    </Box>
  );
};

export default BroadcastPanel;
