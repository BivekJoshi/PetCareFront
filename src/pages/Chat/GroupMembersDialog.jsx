/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  useGroupMembers,
  useContacts,
  chatKeys,
} from "../../hooks/chat/useChat";
import { addGroupMembers, removeGroupMember } from "../../api/chat/chat-api";
import { displayName } from "../../utility/format";
import UserAvatar from "./UserAvatar";

/** View group members; admins can add or remove people. */
const GroupMembersDialog = ({ open, group, meId, onClose }) => {
  const queryClient = useQueryClient();
  const groupId = group?.id;
  const { data: members = [], isLoading } = useGroupMembers(open ? groupId : null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const contacts = useContacts(search.trim() ? search.trim() : undefined);

  const isAdmin = members.find((m) => m.id === meId)?.isAdmin;
  const memberIds = new Set(members.map((m) => m.id));

  const refresh = () => {
    queryClient.invalidateQueries(chatKeys.groupMembers(groupId));
    queryClient.invalidateQueries(chatKeys.groups);
  };

  const add = async (user) => {
    setBusy(true);
    try {
      await addGroupMembers({ id: groupId, memberIds: [user.id] });
      refresh();
      toast.success(`${displayName(user)} added`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not add member");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (user) => {
    setBusy(true);
    try {
      await removeGroupMember({ id: groupId, userId: user.id });
      refresh();
      toast.success(`${displayName(user)} removed`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not remove member");
    } finally {
      setBusy(false);
    }
  };

  const addable = (contacts.data || []).filter((u) => !memberIds.has(u.id));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, display: "flex", alignItems: "center" }}>
        Members
        <Box sx={{ flex: 1 }} />
        {isAdmin && (
          <Button
            size="small"
            startIcon={<PersonAddAlt1RoundedIcon />}
            onClick={() => setAdding((a) => !a)}
          >
            Add
          </Button>
        )}
      </DialogTitle>
      <DialogContent>
        {isAdmin && adding && (
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                mb: 1,
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
            <Box sx={{ maxHeight: 160, overflowY: "auto" }}>
              {addable.map((u) => (
                <Box
                  key={u.id}
                  onClick={() => !busy && add(u)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                    py: 0.75,
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                  }}
                >
                  <UserAvatar user={u} size={32} showPresence={false} />
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {displayName(u)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        ) : (
          members.map((m) => (
            <Box
              key={m.id}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}
            >
              <UserAvatar user={m} size={38} showPresence={false} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {displayName(m)} {m.id === meId && "(You)"}
                </Typography>
              </Box>
              {m.isAdmin && (
                <Chip label="Admin" size="small" color="primary" variant="outlined" />
              )}
              {isAdmin && m.id !== meId && (
                <IconButton size="small" disabled={busy} onClick={() => remove(m)}>
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersDialog;
