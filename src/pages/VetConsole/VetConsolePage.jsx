import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import PageHeader from "../../components/common/PageHeader";
import AddVaccinationDialog from "./AddVaccinationDialog";
import AddRecordDialog from "./AddRecordDialog";
import { usePetLookup, useOwnerLookup } from "../../hooks/pets/usePetLookup";
import { useVaccinationMutations } from "../../hooks/vaccinations/useVaccinations";
import { useRecordMutations } from "../../hooks/records/useRecords";
import { humanize, STATUS_COLORS, VACCINATION_STATUS_COLORS } from "../../constants/domain";
import { formatDate, formatDateTime, fullName } from "../../utility/format";

// Owner codes start with this prefix; anything else is treated as a pet code.
const OWNER_PREFIX = "NP-OWN";

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

// A single appointment row inside a pet's history (owner view).
const AppointmentRow = ({ appt }) => {
  const vetName = appt.vet?.user
    ? `Dr. ${appt.vet.user.firstName} ${appt.vet.user.lastName}`
    : "Unassigned";
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{formatDateTime(appt.scheduledAt)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {vetName}
            {appt.service?.name ? ` · ${appt.service.name}` : ""}
          </Typography>
        </Box>
        <Chip size="small" label={humanize(appt.status)} color={STATUS_COLORS[appt.status] || "default"} />
      </Stack>
      {appt.reason && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Reason:</b> {appt.reason}
        </Typography>
      )}
      {appt.notes && (
        <Typography variant="body2" color="text.secondary">
          <b>Notes:</b> {appt.notes}
        </Typography>
      )}
    </Paper>
  );
};

