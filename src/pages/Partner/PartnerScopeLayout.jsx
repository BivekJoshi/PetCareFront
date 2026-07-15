import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import MarketplaceThemeScope from "../../theme/MarketplaceThemeScope";

/**
 * Wraps the partner dashboard pages in the marketplace's purple brand scope.
 * These render inside the staff DashboardLayout, so we keep full width and
 * standard dashboard padding (unlike the narrow customer column).
 */
const PartnerScopeLayout = () => (
  <MarketplaceThemeScope>
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Outlet />
    </Box>
  </MarketplaceThemeScope>
);

export default PartnerScopeLayout;
