import { useNavigate } from "react-router-dom";
import { Badge, Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

import { BOTTOM_TABS } from "./ownerNav";
import { SPRING, TABBAR_PILL } from "./ownerMotion";

const MotionBox = motion(Box);

/**
 * Phone tab bar.
 *
 * Hand-rolled rather than MUI's BottomNavigation because the active state is a
 * shared-layout pill: framer springs one element between tabs, which reads as
 * the indicator travelling rather than two backgrounds cross-fading. That is
 * not expressible through BottomNavigation's `Mui-selected` styling.
 *
 * Icons lift slightly when selected, so the active tab is legible even to
 * someone who can't distinguish the accent colour.
 */
const OwnerTabBar = ({ activeTab, badges = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const primary = theme.palette.primary.main;

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: 0,
        display: "flex",
        height: 68,
        px: 0.5,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {BOTTOM_TABS.map((t) => {
        const active = activeTab === t.value;
        const count = t.badge ? badges[t.badge] ?? 0 : 0;
        return (
          <MotionBox
            key={t.value}
            component="button"
            type="button"
            aria-label={t.label}
            aria-current={active ? "page" : undefined}
            onClick={() => navigate(t.to)}
            whileTap={{ scale: 0.9 }}
            sx={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              m: 0.5,
              p: 0,
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.25,
              color: active ? "primary.main" : "text.disabled",
              transition: "color .2s ease",
            }}
          >
            {active && (
              <MotionBox
                layoutId={TABBAR_PILL}
                transition={SPRING}
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 3,
                  bgcolor: alpha(primary, 0.1),
                }}
              />
            )}
            <MotionBox
              animate={{ y: active ? -1 : 0, scale: active ? 1.08 : 1 }}
              transition={SPRING}
              sx={{ zIndex: 1, display: "flex" }}
            >
              {count > 0 ? (
                <Badge badgeContent={count} color="error" max={9}>
                  <t.icon />
                </Badge>
              ) : (
                <t.icon />
              )}
            </MotionBox>
            <Typography
              sx={{ zIndex: 1, fontSize: "0.7rem", fontWeight: 700, lineHeight: 1 }}
            >
              {t.label}
            </Typography>
          </MotionBox>
        );
      })}
    </Box>
  );
};

export default OwnerTabBar;