// One pet as an expandable panel revealing its appointment history (owner view).
const PetPanel = ({ pet, defaultExpanded, onOpenClinical }) => {
  const appts = pet.appointments || [];
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      variant="outlined"
      disableGutters
      sx={{ borderRadius: 3, "&:before": { display: "none" }, overflow: "hidden" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, pr: 1 }} flexWrap="wrap">
          <Avatar src={pet.photoUrl} sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
            {pet.name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 120 }}>
            <Typography sx={{ fontWeight: 700 }}>{pet.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {humanize(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </Typography>
          </Box>
          <Chip size="small" icon={<QrCode2Icon />} label={pet.code} sx={{ fontWeight: 700, fontFamily: "monospace" }} />
          <Chip size="small" variant="outlined" label={`${appts.length} visit${appts.length === 1 ? "" : "s"}`} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 1.5 }} />
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
          <Button
            size="small"
            startIcon={<FolderSharedOutlinedIcon />}
            onClick={() => onOpenClinical(pet.code)}
          >
            Open clinical record
          </Button>
        </Stack>
        {appts.length ? (
          <Stack spacing={1.5}>
            {appts.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No appointment history for this pet yet.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const VetConsolePage = () => {
  const [code, setCode] = useState("");
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null); // { owner, pets } from an owner-code lookup
  const [mode, setMode] = useState(null); // 'pet' | 'owner' — which lookup last ran
  const [dialog, setDialog] = useState(null); // 'vaccine' | 'record' | null

  const petLookup = usePetLookup({
    onSuccess: (data) => {
      setPet(data);
      setOwner(null);
    },
    onError: () => setPet(null),
  });

  const ownerLookup = useOwnerLookup({
    onSuccess: (data) => {
      setOwner(data);
      setPet(null);
    },
    onError: () => setOwner(null),
  });

  const { create: createVaccination } = useVaccinationMutations();
  const { create: createRecord } = useRecordMutations();

  // Look up whatever code was entered — an owner code fans out to all their
  // pets + appointment history; anything else is treated as a pet code.
  const lookupCode = (raw) => {
    const trimmed = (raw ?? "").trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed.startsWith(OWNER_PREFIX)) {
      petLookup.reset();
      setPet(null);
      setMode("owner");
      ownerLookup.mutate(trimmed);
    } else {
      ownerLookup.reset();
      setOwner(null);
      setMode("pet");
      petLookup.mutate(trimmed);
    }
  };

  const runLookup = (e) => {
    e?.preventDefault();
    lookupCode(code);
  };

  // From an owner's pet, jump straight into that pet's clinical record.
  const openClinical = (petCode) => {
    setCode(petCode);
    lookupCode(petCode);
  };

  const refresh = () => pet && petLookup.mutate(pet.code);

  const submitVaccination = (payload) =>
    createVaccination.mutate(
      { ...payload, petId: pet.id },
      { onSuccess: () => { setDialog(null); refresh(); } },
    );

  const submitRecord = (payload) =>
    createRecord.mutate(
      { ...payload, petId: pet.id },
      { onSuccess: () => { setDialog(null); refresh(); } },
    );

  const activeLookup = mode === "owner" ? ownerLookup : petLookup;
  const isLoading = petLookup.isLoading || ownerLookup.isLoading;
  const notFound = activeLookup.isError;
  const nothingShown = !pet && !owner;
  const ownerPets = owner?.pets || [];

  return (
    <Box>
      <PageHeader
        title="Vet Console"
        subtitle="Enter a pet's registration code for its clinical record, or an owner's code to see all their pets and appointment history."
      />

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
        <Box component="form" onSubmit={runLookup}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Pet or owner code"
              placeholder="e.g. NP-PET-7F3K9Q or NP-OWN-7F3K9Q"
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
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              disabled={isLoading || !code.trim()}
              sx={{ minWidth: 140 }}
            >
              Look up
            </Button>
          </Stack>
        </Box>
      </Paper>

      {notFound && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {activeLookup.error?.response?.data?.message ||
            (mode === "owner" ? "No pet owner found for that code." : "No pet found for that code.")}
        </Alert>
      )}

      {/* ── Owner-code result: owner + all their pets + appointment history ── */}
      {owner && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar src={owner.owner.avatarUrl} sx={{ width: 48, height: 48 }}>
                    {owner.owner.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {fullName(owner.owner)}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<QrCode2Icon />}
                      label={owner.owner.ownerCode}
                      sx={{ mt: 0.5, fontWeight: 700, fontFamily: "monospace" }}
                    />
                  </Box>
                </Stack>
                <Divider sx={{ mb: 1.5 }} />
                <Stack spacing={1.25}>
                  <InfoRow icon={PersonOutlineIcon} label="Email" value={owner.owner.email} />
                  <InfoRow icon={PersonOutlineIcon} label="Phone" value={owner.owner.phone} />
                  <InfoRow icon={PlaceOutlinedIcon} label="Area" value={owner.owner.area?.name} />
                  <InfoRow icon={PetsOutlinedIcon} label="Pets" value={String(ownerPets.length)} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <EventOutlinedIcon fontSize="small" color="primary" />
              <Typography sx={{ fontWeight: 700 }}>Pets &amp; appointment history</Typography>
            </Stack>
            {ownerPets.length ? (
              <Stack spacing={1.5}>
                {ownerPets.map((p, i) => (
                  <PetPanel key={p.id} pet={p} defaultExpanded={i === 0} onOpenClinical={openClinical} />
                ))}
              </Stack>
            ) : (
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography color="text.secondary">This owner has no pets registered yet.</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {/* ── Pet-code result: single-pet clinical record (read + write) ── */}
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
                {pet.owner?.ownerCode && (
                  <Button
                    size="small"
                    sx={{ alignSelf: "flex-start", mt: 0.5 }}
                    startIcon={<FolderSharedOutlinedIcon />}
                    onClick={() => openClinical(pet.owner.ownerCode)}
                  >
                    View all pets for this owner
                  </Button>
                )}
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

      {nothingShown && !notFound && !isLoading && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <QrCode2Icon sx={{ fontSize: 64, opacity: 0.3 }} />
          <Typography sx={{ mt: 1 }}>Enter a pet or owner code above to begin.</Typography>
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
