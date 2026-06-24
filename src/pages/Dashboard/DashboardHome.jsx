 
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/pets/usePets";
import {
  useAppointments,
  useAppointmentMutations,
} from "../../hooks/appointments/useAppointments";
import {
  useReminders,
  useReminderMutations,
} from "../../hooks/reminders/useReminders";
import { useOverview, useByArea } from "../../hooks/stats/useStats";
import {
  isAdmin,
  isStaff,
  isVet,
  humanize,
  STATUS_COLORS,
  REMINDER_TYPE_COLORS,
} from "../../constants/domain";
import { formatDateTime, fullName } from "../../utility/format";

/* -------------------------------------------------------------------------- */
/*  Small presentation helpers (kept local so this lives in a single file)    */
/* -------------------------------------------------------------------------- */

const SPECIES_EMOJI = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🐦",
  RABBIT: "🐰",
  REPTILE: "🦎",
  FISH: "🐠",
  CATTLE: "🐄",
  GOAT: "🐐",
  OTHER: "🐾",
};

/* -------------------------------------------------------------------------- */
/*  Demo / sample data — used as a fallback when the API returns nothing so    */
/*  the dashboard still looks alive during development & demos.                */
/* -------------------------------------------------------------------------- */

const DEMO_PETS = [
  { id: null, name: "Bella", species: "DOG", breed: "Labrador", code: "PET-1024" },
  { id: null, name: "Milo", species: "CAT", breed: "Persian", code: "PET-1025" },
  { id: null, name: "Coco", species: "BIRD", breed: "Cockatiel", code: "PET-1026" },
  { id: null, name: "Rex", species: "DOG", breed: "Beagle", code: "PET-1027" },
  { id: null, name: "Nemo", species: "FISH", breed: "Goldfish", code: "PET-1028" },
  { id: null, name: "Daisy", species: "RABBIT", breed: "Holland Lop", code: "PET-1029" },
];

const DEMO_REMINDERS = [
  {
    id: null,
    type: "VACCINE",
    title: "Rabies booster due",
    message: "Bella's annual rabies vaccine is due next week.",
    isRead: false,
  },
  {
    id: null,
    type: "CHECKUP",
    title: "Wellness check",
    message: "Schedule Milo's routine wellness check-up.",
    isRead: false,
  },
  {
    id: null,
    type: "DEWORMING",
    title: "Deworming reminder",
    message: "Rex is due for quarterly deworming.",
    isRead: true,
  },
  {
    id: null,
    type: "CARE_TIP",
    title: "Summer hydration",
    message: "Keep fresh water available — temperatures are rising.",
    isRead: true,
  },
];

const DEMO_SPECIES = [
  { name: "Dog", value: 96 },
  { name: "Cat", value: 71 },
  { name: "Bird", value: 28 },
  { name: "Rabbit", value: 19 },
  { name: "Fish", value: 14 },
  { name: "Goat", value: 9 },
  { name: "Other", value: 11 },
];

const DEMO_STATUS = [
  { name: "Pending", value: 8 },
  { name: "Confirmed", value: 14 },
  { name: "Completed", value: 31 },
  { name: "Cancelled", value: 5 },
];

const DEMO_TREND = [
  { label: "Jun 10", value: 3 },
  { label: "Jun 11", value: 5 },
  { label: "Jun 12", value: 4 },
  { label: "Jun 13", value: 7 },
  { label: "Jun 14", value: 6 },
  { label: "Jun 15", value: 9 },
  { label: "Jun 16", value: 5 },
  { label: "Jun 17", value: 8 },
  { label: "Jun 18", value: 11 },
  { label: "Jun 19", value: 7 },
];

const DEMO_AREAS = [
  { name: "Ward 4", coverage: 88, pets: 64 },
  { name: "Ward 1", coverage: 74, pets: 52 },
  { name: "Ward 9", coverage: 81, pets: 47 },
  { name: "Ward 2", coverage: 63, pets: 39 },
  { name: "Ward 7", coverage: 69, pets: 33 },
  { name: "Ward 5", coverage: 92, pets: 28 },
  { name: "Ward 3", coverage: 57, pets: 21 },
];

