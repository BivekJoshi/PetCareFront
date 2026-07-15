import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

/**
 * Shown on partner pages when the signed-in user has no Business yet (e.g. an
 * admin visiting, or a user who hasn't completed KYB). Points them at the
 * role-request/KYB flow that creates the storefront on approval.
 */
const NoStorefront = () => {
  const navigate = useNavigate();
  return (
    <Paper elevation={0} sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Box sx={{ "& svg": { fontSize: 48, color: "primary.main", opacity: 0.7 }, mb: 1 }}>
        <StorefrontOutlinedIcon />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        No storefront yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 420, mx: "auto" }}>
        Become a verified partner to publish a listing, run offers, and reach customers. Submit your
        business details for KYB verification to get started.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/app/account/role-request")}>
        Apply to become a partner
      </Button>
    </Paper>
  );
};

export default NoStorefront;
