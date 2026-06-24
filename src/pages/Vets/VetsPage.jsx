import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Link,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import VetsMap from "../../components/common/map/VetsMap";
import { vetsWithLocation } from "../../components/common/map/leafletSetup";
import VetEditDialog from "./VetEditDialog";
import { useVets, useVetMutations } from "../../hooks/vets/useVets";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../constants/domain";
import { fullName } from "../../utility/format";

const VetsPage = () => {
  const { role } = useAuth();
  const admin = isAdmin(role);

  const query = useVets({ limit: 100 });
  const vets = query.data?.items ?? [];
  const located = vetsWithLocation(vets);

  const { create, update, remove } = useVetMutations();

  const [tab, setTab] = useState("map");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (vet) => {
    setEditing(vet);
    setDialogOpen(true);
  };

  const handleSubmit = (payload) => {
    const mutation = editing ? update : create;
    mutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleDelete = (vet) => {
    if (window.confirm(`Remove ${fullName(vet.user)}? This deletes their account.`)) {
      remove.mutate(vet.id);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Veterinarians"
        subtitle="Find and contact vets on the map, or browse the directory."
        action={
          admin ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Add Vet
            </Button>
          ) : null
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab value="map" label={`Map (${located.length})`} />
        <Tab value="list" label="Directory" />
      </Tabs>

      <QueryState
        query={query}
        isEmpty={vets.length === 0}
        emptyMessage="No veterinarians listed yet."
      >
        {tab === "map" ? (
          located.length ? (
            <VetsMap vets={vets} height={520} />
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  No vets have a location set yet
                  {admin ? " — add one or edit a vet to drop a pin." : "."}
                </Typography>
              </CardContent>
            </Card>
          )
        ) : (
          <Grid container spacing={3}>
            {vets.map((v) => {
              const name = fullName(v.user);
              const initials = name
                .split(" ")
                .map((w) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <Grid item xs={12} sm={6} md={4} key={v.id}>
                  <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                            {initials || "V"}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {name}
                            </Typography>
                            <Typography color="text.secondary">
                              {v.specialization || "General Practice"}
                            </Typography>
                          </Box>
                        </Stack>
                        {admin && (
                          <Stack direction="row">
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openEdit(v)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(v)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </Stack>

                      {v.bio && (
                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                          {v.bio}
                        </Typography>
                      )}

                      <Stack spacing={0.5} sx={{ mt: 2 }}>
                        {v.user?.phone && (
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <PhoneIcon sx={{ fontSize: 18 }} color="action" />
                            <Link href={`tel:${v.user.phone}`} variant="body2">
                              {v.user.phone}
                            </Link>
                          </Stack>
                        )}
                        {v.address && (
                          <Stack direction="row" spacing={0.75} alignItems="flex-start">
                            <PlaceIcon sx={{ fontSize: 18, mt: "2px" }} color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {v.address}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Chip size="small" label={`${v.yearsExp ?? 0} yrs exp`} variant="outlined" />
                        <Chip
                          size="small"
                          label={v.isAvailable ? "Available" : "Unavailable"}
                          color={v.isAvailable ? "success" : "default"}
                        />
                        {v.latitude != null && v.longitude != null && (
                          <Chip size="small" label="On map" color="info" variant="outlined" />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </QueryState>

      {admin && (
        <VetEditDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmit}
          submitting={create.isLoading || update.isLoading}
          vet={editing}
        />
      )}
    </Box>
  );
};

export default VetsPage;
