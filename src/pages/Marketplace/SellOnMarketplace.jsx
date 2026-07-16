import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/domain";
import { useMyRoleRequests } from "../../hooks/roleRequests/useRoleRequests";
import { MK } from "../../theme/marketplaceTokens";

const BENEFITS = [
  { icon: <StorefrontRoundedIcon />, title: "Your own storefront", body: "Publish a listing with photos, services, pricing, hours and location." },
  { icon: <CampaignRoundedIcon />, title: "Promo codes & offers", body: "Run deals customers can discover and redeem across the marketplace." },
  { icon: <ChatRoundedIcon />, title: "Direct enquiries", body: "Chat with customers in real time and respond to reviews." },
  { icon: <VerifiedUserRoundedIcon />, title: "Verified badge", body: "KYB-verified merchants earn trust and convert far better." },
];

const STEPS = [
  "Business identity — legal name, trading name, ABN, business type",
  "Upload KYB documents — ASIC company extract & director ID",
  "Admin review & verification",
  "Your storefront is created — finish your listing and publish",
];

const SellOnMarketplace = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const requests = useMyRoleRequests();

  const isPartner = role === ROLES.PARTNER;
  const pendingPartner = (requests.data || []).some(
    (r) => r.requestedRole === "PARTNER" && r.status === "PENDING",
  );

  // Already a partner → send them to their storefront.
  if (isPartner) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          You're a verified partner
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your storefront, offers, reviews and customer enquiries from your partner dashboard.
        </Typography>
        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate("/app/partner")}>
          Go to my storefront
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, mb: 3, background: MK.voucher, color: "#fff" }}
      >
        <Chip
          label="For businesses"
          size="small"
          sx={{ bgcolor: "rgba(255,255,255,.2)", color: "#fff", fontWeight: 700, mb: 1 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Sell on Marketplace
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, maxWidth: 460 }}>
          Reach more customers with a verified storefront. Get set up in a few minutes — verification
          keeps the marketplace trustworthy for everyone.
        </Typography>

        {pendingPartner ? (
          <Alert severity="info" sx={{ bgcolor: "rgba(255,255,255,.92)" }}>
            Your partner application is under review. We'll notify you once it's approved.
          </Alert>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/app/account/role-request?role=PARTNER")}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ bgcolor: "#fff", color: MK.brand, "&:hover": { bgcolor: "#f0f0f0" } }}
          >
            Start KYB verification
          </Button>
        )}
      </Paper>

      {/* Benefits */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        What you get
      </Typography>
      <Stack spacing={1.25} sx={{ mb: 3 }}>
        {BENEFITS.map((b) => (
          <Paper
            key={b.title}
            elevation={0}
            sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 1.5, alignItems: "flex-start" }}
          >
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2, flexShrink: 0,
                bgcolor: MK.brandSoft, color: MK.brand,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {b.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {b.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {b.body}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* How KYB works */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        How verification works
      </Typography>
      <Stack spacing={1.25} sx={{ mb: 3 }}>
        {STEPS.map((s, i) => (
          <Stack key={i} direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                bgcolor: MK.brand, color: "#fff", fontWeight: 700, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {i + 1}
            </Box>
            <Typography variant="body2">{s}</Typography>
          </Stack>
        ))}
      </Stack>

      {!pendingPartner && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate("/app/account/role-request?role=PARTNER")}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Start KYB verification
        </Button>
      )}
    </Box>
  );
};

export default SellOnMarketplace;
