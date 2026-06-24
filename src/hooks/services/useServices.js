import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../api/services/service-api";

const KEY = "services";

export const useServices = (params = {}, options = {}) =>
  useQuery([KEY, params], () => fetchServices(params), {
    keepPreviousData: true,
    ...options,
  });

export const useServiceMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createService, {
    onSuccess: () => {
      invalidate();
      toast.success("Service created");
    },
    onError,
  });

  const update = useMutation(updateService, {
    onSuccess: () => {
      invalidate();
      toast.success("Service updated");
    },
    onError,
  });

  const remove = useMutation(deleteService, {
    onSuccess: () => {
      invalidate();
      toast.success("Service deleted");
    },
    onError,
  });

  return { create, update, remove };
};
