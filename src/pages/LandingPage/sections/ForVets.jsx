import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ResButton from "../../../components/ResponsiveComponent/ResButton";
import Reveal from "../../../components/motion/Reveal";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { VET } from "../data";

const ForVets = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <Reveal
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 6 },
          backgroundColor: `${theme.palette.primary.main}12`,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "primary.main" }}>
              <LocalHospitalIcon />
              <Typography variant="overline" sx={{ fontWeight: 700 }}>
                For Veterinarians
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
              {VET.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {VET.body}
            </Typography>
            <List dense disablePadding>
              {VET.points.map((point) => (
                <ListItem key={point} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: "left", md: "center" } }}>
            <ResButton
              backgroundColor={theme.palette.primary.alt}
              content={VET.cta}
              onClick={() => navigate("/login")}
            />
          </Grid>
        </Grid>
      </Reveal>
    </Container>
  );
};

export default ForVets;
