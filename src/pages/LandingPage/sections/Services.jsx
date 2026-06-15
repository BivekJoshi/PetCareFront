import { useEffect, useState } from "react";
import { Box, Container, Grid, MobileStepper } from "@mui/material";
import SectionHeading from "../components/SectionHeading";
import ServiceItem from "../components/ServiceItem";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { SERVICES, SERVICE_SLIDES } from "../data";

const SLIDE_INTERVAL_MS = 3000;

const Services = () => {
  const [activeStep, setActiveStep] = useState(0);
  const slideCount = SERVICE_SLIDES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % slideCount);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [slideCount]);

  const leftServices = SERVICES.slice(0, 2);
  const rightServices = SERVICES.slice(2, 4);
  const activeSlide = SERVICE_SLIDES[activeStep];

  return (
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Care &" }, { text: "Consultations", color: "primary" }]}
        sx={{ mb: 3, flexWrap: "wrap" }}
      />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        textAlign="justify"
      >
        <Grid item xs={12} md={4}>
          {leftServices.map((service) => (
            <ServiceItem key={service.id} {...service} />
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 500,
              mx: "auto",
              aspectRatio: "1 / 1",
            }}
          >
            <Box
              component="img"
              src={activeSlide.image}
              alt={activeSlide.label}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <MobileStepper
              steps={slideCount}
              position="static"
              activeStep={activeStep}
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {rightServices.map((service) => (
            <ServiceItem key={service.id} {...service} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Services;
