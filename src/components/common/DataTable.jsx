import { useState } from "react";
import { Box, Button, Portal, Tooltip, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

/**
 * DataTable — the single, dynamic, feature-rich table used across the app.
 *
 * A wrapper around material-react-table (TanStack Table v8) that bakes in the
 * app's look & feel — a coloured gradient header, striped hover rows, sticky
 * header, rounded outlined panel — plus a large kit of features that pages can
 * flip on/off with a single prop:
 *
 *   • Row numbers            (enableRowNumbers)
 *   • Global search          (enableSearch)
 *   • Per-column filters     (enableColumnFilters)
 *   • Sorting                (enableSorting)
 *   • Column show/hide       (enableHiding)
 *   • Column pinning         (enableColumnPinning)
 *   • Column reordering      (enableColumnOrdering — off by default)
 *   • Column resizing        (enableColumnResizing)
 *   • Row selection          (enableRowSelection)
 *   • Density toggle         (enableDensityToggle)
 *   • Full-screen toggle     (enableFullScreenToggle)
 *   • CSV export             (enableExport)
 *   • Pagination             (enablePagination, incl. server-side)
 *   • Striped rows           (striped)
 *
 * For the "full" look every feature is on by default. Pass `flush` for a bare
 * widget (no toolbar / row numbers / selection) that blends inside a card, or
 * override any single flag. Loading / error / empty are folded in via `query`.
 *
 * @example
 * const columns = [
 *   { accessorKey: "name", header: "Name" },
 *   { accessorKey: "status", header: "Status",
 *     Cell: ({ cell }) => <Chip label={cell.getValue()} /> },
 * ];
 * <DataTable columns={columns} data={rows} query={query} />
 */
const DataTable = ({
  columns,
  data = [],

  // react-query integration (optional) — drives loading / error states.
  query,
  isLoading: loadingProp,
  isError: errorProp,
  errorMessage: errorMessageProp,
  emptyMessage = "Nothing here yet.",

  // Feature toggles — `undefined` means "use the smart default" (rich for a
  // normal table, minimal for a `flush` widget / server-paginated table).
  enableRowNumbers,
  enableSearch,
  enableSorting,
  enableColumnFilters,
  enableColumnActions,
  enableHiding,
  enableColumnPinning,
  enableColumnOrdering,
  enableColumnResizing,
  enableRowSelection,
  enableDensityToggle,
  enableFullScreenToggle,
  enablePagination,
  enableExport,
  enableStickyHeader,
  striped,

  // Header colour treatment: "solid" (flat brand-colour banner, default),
  // "gradient" (brand gradient banner), "tint" (soft teal wash) or "plain".
  headerVariant = "solid",

  // Extra buttons on the top toolbar, e.g. an "Add" button.
  renderTopToolbarActions,

  // Per-row action buttons rendered in a trailing "Actions" column.
  rowActions,
  actionsHeader = "Actions",
  actionsSize = 130,

  // Server-side pagination (leave undefined for client-side).
  manualPagination = false,
  rowCount,
  pagination,
  onPaginationChange,
  pageSizeOptions = [10, 20, 50, 100],

  // Row identity + click handling.
  getRowId,
  onRowClick,

  // Export.
  exportFileName = "export.csv",

  // `flush` strips the outer border/radius + toolbar chrome so the table can
  // blend into a surrounding card (e.g. a dashboard widget).
  flush = false,
  maxHeight = "70vh",

  // How many shimmer rows to show while loading (defaults to the first page size).
  skeletonRowCount,

  initialState,
  tableOptions = {},
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  // Full-screen is controlled so we can portal the table out of the dashboard's
  // main-content stacking context (see the render return below).
  const [isFullScreen, setIsFullScreen] = useState(false);
  const p = theme.palette.primary;
  const onWhite = p.contrastText || "#fff";

  // Smart defaults: a plain table is fully loaded; a `flush` widget or a
  // server-paginated table gets a leaner, less-misleading feature set.
  const rich = !flush;
  const serverMode = manualPagination;
  const pick = (val, fallback) => (val === undefined ? fallback : val);

  const f = {
    rowNumbers: pick(enableRowNumbers, rich),
    search: pick(enableSearch, rich && !serverMode),
    sorting: pick(enableSorting, !serverMode),
    columnFilters: pick(enableColumnFilters, rich && !serverMode),
    columnActions: pick(enableColumnActions, rich),
    hiding: pick(enableHiding, rich),
    pinning: pick(enableColumnPinning, rich),
    ordering: pick(enableColumnOrdering, false),
    resizing: pick(enableColumnResizing, false),
    selection: pick(enableRowSelection, false),
    density: pick(enableDensityToggle, rich),
    fullScreen: pick(enableFullScreenToggle, rich),
    pagination: pick(enablePagination, rich),
    export: pick(enableExport, rich),
    sticky: pick(enableStickyHeader, true),
    striped: pick(striped, rich),
  };

  const isLoading = query ? query.isLoading : Boolean(loadingProp);
  const isError = query ? query.isError : Boolean(errorProp);
  const errorMessage =
    query?.error?.response?.data?.message ||
    errorMessageProp ||
    "Failed to load data.";

  // ---- coloured header ---------------------------------------------------
  // On a coloured ("solid"/"gradient") header the text and every glyph
  // (sort arrows, column-menu dots, checkboxes) must switch to the contrast
  // colour so they read against the fill.
  const onColor = headerVariant === "solid" || headerVariant === "gradient";
  const gradient = `linear-gradient(135deg, ${p.dark || p.main} 0%, ${p.main} 55%, ${alpha(p.light || p.main, 0.9)} 100%)`;
  const colouredHeaderSx = {
    color: onWhite,
    fontWeight: 800,
    fontSize: "0.78rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderBottom: `2px solid ${alpha(p.dark || "#000", 0.25)}`,
    "& .Mui-TableHeadCell-Content-Wrapper": { fontWeight: 800 },
    "& .MuiSvgIcon-root, & .MuiButtonBase-root, & .MuiTableSortLabel-icon": {
      color: `${alpha(onWhite, 0.85)} !important`,
    },
    "& .MuiTableSortLabel-root:hover, & .MuiTableSortLabel-root.Mui-active": {
      color: `${onWhite} !important`,
    },
    "& .MuiCheckbox-root": { color: `${alpha(onWhite, 0.9)} !important` },
    "& .MuiDivider-root": { borderColor: alpha("#fff", 0.3) },
  };
  const headerSx =
    headerVariant === "solid"
      ? { ...colouredHeaderSx, backgroundColor: p.main }
      : headerVariant === "gradient"
      ? { ...colouredHeaderSx, background: gradient }
      : headerVariant === "tint"
      ? {
          bgcolor: alpha(p.main, dark ? 0.16 : 0.08),
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.02em",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }
      : { fontWeight: 700, color: "text.primary" };

  // Show the top toolbar only when it has a purpose.
  const showTopToolbar =
    !flush &&
    (f.search ||
      f.columnFilters ||
      f.hiding ||
      f.density ||
      f.fullScreen ||
      f.export ||
      Boolean(renderTopToolbarActions));

  // ---- CSV export --------------------------------------------------------
  const exportCols = columns.filter((c) => c.accessorKey || c.accessorFn);
  const readCell = (row, col) => {
    if (col.accessorFn) return col.accessorFn(row);
    return String(col.accessorKey)
      .split(".")
      .reduce((acc, k) => (acc == null ? acc : acc[k]), row);
  };
  const csvCell = (v) => `"${(v == null ? "" : String(v)).replace(/"/g, '""')}"`;
  const handleExport = (t) => {
    const rows = t.getPrePaginationRowModel().rows;
    const header = exportCols.map((c) => csvCell(c.header)).join(",");
    const body = rows
      .map((r) => exportCols.map((c) => csvCell(readCell(r.original, c))).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const table = useMaterialReactTable({
    columns,
    data,

    // ---- feature flags -------------------------------------------------
    enableRowNumbers: f.rowNumbers,
    rowNumberDisplayMode: "static",
    enableSorting: f.sorting,
    enableGlobalFilter: f.search,
    enableColumnFilters: f.columnFilters,
    enableFacetedValues: f.columnFilters,
    enableColumnActions: f.columnActions,
    enableHiding: f.hiding,
    enableColumnPinning: f.pinning,
    enableColumnOrdering: f.ordering,
    enableColumnResizing: f.resizing,
    columnResizeMode: "onChange",
    enableRowSelection: f.selection,
    enableDensityToggle: f.density,
    enableFullScreenToggle: f.fullScreen,
    onIsFullScreenChange: setIsFullScreen,
    enablePagination: f.pagination,
    enableBottomToolbar: f.pagination,
    enableTopToolbar: showTopToolbar,
    enableStickyHeader: f.sticky,
    enableRowActions: Boolean(rowActions),
    positionActionsColumn: "last",
    positionToolbarAlertBanner: "top",
    layoutMode: "grid",

    // ---- row actions column -------------------------------------------
    ...(rowActions
      ? {
          renderRowActions: ({ row }) => rowActions(row.original, row),
          displayColumnDefOptions: {
            "mrt-row-actions": {
              header: actionsHeader,
              size: actionsSize,
              muiTableHeadCellProps: { align: "right" },
              muiTableBodyCellProps: { align: "right" },
            },
          },
        }
      : {}),

    // ---- toolbar extras (export + caller actions) ---------------------
    ...(f.export || renderTopToolbarActions
      ? {
          renderTopToolbarCustomActions: ({ table: t }) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {renderTopToolbarActions?.({ table: t })}
              {f.export && (
                <Tooltip title="Export to CSV">
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<FileDownloadOutlinedIcon />}
                    onClick={() => handleExport(t)}
                    sx={{ color: "text.secondary" }}
                  >
                    Export
                  </Button>
                </Tooltip>
              )}
            </Box>
          ),
        }
      : {}),

    // ---- server pagination --------------------------------------------
    manualPagination,
    ...(manualPagination ? { rowCount } : {}),
    ...(onPaginationChange ? { onPaginationChange } : {}),
    muiPaginationProps: {
      rowsPerPageOptions: pageSizeOptions,
      shape: "rounded",
      variant: "outlined",
      color: "primary",
    },

    // ---- state ---------------------------------------------------------
    state: {
      isLoading,
      isFullScreen,
      showAlertBanner: isError,
      showProgressBars: query ? query.isFetching && !query.isLoading : false,
      ...(pagination ? { pagination } : {}),
    },
    initialState: {
      density: "compact",
      showGlobalFilter: f.search,
      ...(f.pagination
        ? { pagination: { pageIndex: 0, pageSize: pageSizeOptions[0] } }
        : {}),
      ...initialState,
    },
    getRowId,

    // ---- empty / error --------------------------------------------------
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: errorMessage }
      : undefined,
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          textAlign: "center",
          py: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(p.main, dark ? 0.16 : 0.1),
            color: "primary.main",
          }}
        >
          <InboxOutlinedIcon />
        </Box>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    ),

    // ---- look & feel ---------------------------------------------------
    muiTablePaperProps: ({ table: t }) => ({
      elevation: 0,
      sx: {
        ...(flush
          ? { border: 0, borderRadius: 0, boxShadow: "none", bgcolor: "transparent" }
          : {
              border: 1,
              borderColor: "divider",
              borderRadius: 0,
              overflow: "hidden",
              boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, dark ? 0.4 : 0.06)}`,
            }),
        // In full-screen the paper is `position: fixed`; lift it above app
        // bars, drawers and modals so nothing bleeds through on top.
        ...(t.getState().isFullScreen ? { zIndex: theme.zIndex.modal + 1 } : {}),
      },
    }),
    muiTopToolbarProps: {
      sx: {
        bgcolor: alpha(p.main, dark ? 0.06 : 0.03),
        "& .MuiInputBase-root": { borderRadius: 999 },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        bgcolor: alpha(p.main, dark ? 0.06 : 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
      },
    },
    muiTableHeadCellProps: { sx: headerSx },
    muiTableHeadProps: {
      sx: {
        "& tr th": {
          // Coloured header casts a soft shadow while sticky-scrolling.
          boxShadow: onColor ? `0 2px 6px ${alpha(theme.palette.common.black, 0.14)}` : "none",
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      hover: true,
      sx: {
        ...(f.striped && row.index % 2
          ? { backgroundColor: alpha(theme.palette.text.primary, dark ? 0.04 : 0.022) }
          : {}),
        transition: "background-color .15s ease",
        "&:hover td": { backgroundColor: alpha(p.main, dark ? 0.14 : 0.07) },
        ...(onRowClick ? { cursor: "pointer" } : {}),
      },
      ...(onRowClick ? { onClick: () => onRowClick(row.original, row) } : {}),
    }),
    muiTableBodyCellProps: {
      sx: { borderColor: "divider", fontSize: "0.875rem" },
    },
    muiSearchTextFieldProps: {
      placeholder: "Search…",
      size: "small",
      variant: "outlined",
    },
    muiSelectAllCheckboxProps: onColor ? { sx: { color: "#fff" } } : undefined,
    muiTableContainerProps: { sx: { maxHeight } },

    // ---- loading skeleton ---------------------------------------------
    // A themed shimmer that reads as the real table filling in — rounded,
    // primary-tinted bars with a "wave" sweep instead of a bare spinner.
    skeletonRowCount: skeletonRowCount ?? Math.min(pageSizeOptions[0] ?? 10, 10),
    muiSkeletonProps: {
      animation: "wave",
      height: 20,
      sx: {
        borderRadius: 1,
        bgcolor: alpha(p.main, dark ? 0.16 : 0.09),
        "&::after": {
          background: `linear-gradient(90deg, transparent, ${alpha(
            p.main,
            dark ? 0.22 : 0.14,
          )}, transparent)`,
        },
      },
    },

    ...tableOptions,
  });

  // While full-screen, render into a Portal on document.body so the fixed
  // overlay escapes the dashboard's `position/zIndex` stacking context and
  // paints above the sidebar drawer and app bar (see muiTablePaperProps).
  const rendered = <MaterialReactTable table={table} />;
  return isFullScreen ? <Portal>{rendered}</Portal> : rendered;
};

export default DataTable;
