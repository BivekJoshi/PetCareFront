import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";

import AvatarUploader from "../../components/common/AvatarUploader";
import OwnerQrDialog from "../../components/common/qr/OwnerQrDialog";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ColorModeContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const { mutate: logout } = useLogout();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const copyCode = () => {
    if (!user?.ownerCode) return;
    navigator.clipboard?.writeText(user.ownerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box>
      {/* Identity card */}
      <Card variant="outlined" sx={{ borderRadius: 4, p: 2.5, textAlign: "center", mb: 2 }}>
        <AvatarUploader size={76} fallback="🐾" sx={{ mb: 1.25 }} />
        <Typography sx={{ fontWeight: 800, fontSize: "1.2rem" }}>
          {fullName(user) || "Pet parent"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {humanize(role || "Pet Owner")}
        </Typography>

        <Stack spacing={0.75} sx={{ mt: 1.75, textAlign: "left" }}>
          {user?.email && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
              <MailOutlineRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" noWrap>{user.email}</Typography>
            </Stack>
          )}
          {user?.phone && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
              <PhoneIphoneRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" noWrap>{user.phone}</Typography>
            </Stack>
          )}
        </Stack>
      </Card>

      {/* PetCare code — share with a vet/clinic so they can pull up your pets */}
      {user?.ownerCode && (
        <Card variant="outlined" sx={{ borderRadius: 4, p: 2, mb: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <QrCode2Icon color="primary" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Your PetCare code
              </Typography>
              <Typography
                sx={{ fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}
              >
                {user.ownerCode}
              </Typography>
            </Box>
            <Tooltip title={copied ? "Copied!" : "Copy code"}>
              <IconButton onClick={copyCode} color={copied ? "success" : "default"}>
                {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            startIcon={<QrCodeScannerRoundedIcon />}
            onClick={() => setQrOpen(true)}
            sx={{ mt: 1.5, borderRadius: 2 }}
          >
            Show QR code
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Show the QR (or share this code) so your vet or clinic can scan it to view
            your pets and their appointment history.
          </Typography>
        </Card>
      )}

      <OwnerQrDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        code={user?.ownerCode}
        name={fullName(user)}
      />

      {/* Settings list */}
      <Card variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
        <List disablePadding>
          <ListItemButton onClick={() => navigate("/app/chat")}>
            <ListItemIcon><ChatRoundedIcon /></ListItemIcon>
            <ListItemText primary="Messages" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
          <Divider component="li" />

          <ListItemButton onClick={() => navigate("/app/account/security")}>
            <ListItemIcon><SecurityRoundedIcon /></ListItemIcon>
            <ListItemText primary="Security & password" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
          <Divider component="li" />

          <ListItemButton onClick={() => navigate("/app/account/role-request")}>
            <ListItemIcon><BadgeOutlinedIcon /></ListItemIcon>
            <ListItemText
              primary="Become a vet or admin"
              secondary="Request a role change"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
          <Divider component="li" />

          <ListItemButton onClick={toggleMode}>
            <ListItemIcon><DarkModeOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Dark mode" primaryTypographyProps={{ fontWeight: 600 }} />
            <Switch edge="end" checked={mode === "dark"} onChange={toggleMode} />
          </ListItemButton>
          <Divider component="li" />

          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
            <ListItemText primary="Visit website" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </List>
      </Card>

      {/* Sign out */}
      <Card variant="outlined" sx={{ borderRadius: 4, overflow: "hidden", mt: 2 }}>
        <ListItemButton onClick={() => logout()} sx={{ color: "error.main" }}>
          <ListItemIcon><LogoutRoundedIcon color="error" /></ListItemIcon>
          <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>
      </Card>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "center", mt: 3, opacity: 0.7 }}
      >
        🐾 PetCare · Care, simplified
      </Typography>
    </Box>
  );
};

export default OwnerProfile;
