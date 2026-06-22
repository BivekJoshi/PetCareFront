import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PageHeader from "../../components/common/PageHeader";
import AddVaccinationDialog from "./AddVaccinationDialog";
import AddRecordDialog from "./AddRecordDialog";
import { usePetLookup } from "../../hooks/pets/usePetLookup";
import { useVaccinationMutations } from "../../hooks/vaccinations/useVaccinations";
import { useRecordMutations } from "../../hooks/records/useRecords";
import { humanize, VACCINATION_STATUS_COLORS } from "../../constants/domain";
import { formatDate, formatDateTime } from "../../utility/format";

const InfoRow = ({ icon: Icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Icon fontSize="small" sx={{ color: "text.secondary" }} />
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {value || "—"}
    </Typography>
  </Stack>
);

const SectionCard = ({ title, icon: Icon, action, children }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Icon fontSize="small" color="primary" />
          <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        </Stack>
        {action}
      </Stack>
      <Divider sx={{ mb: 1.5 }} />
      {children}
    </CardContent>
  </Card>
);

const VetConsolePage = () => {
  const [code, setCode] = useState("");
  const [pet, setPet] = useState(null);
  const [dialog, setDialog] = useState(null); // 'vaccine' | 'record' | null

  const lookup = usePetLookup({
    onSuccess: (data) => setPet(data),
    onError: () => setPet(null),
  });
  const { create: createVaccination } = useVaccinationMutations();
  const { create: createRecord } = useRecordMutations();

  const runLookup = (e) => {
    e?.preventDefault();
    const trimmed = code.trim();
    if (trimmed) lookup.mutate(trimmed.toUpperCase());
  };

  const refresh = () => pet && lookup.mutate(pet.code);

  const submitVaccination = (payload) =>
    createVaccination.mutate(
      { ...payload, petId: pet.id },
      { onSuccess: () => { setDialog(null); refresh(); } }
    );

  const submitRecord = (payload) =>
    createRecord.mutate(
      { ...payload, petId: pet.id },
      { onSuccess: () => { setDialog(null); refresh(); } }
    );

  const notFound = lookup.isError;

  return (
    <Box>
      <PageHeader
        title="Vet Console"
        subtitle="Scan or enter a pet's registration code to pull up its record before treating or prescribing."
      />

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
        <Box component="form" onSubmit={runLookup}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Pet registration code"
              placeholder="e.g. NP-PET-7F3K9Q"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCode2Icon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={lookup.isLoading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              disabled={lookup.isLoading || !code.trim()}
              sx={{ minWidth: 140 }}
            >
              Look up
            </Button>
          </Stack>
        </Box>
      </Paper>

      {notFound && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {lookup.error?.response?.data?.message || "No pet found for that code."}
        </Alert>
      )}

      {pet && (
        <Grid container spacing={3}>
          {/* Pet + owner identity */}
          <Grid item xs={12} md={4}>
            <SectionCard title="Patient" icon={PetsOutlinedIcon}>
              <Stack spacing={1.25}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {pet.name}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<QrCode2Icon />}
                    label={pet.code}
                    sx={{ mt: 0.5, fontWeight: 700, fontFamily: "monospace" }}
                  />
                </Box>
                <InfoRow icon={PetsOutlinedIcon} label="Species" value={humanize(pet.species)} />
                <InfoRow icon={PetsOutlinedIcon} label="Breed" value={pet.breed} />
                <InfoRow icon={PetsOutlinedIcon} label="Gender" value={humanize(pet.gender)} />
                <InfoRow icon={PetsOutlinedIcon} label="Born" value={formatDate(pet.birthDate)} />
                <InfoRow icon={PlaceOutlinedIcon} label="Area" value={pet.area?.name} />
                <Divider />
                <Typography variant="overline" color="text.secondary">
                  Owner
                </Typography>
                <InfoRow
                  icon={PersonOutlineIcon}
                  label="Name"
                  value={`${pet.owner?.firstName ?? ""} ${pet.owner?.lastName ?? ""}`.trim()}
                />
                <InfoRow icon={PersonOutlineIcon} label="Phone" value={pet.owner?.phone} />
                <InfoRow icon={PersonOutlineIcon} label="Email" value={pet.owner?.email} />
              </Stack>
            </SectionCard>
          </Grid>

          {/* Clinical history */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <SectionCard
                title="Vaccination history"
                icon={VaccinesOutlinedIcon}
                action={
                  <Button size="small" variant="contained" startIcon={<VaccinesOutlinedIcon />} onClick={() => setDialog("vaccine")}>
                    Record dose
                  </Button>
                }
              >
                {pet.vaccinations?.length ? (
                  <Stack spacing={1.5}>
                    {pet.vaccinations.map((v) => (
                      <Paper key={v.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {v.vaccineName}{" "}
                              <Typography component="span" variant="caption" color="text.secondary">
                                · dose {v.doseNumber}
                              </Typography>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Given {formatDate(v.administeredAt)} · Next due {formatDate(v.nextDueAt)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {v.isSubsidized && <Chip size="small" color="secondary" label="Subsidised" />}
                            <Chip size="small" color={VACCINATION_STATUS_COLORS[v.status] || "default"} label={humanize(v.status)} />
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No vaccinations recorded yet.
                  </Typography>
                )}
              </SectionCard>

              <SectionCard
                title="Medical records"
                icon={NoteAddOutlinedIcon}
                action={
                  <Button size="small" variant="contained" startIcon={<NoteAddOutlinedIcon />} onClick={() => setDialog("record")}>
                    Add record
                  </Button>
                }
              >
                {pet.records?.length ? (
                  <Stack spacing={1.5}>
                    {pet.records.map((r) => (
                      <Paper key={r.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip size="small" label={humanize(r.type)} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(r.createdAt)}
                            {r.vet?.user ? ` · Dr. ${r.vet.user.firstName} ${r.vet.user.lastName}` : ""}
                          </Typography>
                        </Stack>
                        {r.diagnosis && <Typography variant="body2" sx={{ mt: 1 }}><b>Diagnosis:</b> {r.diagnosis}</Typography>}
                        {r.treatment && <Typography variant="body2"><b>Treatment:</b> {r.treatment}</Typography>}
                        {r.medicine && <Typography variant="body2"><b>Medicine:</b> {r.medicine}</Typography>}
                        {r.diet && <Typography variant="body2"><b>Diet:</b> {r.diet}</Typography>}
                        {r.instructions && <Typography variant="body2" color="text.secondary"><b>Instructions:</b> {r.instructions}</Typography>}
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No medical records yet.
                  </Typography>
                )}
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      )}

      {!pet && !notFound && !lookup.isLoading && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <QrCode2Icon sx={{ fontSize: 64, opacity: 0.3 }} />
          <Typography sx={{ mt: 1 }}>Enter a pet code above to begin.</Typography>
        </Box>
      )}

      <AddVaccinationDialog
        open={dialog === "vaccine"}
        petName={pet?.name}
        submitting={createVaccination.isLoading}
        onClose={() => setDialog(null)}
        onSubmit={submitVaccination}
      />
      <AddRecordDialog
        open={dialog === "record"}
        petName={pet?.name}
        submitting={createRecord.isLoading}
        onClose={() => setDialog(null)}
        onSubmit={submitRecord}
      />
    </Box>
  );
};

export default VetConsolePage;
