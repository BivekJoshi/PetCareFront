import { Box, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SectionHeading from "../components/SectionHeading";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { PILLARS } from "../data";

const ICONS = {
  track: TravelExploreIcon,
  community: GroupsIcon,
  vets: LocalHospitalIcon,
  consult: MedicalServicesIcon,
};

const Pillars = () => {
  const theme = useTheme();

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "One Platform," }, { text: "Every Need", color: "primary" }]}
        sx={{ mb: 4, flexWrap: "wrap" }}
      />
      <Grid container spacing={3}>
        {PILLARS.map((pillar) => {
          const Icon = ICONS[pillar.icon];
          return (
            <Grid item xs={12} sm={6} md={3} key={pillar.id}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: `${theme.palette.primary.main}1A`,
                    color: theme.palette.primary.main,
                  }}
                >
                  {Icon && <Icon fontSize="large" />}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pillar.desc}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Pillars;
