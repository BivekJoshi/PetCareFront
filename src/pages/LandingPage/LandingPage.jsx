import { Box } from "@mui/material";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Pillars from "./sections/Pillars";
import Species from "./sections/Species";
import HowItWorks from "./sections/HowItWorks";
import Community from "./sections/Community";
import Insights from "./sections/Insights";
import Services from "./sections/Services";
import ForVets from "./sections/ForVets";
import Testimonials from "./sections/Testimonials";
import Faq from "./sections/Faq";
import Newsletter from "./sections/Newsletter";
import { SCROLL_OFFSET } from "../../constants/navigation";

// Anchor wrapper so navbar links can smooth-scroll to a section without it
// being tucked under the fixed navbar.
const anchorSx = { scrollMarginTop: `${SCROLL_OFFSET}px` };

const LandingPage = () => (
  <>
    <Box component="section" id="home" sx={anchorSx}>
      <Hero />
    </Box>
    <Stats />
    <Box component="section" id="about" sx={anchorSx}>
      <Pillars />
    </Box>
    <Species />
    <Box component="section" id="how-it-works" sx={anchorSx}>
      <HowItWorks />
    </Box>
    <Community />
    <Insights />
    <Box component="section" id="services" sx={anchorSx}>
      <Services />
    </Box>
    <ForVets />
    <Box component="section" id="testimonials" sx={anchorSx}>
      <Testimonials />
    </Box>
    <Box component="section" id="faq" sx={anchorSx}>
      <Faq />
    </Box>
    <Newsletter />
  </>
);

export default LandingPage;
