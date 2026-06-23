import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  editMessage,
  deleteMessage,
  forwardMessage,
} from "../../api/chat/chat-api";
import { chatKeys } from "./useChat";

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback;

/**
 * Edit / delete / forward actions for a single message. Edit and
 * delete-for-everyone propagate via the socket "message:updated" event;
 * delete-for-me is local-only, so we invalidate the affected caches here.
 */
export const useMessageActions = () => {
  const queryClient = useQueryClient();

  const edit = async (id, content) => {
    try {
      await editMessage({ id, content });
    } catch (e) {
      toast.error(errMsg(e, "Could not edit message"));
      throw e;
    }
  };

  const remove = async (id, scope) => {
    try {
      await deleteMessage({ id, scope });
      if (scope === "me") {
        queryClient.invalidateQueries({ queryKey: ["chat", "thread"] });
        queryClient.invalidateQueries(chatKeys.broadcast);
        queryClient.invalidateQueries(chatKeys.conversations);
        queryClient.invalidateQueries(chatKeys.unread);
      }
      toast.success(
        scope === "everyone" ? "Deleted for everyone" : "Deleted for you"
      );
    } catch (e) {
      toast.error(errMsg(e, "Could not delete message"));
    }
  };

  const forward = async (id, recipientId) => {
    try {
      await forwardMessage({ id, recipientId });
      toast.success("Message forwarded");
    } catch (e) {
      toast.error(errMsg(e, "Could not forward message"));
      throw e;
    }
  };

  return { edit, remove, forward };
};
