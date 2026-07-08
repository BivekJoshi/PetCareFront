import { Box } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

/**
 * PetCareQr — a crisp, high-contrast QR tile.
 *
 * The QR itself stays near-black on white (best scan reliability); brand colour
 * lives in the surrounding frame, not the modules. Reusable anywhere we need to
 * render a PetCare code as a QR (owner check-in, future clinic passes, etc).
 */
const PetCareQr = ({ value, size = 224, sx }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: "#fff",
      borderRadius: 4,
      display: "inline-flex",
      lineHeight: 0,
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.16)",
      ...sx,
    }}
  >
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      fgColor="#0F172A"
      bgColor="#FFFFFF"
      marginSize={0}
    />
  </Box>
);

export default PetCareQr;
