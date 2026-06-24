import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/pets/usePets";
import { useAppointments } from "../../hooks/appointments/useAppointments";
import { useReminders } from "../../hooks/reminders/useReminders";
import {
  humanize,
  STATUS_COLORS,
  REMINDER_TYPE_COLORS,
} from "../../constants/domain";
import { formatDateTime } from "../../utility/format";
import { Loading, EmptyState, SectionTitle, petEmoji } from "./ownerUi";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const QuickAction = ({ icon: Icon, label, onClick, tone }) => {
  const theme = useTheme();
  const color = theme.palette[tone]?.main || theme.palette.primary.main;
  return (
    <CardActionArea
      onClick={onClick}
      sx={{
        flex: 1,
        borderRadius: 3,
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        alignItems: "center",
        bgcolor: alpha(color, 0.1),
        color,
      }}
    >
      <Icon />
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.primary" }}
      >
        {label}
      </Typography>
    </CardActionArea>
  );
};

const OwnerHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const petsQ = usePets({ limit: 12 });
  const upcomingQ = useAppointments({ limit: 1, sort: "scheduledAt" });
  const remindersQ = useReminders({ limit: 3 });

  const pets = petsQ.data?.items ?? [];
  const reminders = remindersQ.data?.items ?? [];
  const next = useMemo(() => {
    const items = upcomingQ.data?.items ?? [];
    const now = Date.now();
    return (
      items
        .filter(
          (a) =>
            a.scheduledAt &&
            new Date(a.scheduledAt).getTime() >= now &&
            ["PENDING", "CONFIRMED"].includes(a.status)
        )
        .sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
        )[0] || null
    );
  }, [upcomingQ.data]);

  const heroGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(
    theme.palette.primary.main,
    0.85
  )} 45%, ${theme.palette.primary.alt} 120%)`;

  return (
    <Box>
      {/* Greeting hero */}
      <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            color: "#fff",
            background: heroGradient,
            px: 2.5,
            py: 2.75,
            boxShadow: `0 20px 40px -22px ${alpha(theme.palette.primary.main, 0.8)}`,
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              right: -24,
              bottom: -34,
              fontSize: 130,
              opacity: 0.16,
              lineHeight: 1,
            }}
          >
            🐾
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.92, fontWeight: 600 }}>
            {greeting()},
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.2 }}>
            {user?.firstName || "Pet parent"} 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {pets.length
              ? `You're caring for ${pets.length} ${
                  pets.length === 1 ? "companion" : "companions"
                }.`
              : "Let's add your first companion."}
          </Typography>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={fade} initial="hidden" animate="show" custom={1}>
        <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
          <QuickAction
            icon={AddRoundedIcon}
            label="Add pet"
            tone="primary"
            onClick={() => navigate("/app/pets")}
          />
          <QuickAction
            icon={EventAvailableRoundedIcon}
            label="Book visit"
            tone="info"
            onClick={() => navigate("/app/appointments")}
          />
          <QuickAction
            icon={ChatRoundedIcon}
            label="Messages"
            tone="secondary"
            onClick={() => navigate("/app/chat")}
          />
        </Stack>
      </motion.div>

      {/* Pets strip */}
      <SectionTitle
        action={
          pets.length > 0 && (
            <Chip
              size="small"
              label="See all"
              onClick={() => navigate("/app/pets")}
              sx={{ fontWeight: 700, cursor: "pointer" }}
            />
          )
        }
      >
        Your pets
      </SectionTitle>
      {petsQ.isLoading ? (
        <Loading py={3} />
      ) : pets.length === 0 ? (
        <EmptyState
          emoji="🐾"
          title="No pets yet"
          hint="Register your first companion to start tracking their care."
        />
      ) : (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {pets.map((pet) => (
            <Stack
              key={pet.id}
              alignItems="center"
              spacing={0.75}
              sx={{ cursor: "pointer", minWidth: 64 }}
              onClick={() => navigate("/app/pets")}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontSize: 28,
                  bgcolor: "primary.backgroundCard",
                  border: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                }}
              >
                {petEmoji(pet.species)}
              </Avatar>
              <Typography variant="caption" noWrap sx={{ maxWidth: 64, fontWeight: 600 }}>
                {pet.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Next appointment */}
      <SectionTitle>Next appointment</SectionTitle>
      {upcomingQ.isLoading ? (
        <Loading py={3} />
      ) : !next ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <EmptyState
            emoji="📅"
            title="Nothing scheduled"
            hint="Book a vet visit, grooming or check-up in a couple of taps."
            action={
              <Chip
                color="primary"
                label="Book a visit"
                onClick={() => navigate("/app/appointments")}
                sx={{ fontWeight: 700, cursor: "pointer", color: "#fff" }}
              />
            }
          />
        </Card>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardActionArea
            sx={{ p: 2 }}
            onClick={() => navigate("/app/appointments")}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  fontSize: 24,
                  bgcolor: "primary.backgroundCard",
                }}
              >
                {petEmoji(next.pet?.species)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
                  <Typography sx={{ fontWeight: 800 }} noWrap>
                    {next.pet?.name || "Pet"}
                  </Typography>
                  <Chip
                    size="small"
                    label={humanize(next.status)}
                    color={STATUS_COLORS[next.status] || "default"}
                  />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />
                  <Typography variant="caption">
                    {formatDateTime(next.scheduledAt)}
                    {next.service?.name ? ` · ${next.service.name}` : ""}
                  </Typography>
                </Stack>
              </Box>
              <ArrowForwardRoundedIcon sx={{ color: "text.disabled" }} />
            </Stack>
          </CardActionArea>
        </Card>
      )}

      {/* Reminders preview */}
      <SectionTitle
        action={
          reminders.length > 0 && (
            <Chip
              size="small"
              label="All"
              onClick={() => navigate("/app/reminders")}
              sx={{ fontWeight: 700, cursor: "pointer" }}
            />
          )
        }
      >
        Reminders
      </SectionTitle>
      {remindersQ.isLoading ? (
        <Loading py={3} />
      ) : reminders.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <EmptyState emoji="🔔" title="You're all caught up" />
        </Card>
      ) : (
        <Stack spacing={1.25}>
          {reminders.map((r) => {
            const tone = REMINDER_TYPE_COLORS[r.type] || "primary";
            const isUnread = !(r.isRead ?? r.read);
            return (
              <Card
                key={r.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderLeft: 4,
                  borderLeftColor: `${tone}.main`,
                  bgcolor: isUnread ? "action.hover" : "transparent",
                }}
              >
                <CardActionArea sx={{ p: 1.75 }} onClick={() => navigate("/app/reminders")}>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <VaccinesRoundedIcon fontSize="small" color={tone} sx={{ mt: 0.25 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {r.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {r.message}
                      </Typography>
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}

      <Box sx={{ height: 8 }} />
    </Box>
  );
};

export default OwnerHome;
