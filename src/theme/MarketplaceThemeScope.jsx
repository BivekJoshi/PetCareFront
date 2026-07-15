import { useMemo } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import { MK } from "./marketplaceTokens";

/**
 * Re-skins its subtree to the marketplace's purple brand while keeping the rest
 * of the app on its teal theme. Built by layering a purple palette + solid
 * (non-gradient) primary buttons on top of the app's base theme, so shared
 * component overrides (radius, shadows, inputs) still apply.
 *
 * The marketplace design is a light surface; we pin it to light mode like the
 * public/auth screens so it reads on-brand regardless of the dashboard toggle.
 */
const MarketplaceThemeScope = ({ children, mode = "light" }) => {
  const theme = useMemo(() => {
    const base = createTheme(themeSettings(mode));
    return createTheme(base, {
      palette: {
        primary: {
          main: MK.brand,
          dark: MK.brandDeep,
          light: MK.brandSoft,
          contrastText: "#ffffff",
        },
        secondary: { main: MK.green, contrastText: "#ffffff" },
      },
      components: {
        // Kill the teal gradient — the marketplace uses solid purple CTAs.
        MuiButton: {
          styleOverrides: {
            contained: {
              backgroundImage: "none",
              background: MK.brand,
              boxShadow: "none",
              "&:hover": { backgroundImage: "none", background: MK.brandDeep, boxShadow: "none" },
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100%", bgcolor: "#F7F8FA", color: MK.ink }}>{children}</Box>
    </ThemeProvider>
  );
};

export default MarketplaceThemeScope;