const DEMO_TOTALS = { pets: 248, owners: 173, vets: 12, areas: 36 };
const DEMO_VACCINATION = {
  coverage: 78,
  vaccinatedPets: 193,
  overdue: 21,
  subsidized: 64,
};

// Built at render time so the dates stay relative to "now".
const makeDemoUpcoming = () => {
  const at = (days, hour) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  return [

  ];
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const MotionDiv = motion.div;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Hero banner                                                               */
/* -------------------------------------------------------------------------- */

const HeroBanner = ({ name, role, petCount, upcoming, unread }) => {
  const theme = useTheme();
  const gradient = `linear-gradient(125deg, ${theme.palette.primary.main} 0%, ${alpha(
    theme.palette.primary.main,
    0.85
  )} 40%, ${theme.palette.primary.alt} 120%)`;

  const pills = [
    { icon: PetsOutlinedIcon, label: "Pets", value: petCount },
    { icon: EventOutlinedIcon, label: "Upcoming", value: upcoming },
    { icon: NotificationsActiveOutlinedIcon, label: "Unread", value: unread },
  ];

  return (
    <MotionDiv variants={fadeUp} initial="hidden" animate="show">
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 1.5,
          color: "#fff",
          background: gradient,
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4.5 },
          mb: 3,
          boxShadow: "0 24px 48px -24px rgba(48, 111, 107, 0.65)",
        }}
      >
        {/* decorative blobs */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -90,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: alpha("#ffffff", 0.12),
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: -120,
            right: 120,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: alpha("#ffffff", 0.08),
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            fontSize: 220,
            opacity: 0.08,
            right: 24,
            bottom: -40,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          🐾
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ opacity: 0.9, mb: 1 }}
        >
          <WbSunnyOutlinedIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {todayLabel()}
          </Typography>
          <Chip
            size="small"
            label={humanize(role || "Member")}
            sx={{
              ml: 0.5,
              color: "#fff",
              fontWeight: 700,
              bgcolor: alpha("#ffffff", 0.2),
            }}
          />
        </Stack>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}
        >
          {greeting()}, {name} 👋
        </Typography>
        <Typography sx={{ maxWidth: 560, opacity: 0.92 }}>
          Here&apos;s what&apos;s happening across your pet care today. Stay on
          top of appointments, reminders and animal-health records.
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 1.5, md: 3 }}
          sx={{ mt: 3, flexWrap: "wrap", rowGap: 1.5 }}
        >
          {pills.map((p) => (
            <Stack
              key={p.label}
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: alpha("#ffffff", 0.16),
                backdropFilter: "blur(6px)",
              }}
            >
              <p.icon fontSize="small" />
              <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {p.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {p.label}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>
    </MotionDiv>
  );
};

/* -------------------------------------------------------------------------- */
/*  Stat card                                                                 */
/* -------------------------------------------------------------------------- */

const StatCard = ({
  icon: Icon,
  label,
  value,
  to,
  color = "primary",
  hint,
  index = 0,
  loading = false,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const tone =
    theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <MotionDiv
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      style={{ height: "100%" }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: 1,
          height: "100%",
          transition: "transform .25s ease, box-shadow .25s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 18px 32px -20px ${alpha(tone, 0.8)}`,
            borderColor: alpha(tone, 0.5),
          },
        }}
      >
        <CardActionArea
          onClick={() => to && navigate(to)}
          sx={{ p: 2.5, height: "100%" }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                color: tone,
                bgcolor: alpha(tone, 0.14),
              }}
            >
              <Icon />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              {loading ? (
                <CircularProgress size={22} sx={{ color: tone, my: 0.5 }} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, lineHeight: 1.05 }}
                >
                  {value}
                </Typography>
              )}
              <Typography color="text.secondary" noWrap>
                {label}
              </Typography>
              {hint && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ mt: 0.5, color: tone }}
                >
                  <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {hint}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </CardActionArea>
      </Card>
    </MotionDiv>
  );
};

