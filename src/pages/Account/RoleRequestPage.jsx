import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useAuth } from "../../context/AuthContext";
import {
  useMyRoleRequests,
  useRoleRequestMutations,
} from "../../hooks/roleRequests/useRoleRequests";
import {
  REQUESTABLE_ROLES,
  ROLE_REQUEST_STATUS_COLORS,
  humanize,
} from "../../constants/domain";
import { formatDateTime } from "../../utility/format";

const MAX_DOCS = 5;
const MAX_SIZE = 15 * 1024 * 1024; // 15 MB per file (matches the backend limit)

const formatBytes = (bytes = 0) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

const RoleRequestPage = () => {
  const { role } = useAuth();
  const query = useMyRoleRequests();
  const { submit, cancel } = useRoleRequestMutations();

  const [requestedRole, setRequestedRole] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);

  const requests = query.data || [];
  const hasPending = requests.some((r) => r.status === "PENDING");

  // A user can't request the role they already hold.
  const roleOptions = REQUESTABLE_ROLES.filter((r) => r !== role);

  const handlePickFiles = (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = ""; // allow re-picking the same file
    const accepted = [];
    for (const file of picked) {
      if (file.size > MAX_SIZE) continue; // silently skip oversized files
      accepted.push(file);
    }
    setFiles((prev) => [...prev, ...accepted].slice(0, MAX_DOCS));
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const canSubmit = requestedRole && !hasPending && !submit.isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submit.mutate(
      { requestedRole, reason: reason.trim(), documents: files },
      {
        onSuccess: () => {
          setRequestedRole("");
          setReason("");
          setFiles([]);
        },
      }
    );
  };

  return (
    <Box>
      <PageHeader
        title="Request a Role Change"
        subtitle="Apply to become a vet or an administrator. Attach any documents that prove your eligibility — an admin will review and decide."
      />

      <Stack spacing={3}>
        {/* Submission form */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography color="text.secondary">Your current role:</Typography>
                <Chip size="small" color="primary" label={humanize(role)} />
              </Stack>

              {hasPending && (
                <Alert severity="info">
                  You already have a request awaiting review. You can submit a new
                  one once it has been decided or cancelled.
                </Alert>
              )}

              <TextField
                select
                label="Role you're requesting"
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                disabled={hasPending}
                sx={{ maxWidth: 360 }}
              >
                {roleOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {humanize(r)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Additional information"
                placeholder="Tell the admin why you're requesting this role (e.g. your clinic, license number, jurisdiction)…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={hasPending}
                multiline
                minRows={3}
                inputProps={{ maxLength: 2000 }}
              />

              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  disabled={hasPending || files.length >= MAX_DOCS}
                >
                  Attach documents
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handlePickFiles}
                  />
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.75 }}
                >
                  Up to {MAX_DOCS} files, 15 MB each. Images, PDF, Word, Excel.
                </Typography>

                {files.length > 0 && (
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {files.map((file, i) => (
                      <Stack
                        key={`${file.name}-${i}`}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          p: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <InsertDriveFileOutlinedIcon
                          fontSize="small"
                          color="action"
                        />
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatBytes(file.size)}
                        </Typography>
                        <IconButton size="small" onClick={() => removeFile(i)}>
                          <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>

              <Divider />

              <Box>
                <Button
                  variant="contained"
                  startIcon={<SendOutlinedIcon />}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  {submit.isLoading ? "Submitting…" : "Submit request"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* History of this user's requests */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            Your requests
          </Typography>
          <QueryState
            query={query}
            isEmpty={requests.length === 0}
            emptyMessage="You haven't requested any role changes yet."
          >
            <Stack spacing={2}>
              {requests.map((req) => (
                <Card key={req.id} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={1.5}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontWeight: 700 }}>
                            {humanize(req.currentRole)} → {humanize(req.requestedRole)}
                          </Typography>
                          <Chip
                            size="small"
                            label={humanize(req.status)}
                            color={ROLE_REQUEST_STATUS_COLORS[req.status]}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Submitted {formatDateTime(req.createdAt)}
                        </Typography>
                      </Box>

                      {req.status === "PENDING" && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => cancel.mutate(req.id)}
                          disabled={cancel.isLoading}
                        >
                          Cancel
                        </Button>
                      )}
                    </Stack>

                    {req.reason && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                      >
                        {req.reason}
                      </Typography>
                    )}

                    {req.documents?.length > 0 && (
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ mt: 1.5 }}
                      >
                        {req.documents.map((doc, i) => (
                          <Chip
                            key={i}
                            size="small"
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
                    )}

                    {req.adminNote && (
                      <Alert
                        severity={req.status === "APPROVED" ? "success" : "warning"}
                        sx={{ mt: 1.5 }}
                      >
                        <strong>Admin note:</strong> {req.adminNote}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </QueryState>
        </Box>
      </Stack>
    </Box>
  );
};

export default RoleRequestPage;
