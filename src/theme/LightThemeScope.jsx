 
import { useMemo } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";

/**
 * Pins its subtree to the light theme regardless of the global color mode.
 * Used for the public landing page and the auth screens, which are designed
 * light-only and should not follow the dashboard's dark-mode toggle.
 *
 * The wrapping Box repaints the light `background.default`/`text.primary` over
 * a full viewport height so the surface stays light even when the root body
 * (driven by the app-wide theme) is currently dark.
 */
const LightThemeScope = ({ children }) => {
  const theme = useMemo(() => createTheme(themeSettings("light")), []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default LightThemeScope;
