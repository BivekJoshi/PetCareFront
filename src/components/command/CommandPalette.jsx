import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Dialog,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ColorModeContext";
import { useLogout } from "../../hooks/auth/useAuth";
import { buildNavCommands, searchCommands } from "./commandRegistry";

/** A small keyboard-key chip, e.g. ⌘ / ↑ / Esc, for the palette footer. */
const Kbd = ({ children }) => (
  <Box
    component="kbd"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 20,
      height: 20,
      px: 0.65,
      fontFamily: "inherit",
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1,
      color: "text.secondary",
      bgcolor: "action.hover",
      border: 1,
      borderColor: "divider",
      borderRadius: 1,
    }}
  >
    {children}
  </Box>
);

/** Bold the characters of `label` that matched the query. */
const Highlight = ({ label, indices }) => {
  if (!indices || indices.length === 0) return label;
  const set = new Set(indices);
  return (
    <>
      {label.split("").map((ch, i) =>
        set.has(i) ? (
          <Box
            key={i}
            component="span"
            sx={{ color: "primary.main", fontWeight: 800 }}
          >
            {ch}
          </Box>
        ) : (
          <span key={i}>{ch}</span>
        )
      )}
    </>
  );
};

const ICON_BOX = 34;

/**
 * Modern Ctrl/⌘+K command palette: fuzzy-searchable navigation plus quick
 * actions (theme, sign out…), full keyboard control, and result highlighting.
 * State lives in CommandPaletteContext; this component only renders + reacts.
 */
const CommandPalette = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { role } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const { mutate: logout } = useLogout();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef(new Map());

  // Quick actions — built here so they can close over live hooks.
  const actionCommands = useMemo(
    () => [
      {
        id: "action:theme",
        kind: "action",
        label: mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
        group: "Actions",
        icon: mode === "dark" ? LightModeOutlinedIcon : DarkModeOutlinedIcon,
        keywords: "theme dark light mode toggle appearance",
        perform: toggleMode,
        keepOpen: true,
      },
      {
        id: "action:site",
        kind: "action",
        label: "Back to main site",
        group: "Actions",
        icon: HomeOutlinedIcon,
        keywords: "home landing site exit dashboard",
        perform: () => navigate("/"),
      },
      {
        id: "action:logout",
        kind: "action",
        label: "Sign out",
        group: "Actions",
        icon: LogoutOutlinedIcon,
        keywords: "logout sign out exit session",
        perform: () => logout(),
      },
    ],
    [mode, toggleMode, navigate, logout]
  );

  const allCommands = useMemo(() => {
    const nav = buildNavCommands(role).map((c) => ({
      ...c,
      perform: () => navigate(c.to),
    }));
    return [...nav, ...actionCommands];
  }, [role, navigate, actionCommands]);

  const results = useMemo(
    () => searchCommands(allCommands, query),
    [allCommands, query]
  );

  // Group results in their ranked order while keeping a flat list that the
  // keyboard navigation indexes into.
  const { groups, flat } = useMemo(() => {
    const g = [];
    const byName = new Map();
    results.forEach((cmd) => {
      if (!byName.has(cmd.group)) {
        byName.set(cmd.group, g.length);
        g.push({ name: cmd.group, items: [] });
      }
      g[byName.get(cmd.group)].items.push(cmd);
    });
    return { groups: g, flat: g.flatMap((grp) => grp.items) };
  }, [results]);

  // Reset everything each time the palette opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  // Keep the active row in range and scrolled into view.
  useEffect(() => {
    if (active > flat.length - 1) setActive(flat.length ? flat.length - 1 : 0);
  }, [flat.length, active]);

  useEffect(() => {
    const el = itemRefs.current.get(flat[active]?.id);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, flat]);

  const runCommand = (cmd) => {
    if (!cmd) return;
    if (!cmd.keepOpen) onClose();
    cmd.perform?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(flat[active]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(flat.length - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      transitionDuration={160}
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "stretch", sm: "flex-start" },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha("#0B1220", 0.55),
            backdropFilter: "blur(4px)",
          },
        },
        paper: {
          sx: {
            mt: { xs: 0, sm: "11vh" },
            width: "100%",
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
            boxShadow:
              "0 20px 25px -5px rgba(16, 24, 40, 0.18), 0 8px 10px -6px rgba(16, 24, 40, 0.14)",
          },
        },
      }}
    >
      {/* Search field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.25,
          py: 1.75,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <SearchRoundedIcon sx={{ color: "text.secondary" }} />
        <InputBase
          inputRef={inputRef}
          autoFocus
          fullWidth
          placeholder="Search pages and actions…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          sx={{ fontSize: "1.05rem", "& input": { p: 0 } }}
        />
        <Box
          component="kbd"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignItems: "center",
            px: 0.75,
            height: 22,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "inherit",
            color: "text.secondary",
            bgcolor: "action.hover",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          Esc
        </Box>
      </Box>

      {/* Results */}
      <Box
        ref={listRef}
        sx={{
          maxHeight: { xs: "calc(100vh - 132px)", sm: 420 },
          overflowY: "auto",
          py: 1,
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.text.primary, 0.18),
            borderRadius: 8,
          },
        }}
      >
        {flat.length === 0 ? (
          <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
            <Typography color="text.secondary">
              No results for &ldquo;{query}&rdquo;
            </Typography>
          </Box>
        ) : (
          groups.map((group) => (
            <Box key={group.name} sx={{ mb: 0.5 }}>
              <Typography
                sx={{
                  px: 2.25,
                  pt: 1,
                  pb: 0.5,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                }}
              >
                {group.name}
              </Typography>
              {group.items.map((cmd) => {
                const idx = flat.indexOf(cmd);
                const selected = idx === active;
                const Icon = cmd.icon;
                return (
                  <Box
                    key={cmd.id}
                    ref={(el) => {
                      if (el) itemRefs.current.set(cmd.id, el);
                      else itemRefs.current.delete(cmd.id);
                    }}
                    onMouseMove={() => setActive(idx)}
                    onClick={() => runCommand(cmd)}
                    sx={{
                      mx: 1,
                      px: 1.25,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      bgcolor: selected
                        ? alpha(theme.palette.primary.main, 0.12)
                        : "transparent",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 4,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: selected ? 18 : 0,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        transition: "height .15s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: ICON_BOX,
                        height: ICON_BOX,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1.5,
                        color: selected ? "primary.main" : "text.secondary",
                        bgcolor: selected
                          ? alpha(theme.palette.primary.main, 0.16)
                          : "action.hover",
                      }}
                    >
                      {Icon ? <Icon fontSize="small" /> : null}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: "0.95rem",
                        }}
                      >
                        <Highlight label={cmd.label} indices={cmd.indices} />
                      </Typography>
                      {cmd.context ? (
                        <Typography
                          noWrap
                          variant="caption"
                          color="text.secondary"
                        >
                          {cmd.context}
                        </Typography>
                      ) : null}
                    </Box>
                    {selected ? (
                      <KeyboardReturnRoundedIcon
                        fontSize="small"
                        sx={{ color: "text.disabled", flexShrink: 0 }}
                      />
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          ))
        )}
      </Box>

      {/* Footer hints */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2.25,
          py: 1.25,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: alpha(theme.palette.text.primary, 0.02),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Typography variant="caption" color="text.secondary">
            Navigate
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Kbd>↵</Kbd>
          <Typography variant="caption" color="text.secondary">
            Open
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Kbd>Esc</Kbd>
          <Typography variant="caption" color="text.secondary">
            Close
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {flat.length} result{flat.length === 1 ? "" : "s"}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
