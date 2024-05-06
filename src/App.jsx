import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme/theme";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings()));
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
