import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Image from "../../../assets/why-us-page.png";

const AboutUs = () => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <div
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "520px",
        backgroundColor: "#FFDED2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: ".8rem",
          padding: "1rem",
        }}
      >
        <Typography variant="h2" sx={{ color: theme?.palette?.primary?.alt }}>
          <b>Why</b>
        </Typography>{" "}
        <Typography variant="h2">
          <b>Us?</b>
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ width: isXsScreen?"300px":"400px", textAlign: "justify" }}>
          Welcome to the Yejus Paw. Our range of products available are to suit
          dogs of all shapes and sizes-from Terriers to Great Danes and
          everything in between! We have developed our own product ranges and
          have hand-picked brands that offer products of the highest quality and
          that all have one thing in common; We’d be happy to feed the products
          to or use them on our own dogs.
        </Typography>
      </div>
    </div>
  );
};

export default AboutUs;
