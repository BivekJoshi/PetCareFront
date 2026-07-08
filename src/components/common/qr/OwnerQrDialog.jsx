import { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PetCareQr from "./PetCareQr";

/**
 * OwnerQrDialog — a classy, brand-forward presentation of a pet owner's PetCare
 * code as a QR. The owner opens this and shows it to a vet/admin, who scans it
 * to pull up all their pets + appointment history.
 */
const OwnerQrDialog = ({ open, onClose, code, name }) => {
  const theme = useTheme();
  const p = theme.palette.primary;
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(135deg, ${p.dark || p.main} 0%, ${p.main} 55%, ${alpha(
    p.light || p.main,
    0.9,
  )} 100%)`;

  const copy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 5, overflow: "hidden" } }}
    >
      {/* Brand header */}
      <Box sx={{ background: gradient, color: "#fff", px: 3, py: 2.5, position: "relative" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PetsRoundedIcon />
          <Typography sx={{ fontWeight: 800, letterSpacing: 0.4 }}>PetCare</Typography>
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
          Check-in code
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 10, right: 10, color: alpha("#fff", 0.9) }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* QR + code */}
      <Box
        sx={{
          px: 3,
          py: 3.5,
          textAlign: "center",
          position: "relative",
          // soft brand glow behind the QR
          "&::before": {
            content: '""',
            position: "absolute",
            top: 24,
            left: "50%",
            width: 260,
            height: 260,
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${alpha(p.main, 0.18)} 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Show this to your vet or clinic — they’ll scan it to open your pets and
          appointment history.
        </Typography>

        <Box
          component={motion.div}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          sx={{ position: "relative", display: "inline-block" }}
        >
          <PetCareQr value={code || ""} size={220} />
        </Box>

        {name && (
          <Typography sx={{ fontWeight: 800, mt: 2.5 }}>{name}</Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 0.5 }}
        >
          <QrCode2Icon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography sx={{ fontWeight: 700, fontFamily: "monospace", letterSpacing: 1.5 }}>
            {code}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy code"}>
            <IconButton size="small" onClick={copy} color={copied ? "success" : "default"}>
              {copied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default OwnerQrDialog;