/* -------------------------------------------------------------------------- */
/*  Section wrapper card                                                      */
/* -------------------------------------------------------------------------- */

const SectionCard = ({ title, subtitle, action, children, index = 0 }) => (
  <MotionDiv
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={index}
    style={{ height: "100%" }}
  >
    <Card
      variant="outlined"
      sx={{ borderRadius: 1, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Divider />
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Card>
  </MotionDiv>
);

const EmptyState = ({ icon: Icon, text }) => (
  <Stack alignItems="center" justifyContent="center" sx={{ py: 5, px: 3 }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: "action.hover",
        color: "text.disabled",
        mb: 1.5,
      }}
    >
      <Icon />
    </Box>
    <Typography color="text.secondary" align="center">
      {text}
    </Typography>
  </Stack>
);

/* -------------------------------------------------------------------------- */
/*  Quick actions                                                             */
/* -------------------------------------------------------------------------- */

const QuickActions = ({ items, index = 0 }) => (
  <MotionDiv variants={fadeUp} initial="hidden" animate="show" custom={index}>
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ flexWrap: "wrap", rowGap: 1.5, mb: 3 }}
    >
      {items.map((a) => (
        <Button
          key={a.label}
          variant={a.primary ? "contained" : "outlined"}
          startIcon={<a.icon />}
          onClick={a.onClick}
        >
          {a.label}
        </Button>
      ))}
    </Stack>
  </MotionDiv>
);

/* -------------------------------------------------------------------------- */
/*  Charts (recharts)                                                         */
/* -------------------------------------------------------------------------- */

// Build a categorical palette from the MUI theme so charts stay on-brand.
const useChartPalette = () => {
  const theme = useTheme();
  return useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.secondary?.main || theme.palette.primary.alt,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.primary.alt,
      theme.palette.primary.dark || theme.palette.primary.main,
      theme.palette.text.secondary,
    ],
    [theme]
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1.5,
        py: 1,
        boxShadow: 3,
      }}
    >
      {label != null && (
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
      )}
      {payload.map((p) => (
        <Stack
          key={p.dataKey ?? p.name}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "2px",
              bgcolor: p.color || p.payload?.fill || theme.palette.primary.main,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {p.name}:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {p.value}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

const ChartCard = ({ title, subtitle, icon: Icon, height = 260, index = 0, children, empty }) => (
  <MotionDiv
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={index}
    style={{ height: "100%" }}
  >
    <Card
      variant="outlined"
      sx={{ borderRadius: 1, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
        {Icon && (
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1,
              display: "grid",
              placeItems: "center",
              color: "primary.main",
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
            }}
          >
            <Icon fontSize="small" />
          </Box>
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ flex: 1, p: 2, minHeight: height }}>
        {empty ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: height - 16 }}>
            <Typography variant="body2" color="text.secondary">
              {empty}
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ width: "100%", height: height - 16 }}>{children}</Box>
        )}
      </Box>
    </Card>
  </MotionDiv>
);

// Donut: distribution of pets by species.
const SpeciesDonut = ({ data, palette }) => {
  const theme = useTheme();
  return (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius="55%"
        outerRadius="82%"
        paddingAngle={2}
        stroke="none"
      >
        {data.map((entry, i) => (
          <Cell key={entry.name} fill={palette[i % palette.length]} />
        ))}
      </Pie>
      <RTooltip content={<ChartTooltip />} />
      <Legend
        verticalAlign="bottom"
        height={28}
        iconType="circle"
        formatter={(v) => (
          <span style={{ fontSize: 12, color: theme.palette.text.secondary }}>
            {v}
          </span>
        )}
      />
    </PieChart>
  </ResponsiveContainer>
  );
};

