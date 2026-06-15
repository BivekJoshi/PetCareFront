import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { CONTENT_MAX_WIDTH } from "../../../constants/layout";
import { STATS } from "../data";

const Stats = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, color: "#FFFFFF", py: { xs: 3, md: 4 } }}>
      <Container maxWidth={CONTENT_MAX_WIDTH}>
        <Grid container spacing={2}>
          {STATS.map((stat) => (
            <Grid item xs={6} md={3} key={stat.id} sx={{ textAlign: "center" }}>
              <Typography variant="h1" sx={{ fontWeight: 800 }}>
                {stat.value}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Stats;
