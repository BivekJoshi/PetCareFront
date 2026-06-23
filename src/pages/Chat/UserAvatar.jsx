/* eslint-disable react/prop-types */
import { Avatar, Badge } from "@mui/material";
import { fullName } from "../../utility/format";

const initialsOf = (user) =>
  fullName(user)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

/** Round avatar with initials and an optional green "online" presence dot. */
const UserAvatar = ({ user, online = false, size = 44, showPresence = true }) => {
  const avatar = (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
      }}
    >
      {initialsOf(user)}
    </Avatar>
  );

  if (!showPresence) return avatar;

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-dot": {
          width: 11,
          height: 11,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "background.paper",
          bgcolor: online ? "success.main" : "grey.400",
        },
      }}
    >
      {avatar}
    </Badge>
  );
};

export default UserAvatar;