// Vertical bars: appointments grouped by status.
const StatusBars = ({ data, palette }) => {
  const theme = useTheme();
  const tick = { fontSize: 11, fill: theme.palette.text.secondary };
  return (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
      <XAxis dataKey="name" tick={tick} tickLine={false} axisLine={false} />
      <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} />
      <RTooltip content={<ChartTooltip />} cursor={{ opacity: 0.08 }} />
      <Bar dataKey="value" name="Appointments" radius={[6, 6, 0, 0]} maxBarSize={48}>
        {data.map((entry, i) => (
          <Cell key={entry.name} fill={palette[i % palette.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
  );
};

// Area chart: appointments per day over time.
const TrendArea = ({ data, color }) => {
  const theme = useTheme();
  const tick = { fontSize: 11, fill: theme.palette.text.secondary };
  return (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="apptTrend" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
      <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} />
      <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} />
      <RTooltip content={<ChartTooltip />} />
      <Area
        type="monotone"
        dataKey="value"
        name="Appointments"
        stroke={color}
        strokeWidth={2.5}
        fill="url(#apptTrend)"
      />
    </AreaChart>
  </ResponsiveContainer>
  );
};

// Radial gauge: vaccine coverage percentage.
const CoverageGauge = ({ value, color }) => {
  const data = [{ name: "Coverage", value: Math.min(100, Number(value) || 0) }];
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="68%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={20} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {Math.round(Number(value) || 0)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vaccinated
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Horizontal bars: vaccine coverage by ward/area.
const AreaCoverageBars = ({ data, color }) => {
  const theme = useTheme();
  const tick = { fontSize: 11, fill: theme.palette.text.secondary };
  return (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
      <XAxis type="number" domain={[0, 100]} tick={tick} tickLine={false} axisLine={false} unit="%" />
      <YAxis
        type="category"
        dataKey="name"
        width={90}
        tick={tick}
        tickLine={false}
        axisLine={false}
      />
      <RTooltip content={<ChartTooltip />} cursor={{ opacity: 0.08 }} />
      <Bar dataKey="coverage" name="Coverage" fill={color} radius={[0, 6, 6, 0]} maxBarSize={22} />
    </BarChart>
  </ResponsiveContainer>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main dashboard                                                            */
/* -------------------------------------------------------------------------- */

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const admin = isAdmin(role);
  const staff = isStaff(role);
  const vet = isVet(role);

  const chartPalette = useChartPalette();
  const theme = useTheme();

  // Data
  const petsQ = usePets({ limit: 6 });
  const allPetsQ = usePets({ limit: 100 });
  const apptCountQ = useAppointments({ limit: 1 });
  const allApptsQ = useAppointments({ limit: 100 });
  const upcomingQ = useAppointments({
    limit: 5,
    status: "CONFIRMED",
    sort: "scheduledAt",
  });
  const remindersQ = useReminders({ limit: 5 });
  const overviewQ = useOverview({ enabled: admin });
  const byAreaQ = useByArea({ level: "WARD" }, { enabled: admin });

  const { updateStatus } = useAppointmentMutations();
  const { markRead, dismiss } = useReminderMutations();

  const realPets = petsQ.data?.items ?? [];
  const realUpcoming = upcomingQ.data?.items ?? [];
  const realReminders = remindersQ.data?.items ?? [];
  const realAppts = allApptsQ.data?.items ?? [];

  // Fall back to sample data only when the API is genuinely empty (and done
  // loading) — so a real, populated account never sees dummy content.
  const anyLoading =
    petsQ.isLoading ||
    upcomingQ.isLoading ||
    remindersQ.isLoading ||
    allApptsQ.isLoading;
  const hasRealData =
    realPets.length > 0 ||
    realUpcoming.length > 0 ||
    realReminders.length > 0 ||
    realAppts.length > 0;
  const isDemo = !anyLoading && !hasRealData;

  const demoUpcoming = useMemo(() => makeDemoUpcoming(), []);

  const pets = isDemo ? DEMO_PETS : realPets;
  const upcoming = isDemo ? demoUpcoming : realUpcoming;
  const reminders = isDemo ? DEMO_REMINDERS : realReminders;

  const overview = overviewQ.data;
  const totals = isDemo ? DEMO_TOTALS : overview?.totals;
  const vac = isDemo ? DEMO_VACCINATION : overview?.vaccination;

  const petTotal = isDemo
    ? DEMO_TOTALS.pets
    : petsQ.data?.meta?.total ?? realPets.length;
  const apptTotal = isDemo
    ? DEMO_STATUS.reduce((s, d) => s + d.value, 0)
    : apptCountQ.data?.meta?.total ?? "—";
  const unread = isDemo
    ? DEMO_REMINDERS.filter((r) => !r.isRead).length
    : remindersQ.data?.meta?.unread ?? 0;

  const coverage = vac?.coverage ?? 0;

  /* ----------------------------- chart data ----------------------------- */

  // Species distribution: prefer the admin overview, else derive from pets.
  const speciesData = useMemo(() => {
    if (isDemo) return DEMO_SPECIES;
    if (overview?.species?.length) {
      return overview.species.map((s) => ({
        name: humanize(s.species),
        value: s.count,
      }));
    }
    const counts = {};
    (allPetsQ.data?.items ?? []).forEach((p) => {
      const key = p.species || "OTHER";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ name: humanize(k), value: v }))
      .sort((a, b) => b.value - a.value);
  }, [isDemo, overview, allPetsQ.data]);

  const allAppts = useMemo(
    () => allApptsQ.data?.items ?? [],
    [allApptsQ.data]
  );

  // Appointments grouped by status (all 4 statuses, zero-filled).
  const statusData = useMemo(() => {
    if (isDemo) return DEMO_STATUS;
    const counts = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    allAppts.forEach((a) => {
      if (a.status in counts) counts[a.status] += 1;
    });
    return Object.entries(counts).map(([k, v]) => ({
      name: humanize(k),
      value: v,
    }));
  }, [isDemo, allAppts]);

  // Appointments per day (last ~10 active days), oldest → newest.
  const trendData = useMemo(() => {
    if (isDemo) return DEMO_TREND;
    const byDay = new Map();
    allAppts.forEach((a) => {
      if (!a.scheduledAt) return;
      const d = new Date(a.scheduledAt);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + 1);
    });
    return [...byDay.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-10)
      .map(([k, v]) => ({
        label: new Date(k).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        value: v,
      }));
  }, [isDemo, allAppts]);

  // Top wards by pet count, for the admin coverage chart.
  const areaData = useMemo(() => {
    const rows = byAreaQ.data?.areas ?? [];
    if (isDemo && rows.length === 0) return DEMO_AREAS;
    return rows
      .slice()
      .sort((a, b) => b.petCount - a.petCount)
      .slice(0, 7)
      .map((r) => ({ name: r.name, coverage: r.coverage, pets: r.petCount }));
  }, [isDemo, byAreaQ.data]);

  const quickActions = useMemo(() => {
    const base = [
      {
        label: "Add a pet",
        icon: AddCircleOutlineIcon,
        primary: true,
        onClick: () => navigate("/app/pets"),
      },
      {
        label: "Book appointment",
        icon: CalendarMonthOutlinedIcon,
        onClick: () => navigate("/app/appointments"),
      },
      {
        label: "Reminders",
        icon: NotificationsActiveOutlinedIcon,
        onClick: () => navigate("/app/reminders"),
      },
    ];
    if (vet || admin)
      base.push({
        label: "Look up by code",
        icon: QrCodeScannerOutlinedIcon,
        onClick: () => navigate("/app/vet-console"),
      });
    if (admin)
      base.push({
        label: "Insights",
        icon: InsightsOutlinedIcon,
        onClick: () => navigate("/app/insights"),
      });
    return base;
  }, [navigate, vet, admin]);

  return (
    <Box>
      <HeroBanner
        name={user?.firstName || "there"}
        role={role}
        petCount={petTotal}
        upcoming={upcoming.length}
        unread={unread}
      />

      <QuickActions items={quickActions} index={1} />

      {/* ------------------------------- Stats ------------------------------ */}
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        {admin && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={InsightsOutlinedIcon}
                label="Registered pets"
                value={totals?.pets ?? "—"}
                hint={`${totals?.owners ?? 0} owners`}
                to="/app/insights"
                loading={overviewQ.isLoading && !isDemo}
                index={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={MedicalServicesOutlinedIcon}
                color="success"
                label="Vaccine coverage"
                value={overview || isDemo ? `${coverage}%` : "—"}
                hint={`${vac?.vaccinatedPets ?? 0} vaccinated`}
                to="/app/insights"
                loading={overviewQ.isLoading && !isDemo}
                index={1}
              />
            </Grid>
          </>
        )}

        {staff && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={QrCodeScannerOutlinedIcon}
              color="info"
              label="Pet lookup by code"
              value="Scan"
              to="/app/vet-console"
              index={2}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PetsOutlinedIcon}
            label="My pets"
            value={petTotal}
            to="/app/pets"
            loading={petsQ.isLoading}
            index={3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={NotificationsActiveOutlinedIcon}
            color={unread > 0 ? "warning" : "primary"}
            label="Unread reminders"
            value={unread}
            to="/app/reminders"
            loading={remindersQ.isLoading}
            index={4}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={EventOutlinedIcon}
            color="info"
            label="Appointments"
            value={apptTotal}
            to="/app/appointments"
            loading={apptCountQ.isLoading}
            index={5}
          />
        </Grid>
      </Grid>

      {/* ----------------------------- Analytics ---------------------------- */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 4, mb: 2 }}>
        <BarChartRoundedIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Analytics
        </Typography>
        <Chip
          size="small"
          label={isDemo ? "Sample data" : "Live"}
          color={isDemo ? "warning" : "success"}
          sx={{ ml: 0.5 }}
        />
      </Stack>

      <Grid container spacing={2.5}>
        {/* Species donut */}
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Pets by species"
            subtitle="Distribution of registered animals"
            icon={DonutLargeRoundedIcon}
            index={0}
            empty={
              (allPetsQ.isLoading || overviewQ.isLoading) && !speciesData.length
                ? "Loading…"
                : !speciesData.length
                ? "No pets to chart yet."
                : null
            }
          >
            <SpeciesDonut data={speciesData} palette={chartPalette} />
          </ChartCard>
        </Grid>

        {/* Appointment status bars */}
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Appointments by status"
            subtitle="Across recent bookings"
            icon={BarChartRoundedIcon}
            index={1}
            empty={
              allApptsQ.isLoading
                ? "Loading…"
                : !allAppts.length
                ? "No appointments yet."
                : null
            }
          >
            <StatusBars data={statusData} palette={chartPalette} />
          </ChartCard>
        </Grid>

        {/* Coverage gauge (admin) or appointment trend (everyone else) */}
        <Grid item xs={12} md={4}>
          {admin ? (
            <ChartCard
              title="Vaccine coverage"
              subtitle="Registry-wide"
              icon={DonutLargeRoundedIcon}
              index={2}
              empty={overviewQ.isLoading && !isDemo ? "Loading…" : null}
            >
              <CoverageGauge value={coverage} color={theme.palette.success.main} />
            </ChartCard>
          ) : (
            <ChartCard
              title="Appointment trend"
              subtitle="Bookings per day"
              icon={ShowChartRoundedIcon}
              index={2}
              empty={
                allApptsQ.isLoading
                  ? "Loading…"
                  : trendData.length < 2
                  ? "Not enough data to chart yet."
                  : null
              }
            >
              <TrendArea data={trendData} color={theme.palette.primary.main} />
            </ChartCard>
          )}
        </Grid>

        {/* Admin-only: appointment trend (full width) + coverage by ward */}
        {admin && (
          <>
            <Grid item xs={12} md={7}>
              <ChartCard
                title="Appointment trend"
                subtitle="Bookings per day"
                icon={ShowChartRoundedIcon}
                index={3}
                empty={
                  allApptsQ.isLoading
                    ? "Loading…"
                    : trendData.length < 2
                    ? "Not enough data to chart yet."
                    : null
                }
              >
                <TrendArea data={trendData} color={theme.palette.primary.main} />
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={5}>
              <ChartCard
                title="Vaccine coverage by ward"
                subtitle="Top wards by pet population"
                icon={MapOutlinedIcon}
                index={4}
                empty={
                  byAreaQ.isLoading
                    ? "Loading…"
                    : !areaData.length
                    ? "No ward data yet."
                    : null
                }
              >
                <AreaCoverageBars data={areaData} color={theme.palette.info.main} />
              </ChartCard>
            </Grid>
          </>
        )}
      </Grid>

      {/* --------------------------- Main columns --------------------------- */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {/* Upcoming appointments */}
        <Grid item xs={12} md={7}>
          <SectionCard
            title="Upcoming appointments"
            subtitle="Confirmed visits coming up"
            index={0}
            action={
              <Button
                size="small"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/app/appointments")}
              >
                View all
              </Button>
            }
          >
            {upcomingQ.isLoading ? (
              <Box sx={{ p: 4, display: "grid", placeItems: "center" }}>
                <CircularProgress size={26} />
              </Box>
            ) : upcoming.length === 0 ? (
              <EmptyState
                icon={EventOutlinedIcon}
                text="No upcoming appointments. Book one to get started."
              />
            ) : (
              <List disablePadding>
                {upcoming.map((a, i) => (
                  <React.Fragment key={a.id ?? i}>
                    <ListItem
                      sx={{ px: 2.5, py: 1.5 }}
                      secondaryAction={
                        a.id && ["PENDING", "CONFIRMED"].includes(a.status) ? (
                          <Tooltip title="Mark completed">
                            <span>
                              <IconButton
                                edge="end"
                                color="success"
                                disabled={updateStatus.isLoading}
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: a.id,
                                    status: "COMPLETED",
                                  })
                                }
                              >
                                <CheckRoundedIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "primary.backgroundCard",
                            fontSize: 22,
                          }}
                        >
                          {SPECIES_EMOJI[a.pet?.species] || "🐾"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ flexWrap: "wrap" }}
                          >
                            <Typography sx={{ fontWeight: 700 }}>
                              {a.pet?.name || "Pet"}
                            </Typography>
                            <Chip
                              size="small"
                              label={humanize(a.status)}
                              color={STATUS_COLORS[a.status] || "default"}
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{ mt: 0.25, color: "text.secondary" }}
                          >
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />
                              <Typography variant="caption">
                                {formatDateTime(a.scheduledAt)}
                              </Typography>
                            </Stack>
                            <Typography variant="caption">
                              {a.service?.name ||
                                (a.vet ? fullName(a.vet.user) : "General visit")}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {i < upcoming.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </SectionCard>
        </Grid>

        {/* Reminders */}
        <Grid item xs={12} md={5}>
          <SectionCard
            title="Reminders"
            subtitle={unread > 0 ? `${unread} unread` : "You're all caught up"}
            index={1}
            action={
              <Button
                size="small"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/app/reminders")}
              >
                All
              </Button>
            }
          >
            {remindersQ.isLoading ? (
              <Box sx={{ p: 4, display: "grid", placeItems: "center" }}>
                <CircularProgress size={26} />
              </Box>
            ) : reminders.length === 0 ? (
              <EmptyState
                icon={NotificationsActiveOutlinedIcon}
                text="No reminders right now."
              />
            ) : (
              <List disablePadding>
                {reminders.map((r, i) => {
                  const tone = REMINDER_TYPE_COLORS[r.type] || "primary";
                  const isUnread = !(r.isRead ?? r.read);
                  return (
                    <ListItem
                      key={r.id ?? i}
                      alignItems="flex-start"
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        borderLeft: 4,
                        borderColor: `${tone}.main`,
                        bgcolor: isUnread ? "action.hover" : "transparent",
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={0.5}>
                          {isUnread && r.id && (
                            <Tooltip title="Mark read">
                              <IconButton
                                size="small"
                                onClick={() => markRead.mutate(r.id)}
                              >
                                <CheckRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {r.id && (
                            <Tooltip title="Dismiss">
                              <IconButton
                                size="small"
                                onClick={() => dismiss.mutate(r.id)}
                              >
                                <CloseRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ flexWrap: "wrap", pr: 6 }}
                          >
                            <Chip
                              size="small"
                              color={tone}
                              label={humanize(r.type || "GENERAL")}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              {r.title}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, pr: 6 }}
                          >
                            {r.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </SectionCard>
        </Grid>

        {/* My pets */}
        <Grid item xs={12} md={admin ? 7 : 12}>
          <SectionCard
            title="My pets"
            subtitle="Quick access to your animals"
            index={2}
            action={
              <Button
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate("/app/pets")}
              >
                Manage
              </Button>
            }
          >
            {petsQ.isLoading ? (
              <Box sx={{ p: 4, display: "grid", placeItems: "center" }}>
                <CircularProgress size={26} />
              </Box>
            ) : pets.length === 0 ? (
              <EmptyState
                icon={PetsOutlinedIcon}
                text="No pets registered yet. Add your first companion!"
              />
            ) : (
              <Grid container spacing={1.5} sx={{ p: 2.5 }}>
                {pets.map((pet) => (
                  <Grid item xs={12} sm={6} key={pet.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 1,
                        transition: "transform .2s ease, box-shadow .2s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardActionArea
                        sx={{ p: 1.75 }}
                        onClick={() => navigate("/app/pets")}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              fontSize: 26,
                              bgcolor: "primary.backgroundCard",
                            }}
                          >
                            {SPECIES_EMOJI[pet.species] || "🐾"}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontWeight: 700 }} noWrap>
                              {pet.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {humanize(pet.species)}
                              {pet.breed ? ` · ${pet.breed}` : ""}
                            </Typography>
                          </Box>
                          {pet.code && (
                            <Chip
                              size="small"
                              label={pet.code}
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </SectionCard>
        </Grid>

        {/* Admin: animal-health overview */}
        {admin && (
          <Grid item xs={12} md={5}>
            <SectionCard
              title="Animal-health overview"
              subtitle="Registry-wide snapshot"
              index={3}
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate("/app/insights")}
                >
                  Insights
                </Button>
              }
            >
              <Box sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VaccinesOutlinedIcon color="success" />
                    <Typography sx={{ fontWeight: 700 }}>
                      Vaccine coverage
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontWeight: 800 }}>{coverage}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Number(coverage) || 0)}
                  color="success"
                  sx={{ height: 10, borderRadius: 5, mb: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {vac?.overdue ?? 0} overdue ·{" "}
                  {vac?.subsidized ?? 0} subsidized
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1.5}>
                  {[
                    {
                      icon: PetsOutlinedIcon,
                      label: "Pets",
                      value: totals?.pets ?? 0,
                    },
                    {
                      icon: GroupsOutlinedIcon,
                      label: "Owners",
                      value: totals?.owners ?? 0,
                    },
                    {
                      icon: LocalHospitalOutlinedIcon,
                      label: "Vets",
                      value: totals?.vets ?? 0,
                    },
                    {
                      icon: HowToRegOutlinedIcon,
                      label: "Areas",
                      value: totals?.areas ?? 0,
                    },
                  ].map((m) => (
                    <Grid item xs={6} key={m.label}>
                      <Stack
                        direction="row"
                        spacing={1.25}
                        alignItems="center"
                        sx={{
                          p: 1.25,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                        }}
                      >
                        <m.icon fontSize="small" color="primary" />
                        <Box>
                          <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>
                            {m.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {m.label}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </SectionCard>
          </Grid>
        )}
      </Grid>

      {/* Footer flourish */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4, opacity: 0.6 }}
      >
        <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 26, height: 26, fontSize: 14 } }}>
          {pets.slice(0, 4).map((p) => (
            <Avatar key={p.id} sx={{ bgcolor: "primary.backgroundCard", fontSize: 14 }}>
              {SPECIES_EMOJI[p.species] || "🐾"}
            </Avatar>
          ))}
        </AvatarGroup>
        <Typography variant="caption" color="text.secondary">
          Caring for {petTotal} {petTotal === 1 ? "companion" : "companions"} ·
          PetCare
        </Typography>
      </Stack>
    </Box>
  );
};

export default DashboardHome;
