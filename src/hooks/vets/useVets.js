import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchVets,
  createVet,
  updateVet,
  deleteVet,
} from "../../api/vets/vet-api";

const KEY = "vets";

export const useVets = (params = {}) =>
  useQuery([KEY, params], () => fetchVets(params), {
    keepPreviousData: true,
  });

export const useVetMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createVet, {
    onSuccess: () => {
      invalidate();
      toast.success("Vet created");
    },
    onError,
  });

  const update = useMutation(updateVet, {
    onSuccess: () => {
      invalidate();
      toast.success("Vet updated");
    },
    onError,
  });

  const remove = useMutation(deleteVet, {
    onSuccess: () => {
      invalidate();
      toast.success("Vet deleted");
    },
    onError,
  });

  return { create, update, remove };
};
