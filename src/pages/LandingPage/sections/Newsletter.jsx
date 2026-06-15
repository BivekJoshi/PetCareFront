import { useState } from "react";
import { Box, Container, Stack, TextField, Typography, useTheme } from "@mui/material";
import ResButton from "../../../components/ResponsiveComponent/ResButton";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { NEWSLETTER } from "../data";

const Newsletter = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    // Wire up to a real subscription endpoint when available.
    setEmail("");
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, color: "#FFFFFF" }}>
      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY, textAlign: "center" }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
          {NEWSLETTER.title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          {NEWSLETTER.subtitle}
        </Typography>
        <Stack
          component="form"
          onSubmit={handleSubscribe}
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ maxWidth: 480, mx: "auto" }}
        >
          <TextField
            fullWidth
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}
          />
          <ResButton
            backgroundColor={theme.palette.primary.alt}
            content={NEWSLETTER.cta}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Newsletter;
