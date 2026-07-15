import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import MarketplaceThemeScope from "../../theme/MarketplaceThemeScope";
import BusinessDetailView from "./BusinessDetailView";

/**
 * Public, shareable business page at /m/:slug (no auth). Renders the same detail
 * view in read-only mode — the IA's "web shareable link" discovery entry point.
 */
const PublicBusinessPage = () => {
  const { slug } = useParams();
  return (
    <MarketplaceThemeScope>
      <Box sx={{ maxWidth: 680, mx: "auto", px: 2, py: 3, minHeight: "100vh" }}>
        <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700 }}>
          Marketplace
        </Typography>
        <BusinessDetailView slug={slug} interactive={false} />
      </Box>
    </MarketplaceThemeScope>
  );
};

export default PublicBusinessPage;
