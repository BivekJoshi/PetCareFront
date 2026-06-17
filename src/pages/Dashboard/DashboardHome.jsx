import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/pets/usePets";
import { useAppointments } from "../../hooks/appointments/useAppointments";
import { useServices } from "../../hooks/services/useServices";

const StatCard = ({ icon: Icon, label, value, to }) => {
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
              bgcolor: "primary.main",
              color: "primary.contrastText",
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
  const { user } = useAuth();
  const pets = usePets({ limit: 1 });
  const appointments = useAppointments({ limit: 1 });
  const services = useServices({ limit: 1 });

  const count = (q) => q.data?.meta?.total ?? "—";

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.firstName || "there"} 👋`}
        subtitle="Here's a quick overview of your pet care."
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={PetsOutlinedIcon}
            label="Pets"
            value={count(pets)}
            to="/app/pets"
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
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={MedicalServicesOutlinedIcon}
            label="Services"
            value={count(services)}
            to="/app/services"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
