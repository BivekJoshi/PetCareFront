import { alpha } from "@mui/material/styles";

const palette = {
  surface: {
    neutral: "rgba(225, 233, 238, 1)",
    light: "rgba(255, 255, 255, 1)",
    dark: "rgba(37, 38, 46, 1)",
    100: "rgba(245, 249, 252, 1)",
    300: "rgba(205, 217, 224, 1)",
    400: "rgba(175, 188, 196, 1)",
    500: "rgba(136, 149, 160, 1)",
    600: "rgba(98, 112, 124, 1)",
    700: "rgba(61, 71.92, 82, 1)",
    800: "rgba(37, 38, 46, 1)",
    900: "rgba(28, 27, 34, 1)",
    a100: "rgba(150, 170, 181, 1)",
    a200: "rgba(63, 106, 129, 1)",
    a400: "rgba(55, 61.9, 70, 1)",
    a700: "rgba(11.69, 11.69, 11.69, 1)",
  },
  error: {
    red: "rgba(244, 67, 54, 1)",
    light: "rgba(229, 115, 115, 1)",
    dark: "rgba(211, 47, 47, 1)",
    50: "rgba(255, 235, 238, 1)",
    100: "rgba(255, 205, 210, 1)",
    200: "rgba(239, 154, 154, 1)",
    400: "rgba(239, 83, 80, 1)",
    600: "rgba(229, 57, 53, 1)",
    800: "rgba(198, 40, 40, 1)",
    900: "rgba(183, 28, 28, 1)",
    a100: "rgba(255, 205, 210, 1)",
    a200: "rgba(255, 82, 82, 1)",
    a400: "rgba(255, 23, 68, 1)",
    a700: "rgba(213, 0, 0, 1)",
  },
  warning: {
    light: "rgba(255, 183, 77, 1)",
    dark: "rgba(245, 124, 0, 1)",
    50: "rgba(255, 243, 224, 1)",
    100: "rgba(255, 224, 178, 1)",
    200: "rgba(255, 204, 128, 1)",
    400: "rgba(255, 167, 38, 1)",
    500: "rgba(255, 152, 0, 1)",
    600: "rgba(251, 140, 0, 1)",
    800: "rgba(239, 108, 0, 1)",
    900: "rgba(230, 81, 0, 1)",
    a100: "rgba(255, 209, 128, 1)",
    a200: "rgba(255, 171, 64, 1)",
    a400: "rgba(255, 145, 0, 1)",
    a700: "rgba(255, 109, 0, 1)",
  },
  sucess: {
    light: "rgba(129, 199, 132, 1)",
    dark: "rgba(56, 142, 60, 1)",
    50: "rgba(232, 245, 233, 1)",
    100: "rgba(200, 230, 201, 1)",
    200: "rgba(165, 214, 167, 1)",
    300: "rgba(129, 199, 132, 1)",
    400: "rgba(102, 187, 106, 1)",
    500: "rgba(76, 175, 80, 1)",
    600: "rgba(67, 160, 71, 1)",
    800: "rgba(46, 125, 50, 1)",
    900: "rgba(27, 94, 32, 1)",
    a100: "rgba(185, 246, 202, 1)",
    a200: "rgba(105, 240, 174, 1)",
    a400: "rgba(0, 230, 118, 1)",
    a700: "rgba(0, 200, 83, 1)",
  },
  info: {
    light: "rgba(100, 181, 246, 1)",
    dark: "rgba(25, 118, 210, 1)",
    50: "rgba(227, 242, 253, 1)",
    100: "rgba(187, 222, 251, 1)",
    200: "rgba(144, 202, 249, 1)",
    400: "rgba(66, 165, 245, 1)",
    500: "rgba(33, 150, 243, 1)",
    600: "rgba(30, 136, 229, 1)",
    800: "rgba(21, 101, 192, 1)",
    900: "rgba(13, 71, 161, 1)",
    a100: "rgba(130, 177, 255, 1)",
    a200: "rgba(68, 138, 255, 1)",
    a400: "rgba(41, 121, 255, 1)",
    a700: "rgba(41, 98, 255, 1)",
  },
  primary: {
    500: "#45BBBD",
    50: "#FFFFFF",
    100: "#E0FFFF",
    200: "#AEF0F5",
    300: "#7ADBE0",
    400: "#57CCD0",
    600: "#40ACAD",
    700: "#409E9D",
    800: "#388D8C",
    900: "#306F6B",
    a100: "#D2FFFF",
    a200: "#85FFFF",
    a400: "#30FFFB",
    a700: "#47E7E1",
  },
  secondary: {
    500: "#F8D152",
    50: "#FFFFFF",
    100: "#FDF7DE",
    200: "#FAECAF",
    300: "#F9E37E",
    400: "#F7D961",
    600: "#F8C54B",
    700: "#F4B244",
    800: "#F5A63F",
    900: "#F2882F",
  },
  tertiary: {
    50: "rgba(218.03, 215.99, 219.05, 1)",
    100: "rgba(193.04, 181.05, 208.08, 1)",
    200: "rgba(163.97, 142.03, 191, 1)",
    300: "rgba(135.91, 102, 177.99, 1)",
    400: "rgba(115, 72, 166, 1)",
    500: "rgba(95.11, 42.08, 155.04, 1)",
    600: "rgba(86.95, 38, 150.96, 1)",
    700: "rgba(75.99, 28.05, 140, 1)",
    800: "rgba(64, 22, 134, 1)",
    900: "rgba(43, 8, 119, 1)",
    a100: "rgba(170.08, 121.12, 224.91, 1)",
    a200: "rgba(120.1, 57.12, 222.1, 1)",
    a400: "rgba(104, 0, 223, 1)",
    a700: "rgba(94.09, 0, 200.94, 1)",
  },
};
export default palette;

