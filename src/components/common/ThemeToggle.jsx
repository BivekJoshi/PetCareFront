/* eslint-disable react/prop-types */
import { IconButton, Tooltip } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorMode } from "../../context/ColorModeContext";

/**
 * Small icon button that flips the app between light and dark mode.
 * `color` lets callers override the icon color (e.g. the landing navbar,
 * which paints over a teal hero where the default contrast color is wrong).
 */
const ThemeToggle = ({ size = "small", color }) => {
  const { mode, toggleMode } = useColorMode();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleMode}
        size={size}
        aria-label="toggle color mode"
        sx={color ? { color } : undefined}
      >
        {isDark ? (
          <LightModeOutlinedIcon fontSize={size} />
        ) : (
          <DarkModeOutlinedIcon fontSize={size} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
