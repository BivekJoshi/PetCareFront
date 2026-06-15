import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer/Footer";

const AppLayout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Box sx={{ position: "fixed", width: "100%", zIndex: 100 }}>
      <Navbar />
    </Box>
    {/* Spacer offsets the fixed navbar (matches the Toolbar height). */}
    <Box component="main" sx={{ flex: "1 0 auto", mt: { xs: "56px", md: "64px" } }}>
      <Outlet />
    </Box>
    <Box sx={{ flex: "0 0 auto" }}>
      <Footer />
    </Box>
  </Box>
);

export default AppLayout;
