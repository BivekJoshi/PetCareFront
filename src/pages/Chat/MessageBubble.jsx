/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import toast from "react-hot-toast";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { fullName } from "../../utility/format";

const timeOf = (value) =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const Attachment = ({ message, mine }) => {
  const { attachmentUrl, attachmentName, attachmentType, attachmentSize } =
    message;
  const isImage = attachmentType?.startsWith("image/");

  if (isImage) {
    return (
      <Box
        component="a"
        href={attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: "block", mt: message.content ? 1 : 0 }}
      >
        <Box
          component="img"
          src={attachmentUrl}
          alt={attachmentName}
          loading="lazy"
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 1.5,
            objectFit: "cover",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="a"
      href={attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={attachmentName}
      sx={{
        mt: message.content ? 1 : 0,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        p: 1,
        borderRadius: 1.5,
        textDecoration: "none",
        color: "inherit",
        bgcolor: (t) =>
          mine ? alpha("#ffffff", 0.18) : alpha(t.palette.text.primary, 0.05),
        minWidth: 180,
      }}
    >
      <InsertDriveFileRoundedIcon />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {attachmentName}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {formatBytes(attachmentSize)}
        </Typography>
      </Box>
      <DownloadRoundedIcon fontSize="small" sx={{ opacity: 0.8 }} />
    </Box>
  );
};

// Small quoted preview of the message this one replies to.
const ReplyQuote = ({ replyTo, mine }) => {
  const label = replyTo.deletedAt
    ? "Deleted message"
    : replyTo.content ||
      (replyTo.attachmentName ? `📎 ${replyTo.attachmentName}` : "Attachment");
  return (
    <Box
      sx={{
        mb: 0.75,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        borderLeft: "3px solid",
        borderColor: mine ? "rgba(255,255,255,0.7)" : "primary.main",
        bgcolor: (t) =>
          mine ? alpha("#ffffff", 0.15) : alpha(t.palette.text.primary, 0.05),
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
        {fullName(replyTo.sender)}
      </Typography>
      <Typography variant="caption" noWrap sx={{ display: "block", opacity: 0.85 }}>
        {label}
      </Typography>
    </Box>
  );
};

/**
 * A single chat bubble: reply quote, forwarded/edited labels, attachment,
 * read receipt, deleted-message tombstone, and a hover actions menu.
 */
const MessageBubble = ({ message, mine, showSender = false, actions }) => {
  const [anchor, setAnchor] = useState(null);
  const deleted = Boolean(message.deletedAt);
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  const run = (fn) => () => {
    close();
    fn?.();
  };

  const canEdit = mine && !deleted && Boolean(message.content) && actions?.onEdit;
  const showMenu = Boolean(actions) && !(deleted && !mine);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: mine ? "flex-end" : "flex-start",
        mb: 1,
        "&:hover .msg-actions": { opacity: 1 },
      }}
    >
      {showSender && !mine && !deleted && (
        <Typography
          variant="caption"
          sx={{ ml: 1.5, mb: 0.25, fontWeight: 700, color: "primary.main" }}
        >
          {fullName(message.sender)}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: mine ? "row-reverse" : "row",
          alignItems: "center",
          gap: 0.5,
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "82%", sm: "70%" },
            px: 1.75,
            py: 1.1,
            borderRadius: 2.5,
            borderTopRightRadius: mine ? 4 : 20,
            borderTopLeftRadius: mine ? 20 : 4,
            bgcolor: deleted
              ? "transparent"
              : mine
              ? "primary.main"
              : "background.paper",
            color: mine && !deleted ? "#fff" : "text.primary",
            border: deleted ? "1px dashed" : mine ? "none" : 1,
            borderColor: "divider",
            boxShadow: deleted
              ? "none"
              : mine
              ? "0 6px 16px -8px rgba(8, 80, 80, 0.5)"
              : "0 2px 8px -6px rgba(16,24,40,0.3)",
          }}
        >
          {deleted ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, opacity: 0.7 }}>
              <BlockRoundedIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                This message was deleted
              </Typography>
            </Box>
          ) : (
            <>
              {message.isForwarded && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.4,
                    opacity: 0.75,
                    fontStyle: "italic",
                    mb: 0.25,
                  }}
                >
                  <ForwardRoundedIcon sx={{ fontSize: 14 }} /> Forwarded
                </Typography>
              )}
              {message.replyTo && (
                <ReplyQuote replyTo={message.replyTo} mine={mine} />
              )}
              {message.content && (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.45,
                  }}
                >
                  {message.content}
                </Typography>
              )}
              {message.attachmentUrl && (
                <Attachment message={message} mine={mine} />
              )}
            </>
          )}
        </Box>

        {showMenu && (
          <IconButton
            size="small"
            className="msg-actions"
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{
              opacity: { xs: 1, md: 0 },
              transition: "opacity .15s ease",
              color: "text.disabled",
            }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.3, px: 0.75 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
          {timeOf(message.createdAt)}
        </Typography>
        {message.editedAt && !deleted && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            · edited
          </Typography>
        )}
        {mine &&
          !deleted &&
          (message.readAt ? (
            <DoneAllRoundedIcon sx={{ fontSize: 14, color: "info.main" }} />
          ) : (
            <DoneRoundedIcon sx={{ fontSize: 14, color: "text.disabled" }} />
          ))}
      </Box>

      <Menu anchorEl={anchor} open={open} onClose={close}>
        {actions?.onReply && !deleted && (
          <MenuItem onClick={run(() => actions.onReply(message))}>
            <ListItemIcon>
              <ReplyRoundedIcon fontSize="small" />
            </ListItemIcon>
            Reply
          </MenuItem>
        )}
        {actions?.onForward && !deleted && (
          <MenuItem onClick={run(() => actions.onForward(message))}>
            <ListItemIcon>
              <ForwardRoundedIcon fontSize="small" />
            </ListItemIcon>
            Forward
          </MenuItem>
        )}
        {message.content && !deleted && (
          <MenuItem
            onClick={run(() => {
              navigator.clipboard?.writeText(message.content);
              toast.success("Copied");
            })}
          >
            <ListItemIcon>
              <ContentCopyRoundedIcon fontSize="small" />
            </ListItemIcon>
            Copy
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem onClick={run(() => actions.onEdit(message))}>
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={run(() => actions.onDelete(message, "me"))}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Delete for me
        </MenuItem>
        {mine && !deleted && (
          <MenuItem
            onClick={run(() => actions.onDelete(message, "everyone"))}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteOutlineRoundedIcon fontSize="small" color="error" />
            </ListItemIcon>
            Delete for everyone
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MessageBubble;
