import { useCallback, useMemo, useState } from "react";
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { useAuth } from "../../context/AuthContext";
import { useUserSearch, useUpdateUser } from "../../hooks/users/useUsers";
import { ASSIGNABLE_ROLES, ROLES, humanize } from "../../constants/domain";
import { formatDate, fullName } from "../../utility/format";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

// Stable default so the columns useMemo doesn't recompute every render.
const NO_EXTRA_COLUMNS = [];

/**
 * UsersTable — shared admin directory for a single role scope.
 *
 * Backed by the POST /users/list endpoint (server-side pagination + filtering).
 * The Vets, Customers and Admins pages all render this with a different
 * `roles` scope; each keeps the inline role-change + activate/deactivate
 * controls so an admin can manage accounts from any list.
 *
 * @param {object}   props
 * @param {string}   props.title            Page title.
 * @param {string}   props.subtitle         Page subtitle.
 * @param {string[]} props.roles            Role scope sent to the API.
 * @param {string[]} [props.roleOptions]    Roles offered in the per-row picker.
 * @param {Array}    [props.extraColumns]   Extra column defs (e.g. specialization).
 * @param {string}   [props.searchPlaceholder]
 * @param {string}   [props.emptyMessage]
 */
const UsersTable = ({
  title,
  subtitle,
  roles,
  roleOptions = ASSIGNABLE_ROLES,
  extraColumns = NO_EXTRA_COLUMNS,
  searchPlaceholder = "Search name, email or phone…",
  emptyMessage = "No accounts match your filters.",
}) => {
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [pendingRole, setPendingRole] = useState(null); // { user, role }

  const payload = useMemo(
    () => ({
      pageNumber: pageIndex + 1,
      pageSize,
      roles,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(status !== "ALL" ? { isActive: status === "ACTIVE" } : {}),
    }),
    [pageIndex, pageSize, roles, search, status],
  );

  const query = useUserSearch(payload);
  const update = useUpdateUser();

  const items = query.data?.items || [];
  const total = query.data?.meta?.total ?? 0;

  const confirmRoleChange = () => {
    update.mutate(
      { id: pendingRole.user.id, role: pendingRole.role },
      { onSuccess: () => setPendingRole(null) },
    );
  };

  const toggleActive = useCallback(
    (user) => update.mutate({ id: user.id, isActive: !user.isActive }),
    [update],
  );

  const handlePaginationChange = (updater) => {
    const next =
      typeof updater === "function"
        ? updater({ pageIndex, pageSize })
        : updater;
    setPageSize(next.pageSize);
    // A page-size change resets to the first page to avoid an empty view.
    setPageIndex(next.pageSize !== pageSize ? 0 : next.pageIndex);
  };

  const columns = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        accessorFn: (row) => fullName(row),
        Cell: ({ row }) => {
          const user = row.original;
          const isSelf = user.id === me?.id;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36 }}>
                {user.firstName?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {fullName(user)}
                  {isSelf && <Chip size="small" label="You" sx={{ ml: 1, height: 18 }} />}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        id: "phone",
        header: "Phone",
        accessorFn: (row) => row.phone || "—",
      },
      ...extraColumns,
      {
        accessorKey: "role",
        header: "Role",
        enableSorting: false,
        Cell: ({ row }) => {
          const user = row.original;
          const isSelf = user.id === me?.id;
          return (
            <Tooltip title={isSelf ? "You can't change your own role" : ""}>
              <span>
                <Select
                  size="small"
                  value={user.role}
                  disabled={isSelf || update.isLoading}
                  onChange={(e) => setPendingRole({ user, role: e.target.value })}
                  sx={{ minWidth: 150 }}
                >
                  {roleOptions.map((r) => (
                    <MenuItem key={r} value={r}>
                      {humanize(r)}
                    </MenuItem>
                  ))}
                </Select>
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "isActive",
        header: "Active",
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const user = row.original;
          const isSelf = user.id === me?.id;
          return (
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
          );
        },
      },
    ],
    [me?.id, update.isLoading, toggleActive, extraColumns, roleOptions],
  );

  return (
    <Box>
      <PageHeader title={title} subtitle={subtitle} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
        alignItems={{ sm: "center" }}
      >
        <TextField
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageIndex(0);
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
          label="Status"
          size="small"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPageIndex(0);
          }}
          sx={{ minWidth: 180 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <DataTable
        columns={columns}
        data={items}
        query={query}
        emptyMessage={emptyMessage}
        enablePagination
        manualPagination
        rowCount={total}
        pagination={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        getRowId={(row) => row.id}
      />

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

export default UsersTable;
