import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/pets/usePets";
import { useAppointments } from "../../hooks/appointments/useAppointments";
import { useReminders } from "../../hooks/reminders/useReminders";
import { useOverview } from "../../hooks/stats/useStats";
import { isAdmin, isStaff } from "../../constants/domain";

const StatCard = ({ icon: Icon, label, value, to, color = "primary" }) => {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardActionArea onClick={() => navigate(to)} sx={{ p: 3, height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${color}.main`,
              color: `${color}.contrastText`,
            }}
          >
            <Icon />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography color="text.secondary">{label}</Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const DashboardHome = () => {
  const { user, role } = useAuth();
  const admin = isAdmin(role);
  const staff = isStaff(role);

  const pets = usePets({ limit: 1 });
  const appointments = useAppointments({ limit: 1 });
  const reminders = useReminders({ limit: 1 });
  const overview = useOverview({ enabled: admin });

  const count = (q) => q.data?.meta?.total ?? "—";
  const unread = reminders.data?.meta?.unread ?? 0;

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.firstName || "there"} 👋`}
        subtitle={
          admin
            ? "Registry overview and animal-health planning at a glance."
            : staff
            ? "Look up patients by code and keep their records up to date."
            : "Here's a quick overview of your pet care."
        }
      />
      <Grid container spacing={3}>
        {/* Government / admin */}
        {admin && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={InsightsOutlinedIcon}
                label="Registered pets"
                value={overview.data?.totals.pets ?? "—"}
                to="/app/insights"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={MedicalServicesOutlinedIcon}
                color="success"
                label="Vaccine coverage"
                value={overview.data ? `${overview.data.vaccination.coverage}%` : "—"}
                to="/app/insights"
              />
            </Grid>
          </>
        )}

        {/* Vet + admin */}
        {staff && (
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={QrCodeScannerOutlinedIcon}
              color="info"
              label="Look up a pet by code"
              value="Scan"
              to="/app/vet-console"
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={PetsOutlinedIcon} label="Pets" value={count(pets)} to="/app/pets" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={NotificationsActiveOutlinedIcon}
            color={unread > 0 ? "warning" : "primary"}
            label="Unread reminders"
            value={unread}
            to="/app/reminders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={EventOutlinedIcon}
            label="Appointments"
            value={count(appointments)}
            to="/app/appointments"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
