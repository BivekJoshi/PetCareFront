import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ResButton from "../../../components/ResponsiveComponent/ResButton";

/**
 * A single numbered service entry (number + title + description + CTA).
 *
 * @param {{ id: string, title: string, desc: string }} props
 */
const ServiceItem = ({ id, title, desc }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: { xs: "1rem 0", md: "1rem 6rem" } }}
    >
      <Grid item xs={1}>
        <Typography
          variant={isMobile ? "h4" : "h1"}
          sx={{ fontWeight: 700, color: theme.palette.primary.main }}
        >
          {id}
        </Typography>
      </Grid>
      <Grid item xs={11}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant={isMobile ? "h6" : "h3"} sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant={isMobile ? "h7" : "h6"}>{desc}</Typography>
          <Box sx={{ marginTop: { xs: "0.2rem", md: "2rem" } }}>
            <ResButton
              variant="contained"
              endIcon={<ChevronRightIcon />}
              content="Explore Now"
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ServiceItem;
