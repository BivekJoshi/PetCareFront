import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { usePets } from "../../hooks/pets/usePets";
import { useVets } from "../../hooks/vets/useVets";
import { useBusinesses } from "../../hooks/marketplace/useMarketplace";
import { fullName } from "../../utility/format";
import { petEmoji } from "../../pages/Owner/ownerUi";
import { staggerParent, staggerChild } from "./ownerMotion";

const MotionBox = motion(Box);

/**
 * Rail search flyout — one field over three catalogues (your pets, vets,
 * marketplace businesses), each capped at four hits so no one section can push
 * the others off screen.
 *
 * The query is debounced at 250ms. With an empty box the hooks still run and
 * return first-page results, which doubles as a useful "browse" state instead
 * of an empty panel.
 *
 * Mounted only while open (AnimatePresence in OwnerNavRail), so none of these
 * queries are live when the panel is closed.
 */

const SECTION_LIMIT = 4;

const Section = ({ label, children }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography
      variant="caption"
      sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 0.75 }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const Hit = ({ avatar, title, subtitle, onClick }) => (
  <MotionBox
    variants={staggerChild}
    onClick={onClick}
    whileHover={{ x: 3 }}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      p: 1,
      mx: -1,
      borderRadius: 2,
      cursor: "pointer",
      "&:hover": { bgcolor: "action.hover" },
    }}
  >
    {avatar}
    <Box sx={{ minWidth: 0 }}>
      {/* component="div" because business hits pass a Stack as the title — a
          Stack inside the default <p> would be invalid nesting. */}
      <Typography component="div" noWrap sx={{ fontWeight: 600, fontSize: ".875rem", lineHeight: 1.3 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography noWrap variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </MotionBox>
);

const HitSkeleton = () => (
  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 1 }}>
    <Skeleton variant="circular" width={36} height={36} />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="55%" height={14} />
      <Skeleton width="35%" height={11} />
    </Box>
  </Stack>
);

const OwnerSearchPanel = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);

  // Autofocus once the slide-in has started, so the caret doesn't appear
  // mid-flight.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(t);
  }, [term]);

  const params = useMemo(
    () => ({ search: debounced || undefined, limit: SECTION_LIMIT }),
    [debounced]
  );

  const petsQ = usePets(params);
  const vetsQ = useVets(params);
  const bizQ = useBusinesses({ ...params, sort: "topRated" });

  const pets = petsQ.data?.items ?? [];
  const vets = vetsQ.data?.items ?? [];
  const businesses = bizQ.data?.items ?? [];

  const loading = petsQ.isLoading || vetsQ.isLoading || bizQ.isLoading;
  const empty = !loading && !pets.length && !vets.length && !businesses.length;

  const go = (to) => {
    onNavigate?.();
    navigate(to);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", mb: 2 }}>Search</Typography>
        <TextField
          inputRef={inputRef}
          fullWidth
          size="small"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Pets, vets, businesses…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2.5, bgcolor: "action.hover" },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 3 }}>
        {loading ? (
          <>
            <HitSkeleton />
            <HitSkeleton />
            <HitSkeleton />
          </>
        ) : empty ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, textAlign: "center" }}>
            <Box sx={{ fontSize: 38 }}>🔍</Box>
            <Typography sx={{ fontWeight: 700 }}>No matches</Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different name.
            </Typography>
          </Stack>
        ) : (
          <MotionBox variants={staggerParent} initial="hidden" animate="show">
            {pets.length > 0 && (
              <Section label="Your pets">
                {pets.map((p) => (
                  <Hit
                    key={p.id}
                    avatar={<Box sx={{ fontSize: 26, width: 36, textAlign: "center" }}>{petEmoji(p.species)}</Box>}
                    title={p.name}
                    subtitle={p.breed || p.species}
                    onClick={() => go("/app/pets")}
                  />
                ))}
              </Section>
            )}

            {vets.length > 0 && (
              <Section label="Vets">
                {vets.map((v) => (
                  <Hit
                    key={v.id}
                    avatar={
                      <Avatar sx={{ width: 36, height: 36, fontSize: ".8rem", bgcolor: "info.main" }}>
                        {(v.user?.firstName?.[0] || "V").toUpperCase()}
                      </Avatar>
                    }
                    title={`Dr. ${fullName(v.user)}`}
                    subtitle={v.specialization || "Veterinarian"}
                    onClick={() => go("/app/appointments")}
                  />
                ))}
              </Section>
            )}

            {businesses.length > 0 && (
              <Section label="Marketplace">
                {businesses.map((b) => (
                  <Hit
                    key={b.id}
                    avatar={
                      <Avatar
                        src={b.logoUrl || undefined}
                        sx={{ width: 36, height: 36, fontSize: ".8rem", bgcolor: "primary.main" }}
                      >
                        {b.name?.[0]?.toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <span>{b.name}</span>
                        {b.isVerified && (
                          <Chip label="✓" size="small" color="primary" sx={{ height: 16, "& .MuiChip-label": { px: 0.5, fontSize: ".6rem" } }} />
                        )}
                      </Stack>
                    }
                    subtitle={b.tagline || b.primaryCategory?.label}
                    onClick={() => go(`/app/marketplace/business/${b.slug}`)}
                  />
                ))}
              </Section>
            )}
          </MotionBox>
        )}
      </Box>
    </Box>
  );
};

export default OwnerSearchPanel;
