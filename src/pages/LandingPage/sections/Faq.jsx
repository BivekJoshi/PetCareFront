import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectionHeading from "../components/SectionHeading";
import { SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { FAQS } from "../data";

const Faq = () => (
  <Container maxWidth="md" sx={{ py: SECTION_PY }}>
    <SectionHeading
      segments={[{ text: "Frequently" }, { text: "Asked", color: "primary" }]}
      sx={{ mb: 4 }}
    />
    <Container disableGutters sx={{ maxWidth: TEXT_MAX_WIDTH }}>
      {FAQS.map((faq) => (
        <Accordion
          key={faq.id}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            mb: 1.5,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  </Container>
);

export default Faq;
