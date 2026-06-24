import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchRoleRequestFields,
  createRoleRequestField,
  updateRoleRequestField,
  deleteRoleRequestField,
} from "../../api/roleRequestFields/role-request-field-api";

const KEY = "role-request-fields";

export const useRoleRequestFields = (params = {}, options = {}) =>
  useQuery([KEY, params], () => fetchRoleRequestFields(params), {
    keepPreviousData: true,
    ...options,
  });

export const useRoleRequestFieldMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createRoleRequestField, {
    onSuccess: () => {
      invalidate();
      toast.success("Field added");
    },
    onError,
  });

  const update = useMutation(updateRoleRequestField, {
    onSuccess: () => {
      invalidate();
      toast.success("Field updated");
    },
    onError,
  });

  const remove = useMutation(deleteRoleRequestField, {
    onSuccess: () => {
      invalidate();
      toast.success("Field removed");
    },
    onError,
  });

  return { create, update, remove };
};
