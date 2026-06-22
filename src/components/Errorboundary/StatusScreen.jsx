import { Box, Button, Container, Stack, Typography } from "@mui/material";

/**
 * Shared full-screen status layout used by the 404 / 401 pages and the
 * ErrorBoundary fallback. Presentational only — callers pass in the copy,
 * an icon and one or two actions so the visual language stays consistent.
 */
const StatusScreen = ({
  code,
  title,
  message,
  icon,
  primaryAction,
  secondaryAction,
  details,
}) => (
  <Box
    sx={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      py: 6,
      bgcolor: "background.default",
    }}
  >
    <Container maxWidth="sm">
      <Stack spacing={3} alignItems="center" textAlign="center">
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: "50%",
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(69,187,189,0.12)"
                  : "rgba(69,187,189,0.10)",
              color: "primary.main",
              "& svg": { fontSize: 48 },
            }}
          >
            {icon}
          </Box>
        )}

        {code && (
          <Typography
            component="p"
            sx={{
              fontWeight: 900,
              lineHeight: 1,
              fontSize: { xs: "4rem", sm: "5.5rem" },
              letterSpacing: "-0.04em",
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {code}
          </Typography>
        )}

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {message && (
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              {message}
            </Typography>
          )}
        </Box>

        {details && (
          <Box
            component="pre"
            sx={{
              width: "100%",
              maxHeight: 180,
              overflow: "auto",
              textAlign: "left",
              p: 2,
              m: 0,
              borderRadius: 2,
              fontSize: "0.78rem",
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
              color: "text.secondary",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {details}
          </Box>
        )}

        {(primaryAction || secondaryAction) && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
          >
            {primaryAction && (
              <Button
                variant="contained"
                size="large"
                onClick={primaryAction.onClick}
                startIcon={primaryAction.icon}
                fullWidth={false}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outlined"
                size="large"
                onClick={secondaryAction.onClick}
                startIcon={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  </Box>
);

export default StatusScreen;
