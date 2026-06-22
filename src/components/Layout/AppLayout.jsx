import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer/Footer";

const AppLayout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Box sx={{ position: "fixed", width: "100%", zIndex: 100 }}>
      <Navbar />
    </Box>
    {/* No top spacer: the hero sits behind the transparent navbar so they
        blend at the top. Sections use scrollMarginTop to clear the bar. */}
    <Box component="main" sx={{ flex: "1 0 auto" }}>
      <Outlet />
    </Box>
    <Box sx={{ flex: "0 0 auto" }}>
      <Footer />
    </Box>
  </Box>
);

export default AppLayout;
