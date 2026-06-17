import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { staggerItem, staggerParent } from "../../../components/motion/variants";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { COMMUNITY } from "../data";

const MotionImageList = motion.create(ImageList);
const MotionImageListItem = motion.create(ImageListItem);

// Decorative like counts so each photo feels part of a living feed.
const LIKES = [128, 86, 203, 64, 152, 97];

const Community = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Shared" }, { text: "With Love", color: "primary" }]}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Chip
          icon={<VisibilityOffIcon />}
          label="100% anonymous"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, borderWidth: 2 }}
        />
      </Box>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: 4, textAlign: "center", fontWeight: 400 }}
      >
        {COMMUNITY.body}
      </Typography>

      <MotionImageList
        variant="masonry"
        cols={3}
        gap={14}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {COMMUNITY.images.map((src, index) => (
          <MotionImageListItem
            key={index}
            variants={staggerItem}
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 8px 24px -12px rgba(0,0,0,0.35)",
              "& img": { transition: "transform 0.5s ease", display: "block", width: "100%" },
              "&:hover img": { transform: "scale(1.08)" },
              "&:hover .community-overlay": { opacity: 1 },
            }}
          >
            <Box component="img" src={src} alt="A community pet" loading="lazy" />
            <Box
              className="community-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                transition: "opacity 0.35s ease",
                background:
                  "linear-gradient(to top, rgba(19,48,44,0.7) 0%, rgba(19,48,44,0) 55%)",
                display: "flex",
                alignItems: "flex-end",
                p: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#fff" }}>
                <FavoriteIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {LIKES[index % LIKES.length]}
                </Typography>
                <Chip
                  label="Anonymous"
                  size="small"
                  sx={{
                    ml: 0.5,
                    height: 20,
                    color: "#13302C",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                  }}
                />
              </Box>
            </Box>
          </MotionImageListItem>
        ))}
      </MotionImageList>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddAPhotoRoundedIcon />}
          onClick={() => navigate("/login")}
        >
          Share your pet
        </Button>
      </Box>
    </Container>
  );
};

export default Community;
