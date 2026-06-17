import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchRecords,
  createRecord,
  deleteRecord,
} from "../../api/records/record-api";

const KEY = "records";

export const useRecords = (params = {}, options = {}) =>
  useQuery([KEY, params], () => fetchRecords(params), {
    keepPreviousData: true,
    ...options,
  });

export const useRecordMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createRecord, {
    onSuccess: () => {
      invalidate();
      toast.success("Record added");
    },
    onError,
  });

  const remove = useMutation(deleteRecord, {
    onSuccess: () => {
      invalidate();
      toast.success("Record removed");
    },
    onError,
  });

  return { create, remove };
};
