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

const ACCEPT =
  "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip";

/**
 * Message input bar. Supports text plus an optional file/document attachment.
 * Enter sends, Shift+Enter inserts a newline. Emits typing start/stop through
 * `onTyping`. Calls `onSend(text, file)`.
 */
const ChatComposer = ({
  onSend,
  onTyping,
  disabled = false,
  sending = false,
  placeholder = "Type a message…",
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const typingRef = useRef(false);
  const idleTimer = useRef(null);

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

  return (
    <Box sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
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
