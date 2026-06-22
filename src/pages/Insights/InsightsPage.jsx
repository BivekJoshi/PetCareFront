import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useOverview, useByArea } from "../../hooks/stats/useStats";
import { humanize } from "../../constants/domain";

const Metric = ({ icon: Icon, label, value, color = "primary", sub }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
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
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          {sub && (
            <Typography color="text.secondary" variant="caption">
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const coverageColor = (pct) => (pct >= 70 ? "success" : pct >= 40 ? "warning" : "error");

const InsightsPage = () => {
  const overview = useOverview();
  const byArea = useByArea({ level: "WARD" });

  const o = overview.data;
  const rows = byArea.data?.areas ?? [];
  const maxPets = Math.max(1, ...rows.map((r) => r.petCount));

  return (
    <Box>
      <PageHeader
        title="Government Insights"
        subtitle="Registry census and animal-health coverage for planning vaccination drives and subsidies."
      />

      <QueryState query={overview} isEmpty={false}>
        <Grid container spacing={2.5} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Metric icon={PetsOutlinedIcon} label="Registered pets" value={o?.totals.pets ?? "—"} sub={`${o?.totals.owners ?? 0} owners`} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Metric
              icon={VaccinesOutlinedIcon}
              color="success"
              label="Vaccination coverage"
              value={`${o?.vaccination.coverage ?? 0}%`}
              sub={`${o?.vaccination.vaccinatedPets ?? 0} pets vaccinated`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Metric
              icon={WarningAmberOutlinedIcon}
              color="warning"
              label="Overdue doses"
              value={o?.vaccination.overdue ?? 0}
              sub="need follow-up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Metric
              icon={VolunteerActivismOutlinedIcon}
              color="secondary"
              label="Subsidised doses"
              value={o?.vaccination.subsidized ?? 0}
              sub="government funded"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Per-area table */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Pets &amp; coverage by ward</Typography>
                <Typography variant="body2" color="text.secondary">
                  Where to focus the next campaign — most populous wards first.
                </Typography>
              </Box>
              <QueryState query={byArea} isEmpty={rows.length === 0} emptyMessage="No ward data yet.">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ward</TableCell>
                        <TableCell align="right">Pets</TableCell>
                        <TableCell sx={{ width: "35%" }}>Distribution</TableCell>
                        <TableCell align="right">Vaccine coverage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                          <TableCell align="right">{r.petCount}</TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={(r.petCount / maxPets) * 100}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip size="small" color={coverageColor(r.coverage)} label={`${r.coverage}%`} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </QueryState>
            </Paper>
          </Grid>

          {/* Species + infra */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Species mix</Typography>
                <Stack spacing={1.25}>
                  {(o?.species ?? []).map((s) => {
                    const total = o?.totals.pets || 1;
                    const pct = Math.round((s.count / total) * 100);
                    return (
                      <Box key={s.species}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">{humanize(s.species)}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {s.count} ({pct}%)
                          </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>
                    );
                  })}
                  {!o?.species?.length && (
                    <Typography variant="body2" color="text.secondary">
                      No pets registered yet.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Metric icon={LocalHospitalOutlinedIcon} color="info" label="Vets" value={o?.totals.vets ?? 0} />
                </Grid>
                <Grid item xs={6}>
                  <Metric icon={HowToRegOutlinedIcon} color="primary" label="Areas" value={o?.totals.areas ?? 0} />
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </QueryState>
    </Box>
  );
};

export default InsightsPage;
