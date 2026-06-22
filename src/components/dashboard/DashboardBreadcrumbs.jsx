 
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { getBreadcrumbTrail } from "./navItems";

const ROOT = { label: "Dashboard", to: "/app", icon: HomeRoundedIcon };

/**
 * Breadcrumb bar for the dashboard shell. Derives the trail from the current
 * route via the nav structure, renders links for ancestors and a highlighted,
 * non-clickable label for the current page.
 *
 * variant="bar"     → standalone, frosted-glass boxed bar (content area).
 * variant="inline"  → bare trail, no container/margin (e.g. inside the app bar).
 */
const DashboardBreadcrumbs = ({ variant = "bar" }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const inline = variant === "inline";

  const trail = getBreadcrumbTrail(pathname);
  // Drop a leading crumb that just points back at the root (e.g. Overview).
  const rest = trail.filter((c) => c.to !== ROOT.to);
  const crumbs = [ROOT, ...rest];

  const linkSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    color: "text.secondary",
    fontSize: ".85rem",
    fontWeight: 600,
    textDecoration: "none",
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
    transition: "color .2s ease, background-color .2s ease",
    "&:hover": {
      color: "primary.main",
      bgcolor: alpha(theme.palette.primary.main, 0.08),
    },
  };

  const inner = (
    <Breadcrumbs
      separator={
        <NavigateNextRoundedIcon
          sx={{ fontSize: 16, color: "text.disabled" }}
        />
      }
      aria-label="breadcrumb"
      sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}
    >
        {crumbs.map((crumb, i) => {
          const Icon = crumb.icon;
          const isCurrent = crumb.current || i === crumbs.length - 1;

          if (isCurrent || !crumb.to) {
            return (
              <Typography
                key={`${crumb.label}-${i}`}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: ".85rem",
                  fontWeight: 800,
                  color: isCurrent ? "primary.main" : "text.primary",
                  px: 0.75,
                }}
              >
                {Icon && <Icon sx={{ fontSize: 16 }} />}
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={`${crumb.label}-${i}`}
              component={RouterLink}
              to={crumb.to}
              sx={linkSx}
            >
              {Icon && <Icon sx={{ fontSize: 16 }} />}
              {crumb.label}
            </Link>
          );
        })}
    </Breadcrumbs>
  );

  if (inline) return inner;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        mb: 3,
        px: 2,
        py: 1,
        display: "inline-flex",
        borderRadius: 1.5,
        border: 1,
        borderColor: "divider",
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      }}
    >
      {inner}
    </Box>
  );
};

export default DashboardBreadcrumbs;
