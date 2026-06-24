import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import VetsMap from "../../components/common/map/VetsMap";
import {
  useRoleRequests,
  useReviewRoleRequest,
} from "../../hooks/roleRequests/useRoleRequests";
import {
  ASSIGNABLE_ROLES,
  ROLE_REQUEST_STATUS_COLORS,
  humanize,
} from "../../constants/domain";
import { formatDateTime, fullName } from "../../utility/format";

const FILTERS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ALL"];

const RoleRequestsPage = () => {
  const [filter, setFilter] = useState("PENDING");
  const [selected, setSelected] = useState(null); // request under review
  const [adminNote, setAdminNote] = useState("");
  const [overrideRole, setOverrideRole] = useState("");

  const params = filter === "ALL" ? {} : { status: filter };
  const query = useRoleRequests(params);
  const review = useReviewRoleRequest();

  const items = query.data?.items || [];
  const pending = query.data?.meta?.pending ?? 0;

  const openReview = (req) => {
    setSelected(req);
    setAdminNote("");
    setOverrideRole(req.requestedRole);
  };
  const closeReview = () => setSelected(null);

  const decide = (status) => {
    review.mutate(
      {
        id: selected.id,
        status,
        adminNote: adminNote.trim() || undefined,
        ...(status === "APPROVED" && overrideRole !== selected.requestedRole
          ? { overrideRole }
          : {}),
      },
      { onSuccess: closeReview }
    );
  };

  return (
    <Box>
      <PageHeader
        title="Role Requests"
        subtitle="Review users applying to become a vet or administrator. Inspect their documents, then approve or reject."
      />

      <Tabs
        value={filter}
        onChange={(_e, v) => setFilter(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        {FILTERS.map((f) => (
          <Tab
            key={f}
            value={f}
            label={
              f === "PENDING" && pending > 0 ? `Pending (${pending})` : humanize(f)
            }
          />
        ))}
      </Tabs>

      <QueryState
        query={query}
        isEmpty={items.length === 0}
        emptyMessage="No requests in this view."
      >
        <TableContainer component={Box} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Requester</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={req.user?.avatarUrl} sx={{ width: 36, height: 36 }}>
                        {req.user?.firstName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {fullName(req.user)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {req.user?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {humanize(req.currentRole)} → <strong>{humanize(req.requestedRole)}</strong>
                  </TableCell>
                  <TableCell>{req.documents?.length || 0}</TableCell>
                  <TableCell>{formatDateTime(req.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={humanize(req.status)}
                      color={ROLE_REQUEST_STATUS_COLORS[req.status]}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant={req.status === "PENDING" ? "contained" : "text"}
                      onClick={() => openReview(req)}
                    >
                      {req.status === "PENDING" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      {/* Review dialog */}
      <Dialog open={Boolean(selected)} onClose={closeReview} maxWidth="md" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Review role request
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={selected.user?.avatarUrl}>
                    {selected.user?.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {fullName(selected.user)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selected.user?.email}
                      {selected.user?.phone ? ` · ${selected.user.phone}` : ""}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={humanize(selected.currentRole)} />
                  <Typography>→</Typography>
                  <Chip
                    size="small"
                    color="primary"
                    label={humanize(selected.requestedRole)}
                  />
                </Stack>

                {selected.reason ? (
                  <Box>
                    <Typography variant="subtitle2">Additional information</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selected.reason}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No additional information provided.
                  </Typography>
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Documents ({selected.documents?.length || 0})
                  </Typography>
                  {selected.documents?.length ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {selected.documents.map((doc, i) => (
                        <Chip
                          key={i}
                          variant="outlined"
                          icon={<InsertDriveFileOutlinedIcon />}
                          label={doc.name}
                          component={Link}
                          href={doc.url}
                          target="_blank"
                          rel="noopener"
                          clickable
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No documents attached.
                    </Typography>
                  )}
                </Box>

                {Array.isArray(selected.fieldValues) &&
                  selected.fieldValues.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Submitted details
                      </Typography>
                      <Stack spacing={0.5}>
                        {selected.fieldValues.map((fv) => (
                          <Typography key={fv.key} variant="body2">
                            <Box component="span" color="text.secondary">
                              {fv.label}:{" "}
                            </Box>
                            <strong>{fv.value}</strong>
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Requested location
                  </Typography>
                  {selected.latitude != null && selected.longitude != null ? (
                    <Stack spacing={1}>
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<PlaceOutlinedIcon />}
                        label={`${selected.latitude.toFixed(5)}, ${selected.longitude.toFixed(5)}`}
                        component={Link}
                        href={`https://www.openstreetmap.org/?mlat=${selected.latitude}&mlon=${selected.longitude}#map=15/${selected.latitude}/${selected.longitude}`}
                        target="_blank"
                        rel="noopener"
                        clickable
                        sx={{ alignSelf: "flex-start" }}
                      />
                      <VetsMap
                        height={240}
                        vets={[
                          {
                            id: selected.id,
                            latitude: selected.latitude,
                            longitude: selected.longitude,
                            specialization: "Applicant",
                            isAvailable: true,
                            user: selected.user,
                          },
                        ]}
                      />
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No location provided.
                    </Typography>
                  )}
                </Box>

                {selected.status === "PENDING" ? (
                  <>
                    <Divider />
                    <TextField
                      select
                      label="Grant role"
                      value={overrideRole}
                      onChange={(e) => setOverrideRole(e.target.value)}
                      helperText="Defaults to the requested role; override if needed."
                    >
                      {ASSIGNABLE_ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {humanize(r)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Note to the user (optional)"
                      placeholder="Shown to the user and included in their email — e.g. the reason for rejection."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 2000 }}
                    />
                  </>
                ) : (
                  <Alert severity={ROLE_REQUEST_STATUS_COLORS[selected.status] === "success" ? "success" : "info"}>
                    {humanize(selected.status)}
                    {selected.reviewedBy ? ` by ${fullName(selected.reviewedBy)}` : ""}
                    {selected.reviewedAt ? ` · ${formatDateTime(selected.reviewedAt)}` : ""}
                    {selected.adminNote ? ` — “${selected.adminNote}”` : ""}
                  </Alert>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={closeReview}>Close</Button>
              {selected.status === "PENDING" && (
                <>
                  <Button
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={() => decide("REJECTED")}
                    disabled={review.isLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => decide("APPROVED")}
                    disabled={review.isLoading}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default RoleRequestsPage;
