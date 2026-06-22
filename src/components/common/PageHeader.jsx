import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle, action }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: { sm: "center" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
);

export default PageHeader;
