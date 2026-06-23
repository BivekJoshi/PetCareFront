/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import toast from "react-hot-toast";
import { useThread } from "../../hooks/chat/useChat";
import { uploadAttachment } from "../../api/chat/chat-api";
import { useChatContext } from "../../context/ChatContext";
import { useCallContext } from "../../context/CallContext";
import { useMessageActions } from "../../hooks/chat/useMessageActions";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";
import UserAvatar from "./UserAvatar";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";
import ForwardDialog from "./ForwardDialog";

/** One-to-one conversation: header, live message list, and composer. */
const MessageThread = ({ contact, meId, onBack }) => {
  const { data, isLoading } = useThread(contact.id);
  const { sendDirect, setTyping, markRead, isOnline, typingByUser, connected } =
    useChatContext();
  const { startCall, inCall } = useCallContext();
  const { edit, remove } = useMessageActions();
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [forwarding, setForwarding] = useState(null);

  const messages = data?.items || [];
  const online = isOnline(contact.id);
  const theyAreTyping = Boolean(typingByUser[contact.id]);

  // Mark the thread read when opened and whenever new messages land in it.
  useEffect(() => {
    markRead(contact.id);
  }, [contact.id, messages.length, markRead]);

  const handleSend = async (content, file) => {
    // Edit mode: save the edit instead of sending a new message.
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
      await sendDirect(contact.id, content, attachment, replyTo?.id);
      setReplyTo(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Message failed to send"
      );
    } finally {
      setSending(false);
    }
  };

  const actions = {
    onReply: (m) => {
      setEditing(null);
      setReplyTo(m);
    },
    onEdit: (m) => {
      setReplyTo(null);
      setEditing(m);
    },
    onForward: (m) => setForwarding(m),
    onDelete: (m, scope) => remove(m.id, scope),
  };

  const statusText = theyAreTyping
    ? "typing…"
    : online
    ? "Online"
    : humanize(contact.role || "");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
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
        <UserAvatar user={contact} online={online} size={42} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700 }} noWrap>
            {fullName(contact)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theyAreTyping || online ? "success.main" : "text.secondary",
              fontWeight: theyAreTyping ? 700 : 500,
            }}
          >
            {statusText}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Call actions */}
        <Tooltip title={online ? "Voice call" : "User is offline"}>
          <span>
            <IconButton
              color="primary"
              onClick={() => startCall(contact, "audio")}
              disabled={!connected || inCall || !online}
            >
              <CallRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={online ? "Video call" : "User is offline"}>
          <span>
            <IconButton
              color="primary"
              onClick={() => startCall(contact, "video")}
              disabled={!connected || inCall || !online}
            >
              <VideocamRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <MessageList
        messages={messages}
        meId={meId}
        loading={isLoading}
        typing={theyAreTyping}
        actions={actions}
      />

      <ChatComposer
        onSend={handleSend}
        onTyping={(isTyping) => setTyping(contact.id, isTyping)}
        disabled={!connected}
        sending={sending}
        replyTo={replyTo}
        editing={editing}
        onCancelReply={() => setReplyTo(null)}
        onCancelEdit={() => setEditing(null)}
        placeholder={connected ? "Type a message…" : "Connecting…"}
      />

      <ForwardDialog
        open={Boolean(forwarding)}
        message={forwarding}
        onClose={() => setForwarding(null)}
      />
    </Box>
  );
};

export default MessageThread;
