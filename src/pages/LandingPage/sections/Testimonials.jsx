import { Avatar, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SectionHeading from "../components/SectionHeading";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import { TESTIMONIALS } from "../data";
import customerAvatar from "../../../assets/customer.jpg";

const Testimonials = () => (
  <Box sx={{ backgroundColor: "grey.50" }}>
    <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
      <SectionHeading
        segments={[{ text: "Happy" }, { text: "Pet Parents", color: "primary" }]}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={3}>
        {TESTIMONIALS.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <FormatQuoteIcon color="primary" sx={{ fontSize: 40, opacity: 0.5 }} />
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {item.quote}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={customerAvatar} alt={item.name} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Testimonials;
