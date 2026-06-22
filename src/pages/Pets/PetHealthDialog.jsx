import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import QueryState from "../../components/common/QueryState";
import { useVaccinations } from "../../hooks/vaccinations/useVaccinations";
import { humanize, VACCINATION_STATUS_COLORS } from "../../constants/domain";
import { formatDate } from "../../utility/format";

const PetHealthDialog = ({ open, onClose, pet }) => {
  const query = useVaccinations({ petId: pet?.id }, { enabled: open && Boolean(pet?.id) });
  const items = query.data?.items ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <span>{pet?.name} — health record</span>
          {pet?.code && (
            <Chip size="small" icon={<QrCode2Icon />} label={pet.code} sx={{ fontFamily: "monospace", fontWeight: 700 }} />
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <VaccinesOutlinedIcon fontSize="small" color="primary" />
          <Typography sx={{ fontWeight: 700 }}>Vaccinations</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <QueryState query={query} isEmpty={items.length === 0} emptyMessage="No vaccinations recorded yet. A vet will add these during a visit.">
          <Stack spacing={1.5}>
            {items.map((v) => (
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
        </QueryState>
      </DialogContent>
    </Dialog>
  );
};

export default PetHealthDialog;
