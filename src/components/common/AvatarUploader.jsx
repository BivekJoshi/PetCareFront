import { useRef } from "react";
import toast from "react-hot-toast";
import { Avatar, Badge, Box, CircularProgress } from "@mui/material";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

import { useAuth } from "../../context/AuthContext";
import { useUploadAvatar } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // keep in sync with the backend cap
const ACCEPT = "image/png,image/jpeg,image/jpg,image/gif,image/webp";

const initialsOf = (user) =>
  fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Clickable avatar that lets the signed-in user upload or replace their profile
 * photo. Works for any role — the new photo is synced into AuthContext on
 * success, so every avatar across the app updates at once.
 */
const AvatarUploader = ({ size = 76, fallback = "🐾", sx }) => {
  const { user } = useAuth();
  const { mutate: uploadAvatar, isLoading } = useUploadAvatar();
  const inputRef = useRef(null);

  const pick = () => {
    if (!isLoading) inputRef.current?.click();
  };

  const onSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image is too large (max 5 MB)");
      return;
    }
    uploadAvatar(file);
  };

  const initials = initialsOf(user);
  const badgeDot = Math.max(20, Math.round(size * 0.32));

  return (
    <Box sx={{ display: "inline-flex", ...sx }}>
      <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={onSelected} />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <Box
            sx={{
              width: badgeDot,
              height: badgeDot,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 2,
              borderColor: "background.paper",
            }}
          >
            <PhotoCameraRoundedIcon sx={{ fontSize: badgeDot * 0.58 }} />
          </Box>
        }
        sx={{ "& .MuiBadge-badge": { p: 0 } }}
      >
        <Box
          role="button"
          tabIndex={0}
          onClick={pick}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick()}
          aria-label="Change profile photo"
          sx={{
            position: "relative",
            borderRadius: "50%",
            cursor: isLoading ? "default" : "pointer",
            display: "inline-flex",
          }}
        >
          <Avatar
            src={user?.avatarUrl || undefined}
            sx={{
              width: size,
              height: size,
              fontSize: `${(size / 47).toFixed(2)}rem`,
              fontWeight: 800,
              bgcolor: "primary.main",
            }}
          >
            {initials || fallback}
          </Avatar>
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={Math.round(size * 0.34)} sx={{ color: "#fff" }} />
            </Box>
          )}
        </Box>
      </Badge>
    </Box>
  );
};

export default AvatarUploader;
