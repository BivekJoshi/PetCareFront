import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CommandPalette from "../components/command/CommandPalette";

const CommandPaletteContext = createContext({
  open: false,
  openPalette: () => {},
  closePalette: () => {},
  togglePalette: () => {},
});

/** True on macOS, where the canonical shortcut is ⌘K rather than Ctrl+K. */
export const IS_MAC =
  typeof navigator !== "undefined" &&
  /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || "");

/**
 * Owns the open/closed state for the command palette, binds the global
 * Ctrl/⌘+K hotkey, and renders the palette itself once near the app root so a
 * single instance is shared everywhere. Wrap the dashboard shell with this and
 * call `openPalette()` from anywhere (e.g. the app-bar trigger).
 */
export const CommandPaletteProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);
  const togglePalette = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      // ⌘K on mac, Ctrl+K elsewhere. Also accept the legacy Ctrl+/ as a
      // secondary trigger, a common "open search" convention.
      const isPaletteCombo =
        (key === "k" && (e.metaKey || e.ctrlKey)) ||
        (key === "/" && (e.metaKey || e.ctrlKey));
      if (isPaletteCombo) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({ open, openPalette, closePalette, togglePalette }),
    [open, openPalette, closePalette, togglePalette]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={closePalette} />
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = () => useContext(CommandPaletteContext);

export default CommandPaletteContext;
