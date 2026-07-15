import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useAdminBusinesses, useModerateBusiness } from "../../hooks/marketplace/useMarketplace";
import { BusinessLogo } from "../Marketplace/marketplaceUi";
import { BUSINESS_STATUS } from "../../theme/marketplaceTokens";

const STATUS_TABS = [
  { label: "In review", value: "PENDING_REVIEW" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "All", value: "" },
];

const MarketplaceListingsPage = () => {
  const [tab, setTab] = useState(0);
  const status = STATUS_TABS[tab].value;
  const query = useAdminBusinesses({ status: status || undefined, limit: 100 });
  const moderate = useModerateBusiness();

  const items = query.data?.items ?? [];
  const pending = query.data?.meta?.pending ?? 0;

  return (
    <Box>
      <PageHeader
        title="Marketplace listings"
        subtitle="Review partner storefronts and publish or suspend them."
      />

      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
        {STATUS_TABS.map((t) => (
          <Tab
            key={t.label}
            label={t.value === "PENDING_REVIEW" && pending ? `${t.label} · ${pending}` : t.label}
          />
        ))}
      </Tabs>

      <QueryState query={query} isEmpty={items.length === 0} emptyMessage="No listings in this state.">
        <Stack spacing={1}>
          {items.map((b) => {
            const st = BUSINESS_STATUS[b.status] || BUSINESS_STATUS.DRAFT;
            return (
              <Paper
                key={b.id}
                elevation={0}
                sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2, alignItems: "center" }}
              >
                <BusinessLogo business={b} size={44} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {b.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {b.primaryCategory?.label || "No category"} · {b.legalName || "—"}
                    {b.abn ? ` · ABN ${b.abn}` : ""} · {b.owner?.email}
                  </Typography>
                </Box>
                <Chip size="small" label={st.label} color={st.color} />
                {b.status !== "PUBLISHED" && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => moderate.mutate({ id: b.id, status: "PUBLISHED" })}
                    disabled={moderate.isLoading}
                  >
                    Publish
                  </Button>
                )}
                {b.status !== "SUSPENDED" && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => moderate.mutate({ id: b.id, status: "SUSPENDED" })}
                    disabled={moderate.isLoading}
                  >
                    Suspend
                  </Button>
                )}
              </Paper>
            );
          })}
        </Stack>
      </QueryState>
    </Box>
  );
};

export default MarketplaceListingsPage;
