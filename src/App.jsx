import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { themeSettings } from "./theme/theme";
import AppRoutes from "./routes/AppRoutes";
import { ColorModeProvider, useColorMode } from "./context/ColorModeContext";
import ErrorBoundary from "./components/Errorboundary/ErrorBoundary";

const ThemedApp = () => {
  const { mode } = useColorMode();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

const App = () => (
  <ColorModeProvider>
    <ThemedApp />
  </ColorModeProvider>
);

export default App;
