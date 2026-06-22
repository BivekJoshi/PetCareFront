import React, { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { themeSettings } from "./theme/theme";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./utility/ScrollToTop";
import { ColorModeProvider, useColorMode } from "./context/ColorModeContext";

const ThemedApp = () => {
  const { mode } = useColorMode();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <ScrollToTop> */}
      <AppRoutes />
      {/* </ScrollToTop> */}
    </ThemeProvider>
  );
};

const App = () => (
  <ColorModeProvider>
    <ThemedApp />
  </ColorModeProvider>
);

export default App;
