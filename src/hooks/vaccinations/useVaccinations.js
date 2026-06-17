import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} from "../../api/vaccinations/vaccination-api";

const KEY = "vaccinations";

export const useVaccinations = (params = {}, options = {}) =>
  useQuery([KEY, params], () => fetchVaccinations(params), {
    keepPreviousData: true,
    ...options,
  });

export const useVaccinationMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createVaccination, {
    onSuccess: () => {
      invalidate();
      toast.success("Vaccination recorded");
    },
    onError,
  });

  const update = useMutation(updateVaccination, {
    onSuccess: () => {
      invalidate();
      toast.success("Vaccination updated");
    },
    onError,
  });

  const remove = useMutation(deleteVaccination, {
    onSuccess: () => {
      invalidate();
      toast.success("Vaccination removed");
    },
    onError,
  });

  return { create, update, remove };
};
