import UsersTable from "./UsersTable";
import { ROLES } from "../../constants/domain";

const AdminUsersPage = () => (
  <UsersTable
    title="Admins"
    subtitle="Browse admin and super-admin accounts. Change a role or deactivate an account."
    roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
    searchPlaceholder="Search admins by name, email or phone…"
    emptyMessage="No admins match your filters."
  />
);

export default AdminUsersPage;
