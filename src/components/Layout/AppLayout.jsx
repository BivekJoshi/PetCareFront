import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer/Footer";

const AppLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 auto", position: "fixed", width: "100%", zIndex: 100 }}>
        <Navbar />
      </div>
      <div style={{ flex: "1 0 auto", marginTop: "60px" }}>
        <Outlet />
      </div>
      <div style={{ flex: "0 0 auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
