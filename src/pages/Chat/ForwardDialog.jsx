/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  InputBase,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useContacts } from "../../hooks/chat/useChat";
import { useMessageActions } from "../../hooks/chat/useMessageActions";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";
import UserAvatar from "./UserAvatar";

/** Pick a contact to forward `message` to. */
const ForwardDialog = ({ open, message, onClose }) => {
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const contacts = useContacts(search.trim() ? search.trim() : undefined);
  const { forward } = useMessageActions();

  const handlePick = async (user) => {
    if (busyId || !message) return;
    setBusyId(user.id);
    try {
      await forward(message.id, user.id);
      onClose();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Forward to…</DialogTitle>

      <Box sx={{ px: 2, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            bgcolor: "action.hover",
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.9rem" }}
          />
        </Box>
      </Box>

      <Box sx={{ maxHeight: 360, overflowY: "auto", pb: 1.5 }}>
        {contacts.isLoading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (contacts.data || []).length === 0 ? (
          <Typography sx={{ px: 3, py: 3 }} color="text.secondary">
            No people found.
          </Typography>
        ) : (
          (contacts.data || []).map((u) => (
            <Box
              key={u.id}
              onClick={() => handlePick(u)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1,
                mx: 1,
                borderRadius: 2,
                cursor: busyId ? "default" : "pointer",
                opacity: busyId && busyId !== u.id ? 0.5 : 1,
                "&:hover": {
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                },
              }}
            >
              <UserAvatar user={u} size={40} showPresence={false} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {fullName(u)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {humanize(u.role || "")}
                </Typography>
              </Box>
              {busyId === u.id && <CircularProgress size={18} />}
            </Box>
          ))
        )}
      </Box>
    </Dialog>
  );
};

export default ForwardDialog;
