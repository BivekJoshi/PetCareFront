import { Box, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SectionHeading from "../components/SectionHeading";
import { CONTENT_MAX_WIDTH, SECTION_PY, TEXT_MAX_WIDTH } from "../../../constants/layout";
import { COMMUNITY } from "../data";

const Community = () => (
  <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
    <SectionHeading
      segments={[{ text: "Shared" }, { text: "With Love", color: "primary" }]}
      sx={{ mb: 1.5, flexWrap: "wrap" }}
    />
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mb: 4,
        color: "text.secondary",
        maxWidth: TEXT_MAX_WIDTH,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <VisibilityOffIcon fontSize="small" color="primary" />
      <Typography variant="h6">{COMMUNITY.body}</Typography>
    </Box>
    <ImageList variant="masonry" cols={3} gap={12}>
      {COMMUNITY.images.map((src, index) => (
        <ImageListItem key={index}>
          <Box
            component="img"
            src={src}
            alt="A community pet"
            loading="lazy"
            sx={{ borderRadius: 2, width: "100%", display: "block" }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  </Container>
);

export default Community;
