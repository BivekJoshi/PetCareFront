import { Box, Container, Divider, Grid, Link, Stack, Typography, useTheme } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CONTENT_MAX_WIDTH, SECTION_PY } from "../../../constants/layout";
import Logo from "../../../assets/YejuLogo.png";

const LINK_COLUMNS = [
  {
    title: "Platform",
    links: ["Track Pets", "Community", "Find a Vet", "Insights", "How It Works"],
  },
  {
    title: "Services",
    links: ["Consultation", "Vaccination", "Booking", "Stray Care"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
];

const CONTACT_DETAILS = [
  { icon: PhoneIcon, text: "+977 9871253656" },
  { icon: PhoneIcon, text: "Tel: 01-2359440" },
  { icon: EmailIcon, text: "abc@gmail.com" },
  { icon: LocationOnIcon, text: "Patan Dhoka, Lalitpur" },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: YouTubeIcon, label: "YouTube", href: "#" },
];

const LEGAL_LINKS = ["Terms and Conditions", "Privacy Policy", "Site Map"];

const footerLinkSx = {
  color: "inherit",
  opacity: 0.85,
  cursor: "pointer",
  textDecoration: "none",
  transition: "opacity 0.2s ease-in-out",
  "&:hover": { opacity: 1, textDecoration: "underline" },
};

const ColumnTitle = ({ children }) => (
  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
    {children}
  </Typography>
);

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: theme.palette.primary.main, color: "#FFFFFF" }}
    >
      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ py: SECTION_PY }}>
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src={Logo}
              alt="Yejus Paw"
              sx={{ height: 48, mb: 2 }}
            />
            <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
              A community platform to track, share and care for every pet — from
              street animals to home companions.
            </Typography>
            <Stack direction="row" spacing={1}>
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  sx={{
                    color: "inherit",
                    opacity: 0.85,
                    transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
                    "&:hover": { opacity: 1, transform: "scale(1.15)" },
                  }}
                >
                  <Icon />
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Link columns */}
          {LINK_COLUMNS.map((column) => (
            <Grid item xs={6} sm={4} md={2} key={column.title}>
              <ColumnTitle>{column.title}</ColumnTitle>
              <Stack spacing={1}>
                {column.links.map((link) => (
                  <Link key={link} href="#" variant="body2" sx={footerLinkSx}>
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <ColumnTitle>Contact</ColumnTitle>
            <Stack spacing={1.2}>
              {CONTACT_DETAILS.map(({ icon: Icon, text }) => (
                <Box
                  key={text}
                  sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.85 }}
                >
                  <Icon fontSize="small" />
                  <Typography variant="body2">{text}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.25)" }} />

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {LEGAL_LINKS.map((link) => (
              <Link key={link} href="#" variant="body2" sx={footerLinkSx}>
                {link}
              </Link>
            ))}
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.85, textAlign: "center" }}>
            © {year} YEJUS PAW. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
