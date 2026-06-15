import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import SectionHeading from "../components/SectionHeading";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { SPECIES } from "../data";

const Species = () => (
  <Box sx={{ backgroundColor: "grey.50" }}>
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Every" }, { text: "Animal Counts", color: "primary" }]}
        sx={{ mb: 1.5, flexWrap: "wrap" }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: TEXT_MAX_WIDTH, mx: "auto", mb: 4, textAlign: "center" }}
      >
        Not just dogs. We help communities track and care for every kind of pet
        and street animal.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {SPECIES.map((species) => (
          <Grid item xs={6} sm={4} md={3} key={species.id}>
            <Paper
              elevation={0}
              sx={{
                py: 3,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.2s ease, border-color 0.2s ease",
                "&:hover": { transform: "translateY(-4px)", borderColor: "primary.main" },
              }}
            >
              <Typography sx={{ fontSize: 40, lineHeight: 1 }}>{species.emoji}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                {species.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Species;
