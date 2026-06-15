import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ResButton from "../../../components/ResponsiveComponent/ResButton";
import heroBackground from "../../../assets/BackgroundImage.png";
import heroForeground from "../../../assets/Image1.png";
import heroBadge from "../../../assets/Image2.png";
import { COLORS, HERO } from "../data";

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: COLORS.heroBackground,
        width: "100%",
        height: { xs: "260px", md: "600px" },
      }}
    >
      <Grid
        item
        xs={6}
        sx={{ position: "relative", height: { xs: "260px", md: "600px" } }}
      >
        <Box
          sx={{
            position: "absolute",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: { xs: 0, md: "1rem" },
            padding: { xs: "1rem", md: "10rem" },
          }}
        >
          <Typography variant={isMobile ? "h6" : "h2"} sx={{ fontWeight: 700 }}>
            {HERO.title}
          </Typography>
          <Typography variant={isMobile ? "h7" : "h4"}>{HERO.quote}</Typography>
          <ResButton
            variant="contained"
            endIcon={<ChevronRightIcon />}
            backgroundColor={theme.palette.primary.alt}
            color="white"
            content={HERO.cta}
          />
          <Box
            component="img"
            src={heroBadge}
            alt=""
            sx={{
              width: { xs: "90px", md: "auto" },
              height: { xs: "100px", md: "auto" },
            }}
          />
        </Box>
      </Grid>

      <Grid
        item
        xs={6}
        sx={{
          position: "relative",
          height: { xs: "60px", md: "600px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={heroForeground}
          alt={HERO.imageAlt}
          sx={{
            position: "absolute",
            width: { xs: "140px", md: "490px" },
            height: { xs: "130px", md: "438px" },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Hero;
