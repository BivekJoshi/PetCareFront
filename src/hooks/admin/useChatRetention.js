import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchChatRetention,
  updateChatRetention,
  purgeChatNow,
} from "../../api/admin/admin-api";

const KEY = "chat-retention";

export const useChatRetention = (options = {}) =>
  useQuery([KEY], fetchChatRetention, options);

export const useChatRetentionMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const update = useMutation(updateChatRetention, {
    onSuccess: () => {
      invalidate();
      toast.success("Retention policy saved");
    },
    onError,
  });

  const purge = useMutation(purgeChatNow, {
    onSuccess: (data) => {
      invalidate();
      const deleted = data?.result?.deleted ?? 0;
      toast.success(
        data?.result?.skipped
          ? "Purge skipped — retention is disabled"
          : `Purged ${deleted} old message${deleted === 1 ? "" : "s"}`
      );
    },
    onError,
  });

  return { update, purge };
};
