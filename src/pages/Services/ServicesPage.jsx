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
import { isVet } from "../../constants/domain";
import { formatPrice, fullName } from "../../utility/format";

const ServicesPage = () => {
  const { role } = useAuth();
  const vet = isVet(role);

  // Vets manage their own list; everyone else browses all vets' services.
  const query = useServices(vet ? { mine: true, limit: 100 } : { limit: 100 });
  const { create, update, remove } = useServiceMutations();
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
        title={vet ? "My Services" : "Services"}
        subtitle={
          vet
            ? "Add and price the services you offer. Pet owners can pick one when booking with you."
            : "Care services offered by our veterinarians."
        }
        action={
          vet && (
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

      <QueryState
        query={query}
        isEmpty={services.length === 0}
        emptyMessage={
          vet
            ? "You haven't added any services yet. Click “Add service” to create your first one."
            : "No services available yet."
        }
      >
        <Grid container spacing={3}>
          {services.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {s.name}
                    </Typography>
                    {vet && (
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
                  {!vet && s.vet?.user && (
                    <Typography variant="caption" color="text.secondary">
                      by {fullName(s.vet.user)}
                    </Typography>
                  )}
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
                    {!s.isActive && <Chip label="Inactive" size="small" />}
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
