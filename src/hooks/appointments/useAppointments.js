import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../api/appointments/appointment-api";

const KEY = "appointments";

export const useAppointments = (params = {}) =>
  useQuery([KEY, params], () => fetchAppointments(params), {
    keepPreviousData: true,
  });

export const useAppointmentMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createAppointment, {
    onSuccess: () => {
      invalidate();
      toast.success("Appointment booked");
    },
    onError,
  });

  const updateStatus = useMutation(updateAppointmentStatus, {
    onSuccess: () => {
      invalidate();
      toast.success("Appointment updated");
    },
    onError,
  });

  const remove = useMutation(deleteAppointment, {
    onSuccess: () => {
      invalidate();
      toast.success("Appointment deleted");
    },
    onError,
  });

  return { create, updateStatus, remove };
};
