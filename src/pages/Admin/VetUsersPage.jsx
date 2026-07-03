import { Chip } from "@mui/material";
import UsersTable from "./UsersTable";
import { ROLES } from "../../constants/domain";

// Extra vet-only columns pulled from the attached vetProfile.
const VET_COLUMNS = [
  {
    id: "specialization",
    header: "Specialization",
    accessorFn: (row) => row.vetProfile?.specialization || "General Practice",
  },
  {
    id: "availability",
    header: "Availability",
    enableSorting: false,
    accessorFn: (row) => (row.vetProfile?.isAvailable ? "Available" : "Unavailable"),
    Cell: ({ row }) => {
      const available = row.original.vetProfile?.isAvailable;
      return (
        <Chip
          size="small"
          label={available ? "Available" : "Unavailable"}
          color={available ? "success" : "default"}
        />
      );
    },
  },
];

const VetUsersPage = () => (
  <UsersTable
    title="Vets"
    subtitle="Browse veterinarian accounts. Change a role or deactivate an account."
    roles={[ROLES.VET]}
    extraColumns={VET_COLUMNS}
    searchPlaceholder="Search vets by name, email or phone…"
    emptyMessage="No vets match your filters."
  />
);

export default VetUsersPage;
