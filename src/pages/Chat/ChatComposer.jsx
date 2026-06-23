/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputBase,
  Tooltip,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Typography } from "@mui/material";
import { fullName } from "../../utility/format";

const ACCEPT =
  "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip";

/**
 * Message input bar. Supports text + an optional file attachment, plus reply
 * and edit modes (shown as banners above the input). Enter sends,
 * Shift+Enter inserts a newline. Calls `onSend(text, file)`.
 */
const ChatComposer = ({
  onSend,
  onTyping,
  disabled = false,
  sending = false,
  placeholder = "Type a message…",
  replyTo = null,
  editing = null,
  onCancelReply,
  onCancelEdit,
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const typingRef = useRef(false);
  const idleTimer = useRef(null);

  // Prefill (and reset) the input when entering/leaving edit mode.
  useEffect(() => {
    setText(editing ? editing.content || "" : "");
    if (editing) setFile(null);
  }, [editing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopTyping = () => {
    if (typingRef.current) {
      typingRef.current = false;
      onTyping?.(false);
    }
  };

  useEffect(() => () => stopTyping(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setText(e.target.value);
    if (!onTyping) return;
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping(true);
    }
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(stopTyping, 1500);
  };

  const pickFile = (e) => {
    const chosen = e.target.files?.[0];
    if (chosen) setFile(chosen);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const submit = () => {
    const value = text.trim();
    if ((!value && !file) || disabled || sending) return;
    onSend(value, file);
    setText("");
    setFile(null);
    stopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const isImage = file && file.type.startsWith("image/");

  const banner = editing
    ? {
        icon: <EditRoundedIcon fontSize="small" color="primary" />,
        title: "Editing message",
        text: editing.content,
        onClose: onCancelEdit,
      }
    : replyTo
    ? {
        icon: <ReplyRoundedIcon fontSize="small" color="primary" />,
        title: `Replying to ${fullName(replyTo.sender)}`,
        text:
          replyTo.content ||
          (replyTo.attachmentName ? `📎 ${replyTo.attachmentName}` : "Attachment"),
        onClose: onCancelReply,
      }
    : null;

  return (
    <Box sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
      {/* Reply / edit context banner */}
      {banner && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            pt: 1.25,
          }}
        >
          {banner.icon}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              borderLeft: "3px solid",
              borderColor: "primary.main",
              pl: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
              {banner.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {banner.text}
            </Typography>
          </Box>
          <IconButton size="small" onClick={banner.onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Selected-file preview chip */}
      {file && (
        <Box sx={{ px: 1.5, pt: 1.25 }}>
          <Chip
            icon={isImage ? <ImageRoundedIcon /> : <InsertDriveFileRoundedIcon />}
            label={file.name}
            onDelete={sending ? undefined : () => setFile(null)}
            sx={{ maxWidth: "100%", "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, p: 1.5 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={pickFile}
        />
        {!editing && (
          <Tooltip title="Attach file">
            <span>
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || sending}
                sx={{ color: "text.secondary" }}
              >
                <AttachFileRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <InputBase
          multiline
          maxRows={5}
          fullWidth
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
          disabled={disabled}
          placeholder={placeholder}
          sx={{
            px: 2,
            py: 1.1,
            borderRadius: 3,
            bgcolor: "action.hover",
            fontSize: "0.95rem",
          }}
        />

        <Tooltip title="Send (Enter)">
          <span>
            <IconButton
              onClick={submit}
              disabled={disabled || sending || (!text.trim() && !file)}
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                width: 44,
                height: 44,
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
              }}
            >
              {sending ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                <SendRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ChatComposer;
