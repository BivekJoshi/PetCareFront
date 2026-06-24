import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { getBreadcrumbTrail } from "./navItems";

const ROOT = { label: "Dashboard", to: "/app", icon: HomeRoundedIcon };

// A MUI Box that also accepts framer-motion animation props.
const MotionBox = motion.create(Box);

/**
 * Breadcrumb bar for the dashboard shell. Derives the trail from the current
 * route via the nav structure, renders a circular home chip, links for
 * ancestors and a highlighted, glowing chip for the current page. Crumbs
 * stagger in; chevron separators tint from faint → accent across the trail.
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

  const primary = theme.palette.primary.main;
  // The logo pairs teal with the secondary brand accent — exposed on the theme
  // as `primary.alt`. Echo it in the active crumb so the trail reads on-brand.
  const accent = theme.palette.primary.alt;
  const total = crumbs.length;

  // shared spring-ish entrance, staggered by position in the trail
  const enter = (i) => ({
    initial: { opacity: 0, y: -4, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 },
  });

  // Ancestor link — a quiet glass pill that lifts into a tinted chip on hover.
  const linkSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    color: "text.secondary",
    fontSize: ".8rem",
    fontWeight: 600,
    textDecoration: "none",
    px: 1,
    py: 0.4,
    borderRadius: 999,
    border: `1px solid transparent`,
    transition:
      "color .2s ease, background-color .2s ease, border-color .2s ease, transform .2s ease",
    "&:hover": {
      color: "primary.main",
      bgcolor: alpha(primary, 0.1),
      borderColor: alpha(primary, 0.25),
      transform: "translateY(-1px)",
    },
  };

  const renderCrumb = (crumb, i) => {
    const Icon = crumb.icon;
    const isCurrent = crumb.current || i === total - 1;
    const isHome = i === 0;

    // --- Home: circular icon-only chip ---
    if (isHome && !isCurrent) {
      return (
        <Tooltip key="home" title="Dashboard" arrow>
          <MotionBox
            {...enter(i)}
            component={RouterLink}
            to={crumb.to}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: "50%",
              color: "text.secondary",
              textDecoration: "none",
              border: `1px solid ${alpha(primary, 0.18)}`,
              background: alpha(primary, 0.06),
              transition:
                "color .2s ease, background-color .2s ease, border-color .2s ease, transform .2s ease",
              "&:hover": {
                color: "primary.main",
                bgcolor: alpha(primary, 0.14),
                borderColor: alpha(primary, 0.4),
                transform: "translateY(-1px)",
              },
            }}
          >
            <HomeRoundedIcon sx={{ fontSize: 16 }} />
          </MotionBox>
        </Tooltip>
      );
    }

    // --- Current page: glowing gradient chip with a pulsing indicator dot ---
    if (isCurrent || !crumb.to) {
      return (
        <MotionBox
          key={`${crumb.label}-${i}`}
          {...enter(i)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.7,
            fontSize: ".8rem",
            fontWeight: 800,
            letterSpacing: ".01em",
            color: "primary.main",
            pl: 1,
            pr: 1.25,
            py: 0.4,
            borderRadius: 999,
            // teal → accent gradient, mirroring the logo's brand sweep
            background: `linear-gradient(120deg, ${alpha(primary, 0.2)} 0%, ${alpha(
              primary,
              0.1,
            )} 50%, ${alpha(accent, 0.18)} 100%)`,
            boxShadow: `inset 0 0 0 1px ${alpha(accent, 0.3)}, 0 6px 16px -12px ${alpha(
              accent,
              1,
            )}`,
          }}
        >
          {Icon && <Icon sx={{ fontSize: 15 }} />}
          {crumb.label}
        </MotionBox>
      );
    }

    // --- Ancestor: text link pill ---
    return (
      <MotionBox
        key={`${crumb.label}-${i}`}
        {...enter(i)}
        component={RouterLink}
        to={crumb.to}
        sx={linkSx}
      >
        {Icon && <Icon sx={{ fontSize: 15 }} />}
        {crumb.label}
      </MotionBox>
    );
  };

  const inner = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      {crumbs.map((crumb, i) => (
        <Box
          key={`wrap-${crumb.label}-${i}`}
          sx={{ display: "inline-flex", alignItems: "center", minWidth: 0 }}
        >
          {i > 0 && (
            <ChevronRightRoundedIcon
              sx={{
                fontSize: 18,
                mx: 0.25,
                flexShrink: 0,
                // the chevron feeding the active page glows accent; the rest
                // warm from faint → teal as you near the end
                color:
                  i === total - 1
                    ? alpha(accent, 0.7)
                    : alpha(primary, 0.25 + (i / total) * 0.4),
              }}
            />
          )}
          {renderCrumb(crumb, i)}
        </Box>
      ))}
    </Box>
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
        px: 1.5,
        py: 0.85,
        display: "inline-flex",
        borderRadius: 999,
        border: 1,
        borderColor: alpha(primary, 0.14),
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        boxShadow: `0 8px 24px -18px ${alpha(primary, 0.8)}`,
      }}
    >
      {inner}
    </Box>
  );
};

export default DashboardBreadcrumbs;
