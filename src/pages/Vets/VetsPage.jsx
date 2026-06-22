import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useVets } from "../../hooks/vets/useVets";
import { fullName } from "../../utility/format";

const VetsPage = () => {
  const query = useVets();
  const vets = query.data?.items ?? [];

  return (
    <Box>
      <PageHeader title="Veterinarians" subtitle="Meet the vets available for your pets." />

      <QueryState query={query} isEmpty={vets.length === 0} emptyMessage="No veterinarians listed yet.">
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
                    {v.bio && (
                      <Typography color="text.secondary" sx={{ mt: 2 }}>
                        {v.bio}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Chip size="small" label={`${v.yearsExp ?? 0} yrs exp`} variant="outlined" />
                      <Chip
                        size="small"
                        label={v.isAvailable ? "Available" : "Unavailable"}
                        color={v.isAvailable ? "success" : "default"}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </QueryState>
    </Box>
  );
};

export default VetsPage;
