/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  useGroupThread,
  useGroupMembers,
  chatKeys,
} from "../../hooks/chat/useChat";
import { useChatContext } from "../../context/ChatContext";
import { useMessageActions } from "../../hooks/chat/useMessageActions";
import { uploadAttachment, renameGroup, leaveGroup } from "../../api/chat/chat-api";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";
import ForwardDialog from "./ForwardDialog";
import GroupMembersDialog from "./GroupMembersDialog";

const GroupAvatar = ({ size = 42 }) => (
  <Box
    sx={{
      width: size,
      height: size,
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
);

/** A group conversation: header, live messages, composer, and group admin. */
const GroupThread = ({ group, meId, onBack, onLeft }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, hasMore, fetchOlder, isFetchingOlder } =
    useGroupThread(group.id);
  const { data: members = [] } = useGroupMembers(group.id);
  const { sendGroup, connected } = useChatContext();
  const { edit, remove } = useMessageActions();

  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [forwarding, setForwarding] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(group.name);

  const messages = data?.items || [];
  const memberCount = members.length || group.memberCount || 0;

  const handleSend = async (content, file) => {
    if (editing) {
      const target = editing;
      setEditing(null);
      try {
        await edit(target.id, content);
      } catch {
        /* toast handled in hook */
      }
      return;
    }
    setSending(true);
    try {
      const attachment = file ? await uploadAttachment(file) : undefined;
      await sendGroup(group.id, content, attachment, replyTo?.id);
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

  const doRename = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await renameGroup({ id: group.id, name });
      queryClient.invalidateQueries(chatKeys.groups);
      toast.success("Group renamed");
      setRenaming(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not rename group");
    }
  };

  const doLeave = async () => {
    try {
      await leaveGroup(group.id);
      queryClient.invalidateQueries(chatKeys.groups);
      toast.success("You left the group");
      onLeft?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not leave group");
    }
  };

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
        <GroupAvatar />
        <Box
          sx={{ minWidth: 0, cursor: "pointer" }}
          onClick={() => setMembersOpen(true)}
        >
          <Typography sx={{ fontWeight: 700 }} noWrap>
            {group.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {memberCount} member{memberCount === 1 ? "" : "s"} · tap for info
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Members">
          <IconButton onClick={() => setMembersOpen(true)}>
            <PeopleAltRoundedIcon />
          </IconButton>
        </Tooltip>
        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          {group.isAdmin && (
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setNewName(group.name);
                setRenaming(true);
              }}
            >
              <ListItemIcon>
                <DriveFileRenameOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              Rename group
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              setMembersOpen(true);
            }}
          >
            <ListItemIcon>
              <PeopleAltRoundedIcon fontSize="small" />
            </ListItemIcon>
            View members
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              doLeave();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" color="error" />
            </ListItemIcon>
            Leave group
          </MenuItem>
        </Menu>
      </Box>

      <MessageList
        messages={messages}
        meId={meId}
        loading={isLoading}
        showSender
        actions={actions}
        emptyText="No messages yet — say hello! 👋"
        hasMore={hasMore}
        loadingOlder={isFetchingOlder}
        onLoadOlder={fetchOlder}
      />

      <ChatComposer
        onSend={handleSend}
        disabled={!connected}
        sending={sending}
        replyTo={replyTo}
        editing={editing}
        onCancelReply={() => setReplyTo(null)}
        onCancelEdit={() => setEditing(null)}
        placeholder={connected ? "Message the group…" : "Connecting…"}
      />

      <ForwardDialog
        open={Boolean(forwarding)}
        message={forwarding}
        onClose={() => setForwarding(null)}
      />

      <GroupMembersDialog
        open={membersOpen}
        group={group}
        meId={meId}
        onClose={() => setMembersOpen(false)}
      />

      <Dialog open={renaming} onClose={() => setRenaming(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Rename group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doRename()}
            inputProps={{ maxLength: 100 }}
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenaming(false)}>Cancel</Button>
          <Button variant="contained" onClick={doRename} disabled={!newName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupThread;
