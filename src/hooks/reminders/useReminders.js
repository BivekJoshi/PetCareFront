import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchReminders,
  createReminder,
  markReminderRead,
  dismissReminder,
} from "../../api/reminders/reminder-api";

const KEY = "reminders";

export const useReminders = (params = {}, options = {}) =>
  useQuery([KEY, params], () => fetchReminders(params), {
    keepPreviousData: true,
    ...options,
  });

export const useReminderMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createReminder, {
    onSuccess: () => {
      invalidate();
      toast.success("Reminder created");
    },
    onError,
  });

  const markRead = useMutation(markReminderRead, {
    onSuccess: () => invalidate(),
    onError,
  });

  const dismiss = useMutation(dismissReminder, {
    onSuccess: () => {
      invalidate();
      toast.success("Reminder dismissed");
    },
    onError,
  });

  return { create, markRead, dismiss };
};
