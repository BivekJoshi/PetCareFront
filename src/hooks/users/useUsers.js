import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { fetchUsers, updateUser, deleteUser } from "../../api/users/user-api";

const KEY = "users";

const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

export const useUsers = (params, options = {}) =>
  useQuery([KEY, params], () => fetchUsers(params), {
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
