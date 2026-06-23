/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useContacts, chatKeys } from "../../hooks/chat/useChat";
import { createGroup } from "../../api/chat/chat-api";
import { displayName } from "../../utility/format";
import UserAvatar from "./UserAvatar";

/** Create a group: pick a name and one or more members. */
const CreateGroupDialog = ({ open, onClose, onCreated }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({}); // id -> user
  const [busy, setBusy] = useState(false);
  const contacts = useContacts(search.trim() ? search.trim() : undefined);

  const selectedList = Object.values(selected);

  const toggle = (user) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[user.id]) delete next[user.id];
      else next[user.id] = user;
      return next;
    });

  const reset = () => {
    setName("");
    setSearch("");
    setSelected({});
  };

  const submit = async () => {
    if (!name.trim() || selectedList.length === 0) return;
    setBusy(true);
    try {
      const group = await createGroup({
        name: name.trim(),
        memberIds: selectedList.map((u) => u.id),
      });
      queryClient.invalidateQueries(chatKeys.groups);
      toast.success("Group created");
      reset();
      onCreated?.(group);
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not create group");
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>New group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{ maxLength: 100 }}
          sx={{ mb: 2, mt: 0.5 }}
        />

        {selectedList.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
            {selectedList.map((u) => (
              <Chip
                key={u.id}
                size="small"
                avatar={<Avatar>{(u.firstName?.[0] || "?").toUpperCase()}</Avatar>}
                label={displayName(u)}
                onDelete={() => toggle(u)}
              />
            ))}
          </Box>
        )}

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
            placeholder="Add people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.9rem" }}
          />
        </Box>

        <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
          {contacts.isLoading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
              <CircularProgress size={22} />
            </Box>
          ) : (
            (contacts.data || []).map((u) => (
              <Box
                key={u.id}
                onClick={() => toggle(u)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1,
                  py: 0.75,
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: selected[u.id]
                    ? (t) => alpha(t.palette.primary.main, 0.1)
                    : "transparent",
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                }}
              >
                <Checkbox checked={Boolean(selected[u.id])} sx={{ p: 0.5 }} />
                <UserAvatar user={u} size={36} showPresence={false} />
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {displayName(u)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={busy || !name.trim() || selectedList.length === 0}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupDialog;
