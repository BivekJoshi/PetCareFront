import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useAuth } from "../../context/AuthContext";
import { useUsers, useUpdateUser } from "../../hooks/users/useUsers";
import { ASSIGNABLE_ROLES, ROLES, humanize } from "../../constants/domain";
import { formatDate, fullName } from "../../utility/format";

const ROLE_FILTERS = ["ALL", ...ASSIGNABLE_ROLES];

const UserManagementPage = () => {
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [pendingRole, setPendingRole] = useState(null); // { user, role }

  const params = {
    page: page + 1,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(roleFilter !== "ALL" ? { role: roleFilter } : {}),
  };
  const query = useUsers(params);
  const update = useUpdateUser();

  const items = query.data?.items || [];
  const total = query.data?.meta?.total ?? 0;

  const confirmRoleChange = () => {
    update.mutate(
      { id: pendingRole.user.id, role: pendingRole.role },
      { onSuccess: () => setPendingRole(null) }
    );
  };

  const toggleActive = (user) =>
    update.mutate({ id: user.id, isActive: !user.isActive });

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Browse all accounts, change a user's role, or deactivate an account."
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
        alignItems={{ sm: "center" }}
      >
        <TextField
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{ maxWidth: 360, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Role"
          size="small"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 180 }}
        >
          {ROLE_FILTERS.map((r) => (
            <MenuItem key={r} value={r}>
              {r === "ALL" ? "All roles" : humanize(r)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <QueryState
        query={query}
        isEmpty={items.length === 0}
        emptyMessage="No users match your filters."
      >
        <TableContainer
          component={Box}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const isSelf = user.id === me?.id;
                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36 }}>
                          {user.firstName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {fullName(user)}
                            {isSelf && (
                              <Chip
                                size="small"
                                label="You"
                                sx={{ ml: 1, height: 18 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={isSelf ? "You can't change your own role" : ""}
                      >
                        <span>
                          <Select
                            size="small"
                            value={user.role}
                            disabled={isSelf || update.isLoading}
                            onChange={(e) =>
                              setPendingRole({ user, role: e.target.value })
                            }
                            sx={{ minWidth: 150 }}
                          >
                            {ASSIGNABLE_ROLES.map((r) => (
                              <MenuItem key={r} value={r}>
                                {humanize(r)}
                              </MenuItem>
                            ))}
                          </Select>
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          isSelf
                            ? "You can't deactivate yourself"
                            : user.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <span>
                          <Switch
                            checked={user.isActive}
                            disabled={isSelf || update.isLoading}
                            onChange={() => toggleActive(user)}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_e, p) => setPage(p)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </TableContainer>
      </QueryState>

      {/* Confirm role change */}
      <Dialog open={Boolean(pendingRole)} onClose={() => setPendingRole(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Change user role?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingRole && (
              <>
                Change <strong>{fullName(pendingRole.user)}</strong> from{" "}
                <strong>{humanize(pendingRole.user.role)}</strong> to{" "}
                <strong>{humanize(pendingRole.role)}</strong>? This takes effect
                immediately.
              </>
            )}
          </DialogContentText>
          {pendingRole?.role === ROLES.SUPER_ADMIN && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Super admins have full control over the platform. Grant this with
              care.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPendingRole(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={confirmRoleChange}
            disabled={update.isLoading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
