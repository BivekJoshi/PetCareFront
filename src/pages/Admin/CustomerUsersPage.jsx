import UsersTable from "./UsersTable";
import { ROLES } from "../../constants/domain";

const CustomerUsersPage = () => (
  <UsersTable
    title="Pet Owners"
    subtitle="Browse pet-owner accounts. Change a role or deactivate an account."
    roles={[ROLES.PET_OWNER]}
    searchPlaceholder="Search pet owners by name, email or phone…"
    emptyMessage="No pet owners match your filters."
  />
);

export default CustomerUsersPage;
