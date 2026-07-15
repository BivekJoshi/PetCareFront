import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchUsers,
  searchUsers,
  queryUsers,
  updateUser,
  deleteUser,
} from "../../api/users/user-api";

const KEY = "users";

const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

export const useUsers = (params, options = {}) =>
  useQuery([KEY, params], () => fetchUsers(params), {
    keepPreviousData: true,
    ...options,
  });

// Body-driven paginated directory (POST /users/list). Powers the admin
// Vets / Customers / Admins pages.
export const useUserSearch = (payload, options = {}) =>
  useQuery([KEY, "search", payload], () => searchUsers(payload), {
    keepPreviousData: true,
    ...options,
  });

// Same directory via the HTTP QUERY method (QUERY /users) — a safe, idempotent
// read whose filters ride in the body. Drop-in replacement for useUserSearch;
// swap the admin pages onto this to prefer QUERY over POST /list.
export const useUserQuery = (payload, options = {}) =>
  useQuery([KEY, "query", payload], () => queryUsers(payload), {
    keepPreviousData: true,
    ...options,
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(KEY);
      toast.success("User updated");
    },
    onError,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(KEY);
      toast.success("User deleted");
    },
    onError,
  });
};
