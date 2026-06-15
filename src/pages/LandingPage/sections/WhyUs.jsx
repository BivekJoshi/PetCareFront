import { Box, Typography } from "@mui/material";
import SectionHeading from "../components/SectionHeading";
import whyUsBackground from "../../../assets/why-us-page.png";
import { COLORS, WHY_US } from "../data";

const WhyUs = () => (
  <Box
    sx={{
      backgroundImage: `url(${whyUsBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: COLORS.whyUsBackground,
      width: "100%",
      height: "520px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <SectionHeading
      segments={[{ text: "Why", color: "alt" }, { text: "Us?" }]}
      sx={{ gap: "0.8rem", padding: "1rem" }}
    />
    <Typography variant="h6" sx={{ width: "400px", textAlign: "justify" }}>
      {WHY_US.body}
    </Typography>
  </Box>
);

export default WhyUs;
