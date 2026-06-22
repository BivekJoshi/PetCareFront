import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import ServiceFormDialog from "./ServiceFormDialog";
import { useServices, useServiceMutations } from "../../hooks/services/useServices";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../constants/domain";
import { formatPrice } from "../../utility/format";

const ServicesPage = () => {
  const query = useServices();
  const { create, update, remove } = useServiceMutations();
  const { role } = useAuth();
  const admin = isAdmin(role);
  const [dialog, setDialog] = useState({ open: false, service: null });

  const services = query.data?.items ?? [];

  const handleSubmit = (payload) => {
    const mutation = dialog.service ? update : create;
    const args = dialog.service ? { id: dialog.service.id, ...payload } : payload;
    mutation.mutate(args, { onSuccess: () => setDialog({ open: false, service: null }) });
  };

  const handleDelete = (service) => {
    if (window.confirm(`Delete "${service.name}"?`)) remove.mutate(service.id);
  };

  return (
    <Box>
      <PageHeader
        title="Services"
        subtitle="Care services offered at the clinic."
        action={
          admin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialog({ open: true, service: null })}
            >
              Add service
            </Button>
          )
        }
      />

      <QueryState query={query} isEmpty={services.length === 0} emptyMessage="No services available yet.">
        <Grid container spacing={3}>
          {services.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {s.name}
                    </Typography>
                    {admin && (
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setDialog({ open: true, service: s })}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(s)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1, minHeight: 40 }}>
                    {s.description || "—"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                    <Chip label={formatPrice(s.priceCents)} color="primary" />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={`${s.durationMin} min`}
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </QueryState>

      <ServiceFormDialog
        open={dialog.open}
        service={dialog.service}
        submitting={create.isLoading || update.isLoading}
        onClose={() => setDialog({ open: false, service: null })}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default ServicesPage;
