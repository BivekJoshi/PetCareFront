import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "petcare-color-mode";

const ColorModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
  setMode: () => {},
});

const getInitialMode = () => {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage unavailable — fall back to system preference */
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

/**
 * Holds the active color mode (light/dark), persists the user's choice to
 * localStorage, and exposes a toggle. Wrap the app with this above the MUI
 * ThemeProvider so the theme can be rebuilt whenever the mode changes.
 */
export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore persistence failures */
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeContext;