export const themeSettings = (mode = "light") => {
  const isDark = mode === "dark";
  const primaryMain = palette.primary[500];
  const accent = palette.secondary[900];
  const deepTeal = palette.primary[800]; // #388D8C
  const deepOrange = "#D9701B"; // darker than the accent orange
  const gradient = `linear-gradient(135deg, ${deepTeal} 0%, ${accent} 55%, ${deepOrange} 100%)`;
  const gradientHover = `linear-gradient(135deg, ${deepOrange} 0%, ${accent} 45%, ${deepTeal} 100%)`;

  // Surface colors swing between the two modes; the brand teal/amber accents
  // stay constant so the identity reads the same in either theme.
  const background = isDark
    ? { default: "#0B1220", paper: "#141B2D" }
    : { default: palette.surface[100], paper: palette.surface.light };
  const text = isDark
    ? { primary: "#E6EDF3", secondary: "rgba(230,237,243,0.62)", disabled: "rgba(230,237,243,0.38)" }
    : { primary: palette.surface[900], secondary: palette.surface[600], disabled: palette.surface[500] };
  const divider = isDark ? "rgba(230,237,243,0.12)" : "rgba(16,24,40,0.10)";

  // The navigation rail keeps a dark, high-contrast identity in both modes
  // (a common dashboard pattern); it just deepens a touch in dark mode so it
  // sits flush with the darkened canvas. Colors centralized here so the
  // Sidebar/Layout never hard-code a hex value.
  const sidebar = {
    bg: isDark ? "#0A101F" : "#1E293B",
    text: "#E2E8F0",
    textDim: "rgba(226,232,240,0.66)",
    textFaint: "rgba(226,232,240,0.42)",
    divider: "rgba(226,232,240,0.12)",
    hover: "rgba(226,232,240,0.08)",
    surface: "rgba(226,232,240,0.06)",
    scrollThumb: "rgba(226,232,240,0.18)",
    accent: palette.primary[300], // brighter teal that reads on the dark rail
    activeBg: alpha(primaryMain, 0.2),
    activeBgChild: alpha(primaryMain, 0.16),
  };

  // RGB triplets (0–1) feeding the animated WebGL canvas backdrop, so it
  // tracks the active mode instead of staying a fixed near-white.
  const appCanvas = isDark
    ? {
        base: [0.035, 0.055, 0.09],
        mid: [0.05, 0.085, 0.13],
        peak: [0.08, 0.16, 0.2],
        crest: [0.04, 0.09, 0.1],
      }
    : {
        base: [0.99, 1.0, 1.0],
        mid: [0.9, 0.98, 0.98],
        peak: [0.66, 0.88, 0.89],
        crest: [0.02, 0.05, 0.05],
      };

  // Clean, Tailwind-inspired elevation ramp that replaces MUI's default heavy
  // material shadows. Six tiers (sm → 2xl) expanded across MUI's 25 elevation
  // slots so every elevation-based surface (Paper, Card, Menu, Popover, AppBar)
  // reads with the same soft, neutral depth. Cool-neutral tint in light mode,
  // deeper alpha in dark mode where subtle shadows would otherwise vanish.
  const shadowTiers = isDark
    ? [
        "0 1px 2px 0 rgba(0,0,0,0.4)",
        "0 1px 3px 0 rgba(0,0,0,0.5),0 1px 2px -1px rgba(0,0,0,0.5)",
        "0 4px 6px -1px rgba(0,0,0,0.5),0 2px 4px -2px rgba(0,0,0,0.5)",
        "0 10px 15px -3px rgba(0,0,0,0.55),0 4px 6px -4px rgba(0,0,0,0.5)",
        "0 20px 25px -5px rgba(0,0,0,0.55),0 8px 10px -6px rgba(0,0,0,0.5)",
        "0 25px 50px -12px rgba(0,0,0,0.7)",
      ]
    : [
        "0 1px 2px 0 rgba(16,24,40,0.05)",
        "0 1px 3px 0 rgba(16,24,40,0.1),0 1px 2px -1px rgba(16,24,40,0.1)",
        "0 4px 6px -1px rgba(16,24,40,0.1),0 2px 4px -2px rgba(16,24,40,0.1)",
        "0 10px 15px -3px rgba(16,24,40,0.1),0 4px 6px -4px rgba(16,24,40,0.08)",
        "0 20px 25px -5px rgba(16,24,40,0.1),0 8px 10px -6px rgba(16,24,40,0.08)",
        "0 25px 50px -12px rgba(16,24,40,0.25)",
      ];
  const shadows = ["none"];
  [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6].forEach(
    (tier) => shadows.push(shadowTiers[tier - 1]),
  );

  return {
    // Compact base radius (MUI/Tailwind default). Numeric `sx` borderRadius
    // values multiply this, so `borderRadius: 3` → 12px (rounded-xl),
    // `2` → 8px (rounded-lg), `1` → 4px — a clean Tailwind radius scale.
    shape: { borderRadius: 4 },
    shadows,
    typography: {
      fontFamily: ["DM Sans", "sans-serif"].join(","),
      button: {
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.01em",
      },
      h1: {
        fontSize: "2.225rem",
        fontWeight: 800,
        lineHeight: "1.05",
        letterSpacing: "-0.0625rem",
      },
      h2: {
        fontSize: "1.875rem",
        fontWeight: 800,
        lineHeight: "1.067",
        letterSpacing: "-0.05rem",
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 700,
        lineHeight: "1.083",
        letterSpacing: "-0.0375rem",
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 700,
        lineHeight: "1.1",
        letterSpacing: "-0.025rem",
      },
      h5: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: "1.111",
        letterSpacing: "-0.0125rem",
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
        letterSpacing: "-0.00625rem",
      },
      h7: {
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "-0.00525rem",
      },
      "@media (max-width:600px)": {
        h1: {
          fontSize: "1.5rem",
          fontWeight: "2.125rem",
        },
        h2: {
          fontSize: "1rem",
          fontWeight: "1.875rem  ",
        },
        h3: {
          fontSize: ".8rem",
          fontWeight: "1.5rem  ",
        },
        h4: {
          fontSize: ".8rem",
          fontWeight: "1.25rem  ",
        },
        h5: {
          fontSize: "1rem",
          fontWeight: "1.125rem  ",
        },
        h6: {
          fontSize: "1.125rem",
          fontWeight: "1rem",
        },
        h7: {
          fontSize: "1.025rem",
          fontWeight: "0.8rem",
        },
      },
      "@media (max-width:400px)": {
        h1: {
          fontSize: "1rem",
        },
        h2: {
          fontSize: ".8rem",
        },
        h3: {
          fontSize: ".6rem",
        },
        h4: {
          fontSize: ".8rem",
        },
        h5: {
          fontSize: ".8rem",
        },
        h6: {
          fontSize: ".6rem",
        },
        h7: {
          fontSize: ".1rem",
        },
      },
    },
    palette: {
      mode,
      primary: {
        main: palette.primary[500],
        light: palette.surface[100],
        alt: palette.secondary[900],
        backgroundCard: isDark ? palette.primary[900] : palette.primary[300],
        text: palette.secondary[500],
        background: palette.tertiary[400],
      },
      secondary: {
        main: palette.secondary[500],
      },
      background,
      text,
      divider,
      // Custom semantic tokens — consumed across the dashboard shell so color
      // decisions live here, not scattered through components.
      sidebar,
      appCanvas,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color .3s ease, color .3s ease",
            // Crisper text rendering — the single cheapest "clean" upgrade.
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          },
          // Thin, unobtrusive, theme-aware scrollbars app-wide (WebKit + Firefox).
          // Components with their own scrollbar rules (Sidebar, CommandPalette)
          // are more specific and keep their bespoke styling.
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: `${
              isDark ? "rgba(226,232,240,0.22)" : "rgba(16,24,40,0.22)"
            } transparent`,
          },
          "*::-webkit-scrollbar": { width: 10, height: 10 },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? "rgba(226,232,240,0.18)"
              : "rgba(16,24,40,0.18)",
            borderRadius: 999,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: isDark
              ? "rgba(226,232,240,0.32)"
              : "rgba(16,24,40,0.3)",
          },
          "*::-webkit-scrollbar-corner": { backgroundColor: "transparent" },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: "1.5rem",
            paddingBlock: "0.55rem",
            transition:
              "transform .2s ease, box-shadow .2s ease, filter .2s ease, background .2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
          contained: {
            background: gradient,
            color: "#ffffff",
            backgroundSize: "150% 150%",
            boxShadow: "0 1px 2px 0 rgba(33, 75, 72, 0.25)",
            "&:hover": {
              background: gradientHover,
              boxShadow: "0 4px 8px -2px rgba(33, 75, 72, 0.35)",
            },
          },
          outlined: {
            borderWidth: 2,
            borderColor: accent,
            color: deepOrange,
            // Soft whitish glassy fill at rest so the button reads as frosted
            // glass rather than a flat hollow outline.
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.28)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            "&:hover": {
              borderWidth: 2,
              borderColor: deepOrange,
              backgroundColor: `${accent}1f`,
            },
          },
          outlinedPrimary: {
            borderColor: accent,
            color: deepOrange,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.28)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            "&:hover": {
              borderColor: deepOrange,
              backgroundColor: `${accent}1f`,
            },
          },
        },
      },
      // Global form-field styling — every TextField / Select across the app
      // (auth, dashboard, dialogs) inherits this, so inputs stay consistent:
      // rounded, compact, with a clear teal focus ring. Adapts to light/dark.
      MuiTextField: {
        defaultProps: {
          size: "small", // a touch shorter than the default for a tighter form
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.9)",
            transition:
              "box-shadow .2s ease, border-color .2s ease, background-color .2s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: divider,
              transition: "border-color .2s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(primaryMain, 0.6),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: primaryMain,
              borderWidth: 1.5,
            },
            "&.Mui-focused": {
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#fff",
              boxShadow: `0 0 0 4px ${alpha(primaryMain, 0.14)}`,
            },
            "&.Mui-error.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(palette.error.red, 0.14)}`,
            },
          },
          input: {
            // Slightly reduced height for a more compact field.
            paddingTop: 11,
            paddingBottom: 11,
            fontSize: "0.95rem",
            "&::placeholder": { opacity: 0.65 },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 2,
            marginTop: 4,
            fontSize: "0.78rem",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
          outlined: { borderColor: divider },
        },
      },
      // Flat, clean surfaces: drop MUI's dark-mode elevation tint so paper reads
      // as a true surface colour; depth comes from the shadow ramp / borders.
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
          rounded: { borderRadius: 12 },
        },
      },
      // Cards default to a clean bordered panel rather than a floating shadow —
      // the modern dashboard look. Explicit elevation still wins where set.
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${divider}`,
            backgroundImage: "none",
          },
        },
      },
      // Menus / popovers: rounded, hairline-bordered, soft-shadowed, with
      // gently rounded item hover targets.
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${divider}`,
            marginTop: 4,
          },
          list: { padding: 6 },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginInline: 2,
            transition: "background-color .15s ease, color .15s ease",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${divider}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "background-color .15s ease, color .15s ease",
          },
        },
      },
      // Legible, padded, subtly rounded tooltips instead of the cramped default.
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark
              ? "rgba(20,27,45,0.96)"
              : "rgba(17,24,39,0.92)",
            backdropFilter: "blur(6px)",
            borderRadius: 8,
            paddingInline: 10,
            paddingBlock: 6,
            fontSize: "0.75rem",
            fontWeight: 500,
            boxShadow: shadows[4],
          },
          arrow: {
            color: isDark ? "rgba(20,27,45,0.96)" : "rgba(17,24,39,0.92)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { backgroundImage: "none" },
        },
      },
      // Soft-blurred scrim so a modal reads as focused. Guarded on `invisible`
      // so menu/select/popover backdrops stay transparent (no screen dimming).
      MuiBackdrop: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(!ownerState?.invisible && {
              backgroundColor: isDark
                ? "rgba(3,7,18,0.6)"
                : "rgba(16,24,40,0.35)",
              backdropFilter: "blur(2px)",
            }),
          }),
        },
      },
      MuiLink: {
        defaultProps: { underline: "hover" },
        styleOverrides: {
          root: { fontWeight: 600, textUnderlineOffset: 3 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: divider },
        },
      },
    },
  };
};
