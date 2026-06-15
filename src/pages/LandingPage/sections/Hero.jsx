import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ResButton from "../../../components/ResponsiveComponent/ResButton";
import heroBackground from "../../../assets/BackgroundImage.png";
import { CONTENT_MAX_WIDTH } from "../../../constants/layout";
import { COLORS, HERO } from "../data";

// Three.js is heavy — load it only when the hero renders.
const BoneCanvas = lazy(() => import("../components/BoneCanvas"));

const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: COLORS.heroBackground,
        width: "100%",
        minHeight: { md: "600px" },
        py: { xs: 5, md: 0 },
      }}
    >
      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ minHeight: { md: "600px" } }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ minHeight: { md: "600px" } }}
        >
          <Grid item xs={12} md={6}>
            <Stack spacing={2} alignItems="flex-start">
              <Chip
                label={HERO.badge}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                {HERO.title}
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 520 }}>
                {HERO.subtitle}
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <ResButton
                  endIcon={<ChevronRightIcon />}
                  backgroundColor={theme.palette.primary.alt}
                  color="white"
                  content={HERO.primaryCta}
                  onClick={() => navigate("/login")}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                  onClick={() => navigate("/login")}
                >
                  {HERO.secondaryCta}
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              aria-label={HERO.imageAlt}
              sx={{
                width: "100%",
                height: { xs: "260px", md: "480px" },
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                }
              >
                <BoneCanvas />
              </Suspense>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
