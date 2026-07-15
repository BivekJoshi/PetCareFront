import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import MarketplaceThemeScope from "../../theme/MarketplaceThemeScope";

/**
 * Layout route wrapping every customer marketplace screen in the purple brand
 * scope. Content is constrained to a phone-ish column (matching the design's
 * mobile screens) and centred so it reads well inside either app shell.
 */
const MarketplaceScopeLayout = () => (
  <MarketplaceThemeScope>
    <Box sx={{ maxWidth: 680, mx: "auto", px: { xs: 1.5, sm: 2 }, py: 2, pb: 6 }}>
      <Outlet />
    </Box>
  </MarketplaceThemeScope>
);

export default MarketplaceScopeLayout;
