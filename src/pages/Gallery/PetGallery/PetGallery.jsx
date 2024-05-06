import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import video from "../../../assets/Videos/video.mp4";
import { useState } from "react";
import { useEffect } from "react";
import Gallery from "./Gallery/Gallery";

const PetGallery = () => {
  const [randomText, setRandomText] = useState("Unleash Your Dog's Inner Star");
  const texts = [
    "Where Doggy Dreams Become Reality",
    "Unleash Your Dog's Inner Star",
  ];

  useEffect(() => {
    const rotateText = () => {
      let index = 0;
      setInterval(() => {
        setTimeout(() => {
          setRandomText(texts[index]);
          index = (index + 1) % texts?.length;
        }, 500);
      }, 3000);
    };
    rotateText();
    return () => clearInterval();
  }, []);

  return (
    <>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <div style={{ width: "130%", marginLeft: "-15%" }}>
          <Box
            sx={{
              height: "500px",
              borderRadius: "0 0 50% 50% / 0 0 100% 100%",
              position: "relative",
            }}
          >
            <video
              src={video}
              type="video/mp4"
              style={{
                position: "absolute",
                width: "100%",
                height: "140%",
                bottom: "0",
                borderRadius: "0 0 50% 50%",
                objectFit: "cover",
              }}
              controls={false}
              autoPlay
              muted
              loop
            />
            <div
              style={{
                position: "absolute",
                left: "0",
                width: "50%",
                textAlign: "center",
                color: "white",
                zIndex: "1",
                paddingTop: "10rem",
              }}
            >
              <Typography variant="h2">
                <b>MEN'S BESTFRIEND</b>
              </Typography>
              <h1>A planet of surprise for your pets.</h1>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-11rem",
                width: "100%",
                color: "white",
                zIndex: "1",
                height: "19rem",
                display: "flex",
                flexDirection: "row-reverse",
                marginLeft: "-14%",
                fontWeight: "bold",
              }}
            >
              <Paper
                sx={{
                  padding: "10px",
                  width: "600px",
                  // backgroundColor: "rgb(240, 128, 26)",
                  backgroundImage: 'linear-gradient(to right, orange,#45BBBD, #567A39)',
                  color: "white",
                  textAlign: "center",
                  paddingTop: "42px",
                }}
              >
                <Typography variant="h2">{randomText}</Typography>
              </Paper>
            </div>
          </Box>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          marginTop: '15px',
        }}
      >
        <Gallery />
      </div>
    </>
  );
};

export default PetGallery;
