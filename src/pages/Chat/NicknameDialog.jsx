/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { setNickname, clearNickname } from "../../api/chat/chat-api";
import { chatKeys } from "../../hooks/chat/useChat";
import { fullName } from "../../utility/format";

/** Set or clear the current user's private nickname for `user`. */
const NicknameDialog = ({ open, user, onClose }) => {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setLabel(user?.nickname || "");
  }, [open, user?.nickname]);

  const refresh = () => {
    queryClient.invalidateQueries(chatKeys.conversations);
    queryClient.invalidateQueries({ queryKey: ["chat", "contacts"] });
    queryClient.invalidateQueries(chatKeys.calls);
  };

  const save = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const trimmed = label.trim();
      if (trimmed) await setNickname({ userId: user.id, label: trimmed });
      else await clearNickname(user.id);
      refresh();
      toast.success(trimmed ? "Nickname saved" : "Nickname cleared");
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not save nickname");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await clearNickname(user.id);
      refresh();
      toast.success("Nickname cleared");
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not clear nickname");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Set nickname</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Only you will see this name for{" "}
          <strong>{fullName(user)}</strong>.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Nickname"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder={fullName(user)}
          inputProps={{ maxLength: 60 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {user?.nickname && (
          <Button color="error" onClick={remove} disabled={busy} sx={{ mr: "auto" }}>
            Clear
          </Button>
        )}
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={busy}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NicknameDialog;
