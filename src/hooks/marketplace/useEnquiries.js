import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchEnquiries,
  startEnquiry,
  fetchEnquiryMessages,
  postEnquiryMessage,
} from "../../api/marketplace/marketplace-api";
import { connectSocket, getSocket } from "../../api/socket";

const KEY = "marketplace";
const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

// box: "inbox" (partner) | "mine" (customer)
export const useEnquiries = (box = "mine") =>
  useQuery([KEY, "enquiries", box], () => fetchEnquiries(box), { keepPreviousData: true });

export const useEnquiryThread = (id) =>
  useQuery([KEY, "enquiryThread", id], () => fetchEnquiryMessages(id), {
    enabled: Boolean(id),
  });

export const useEnquiryMutations = () => {
  const qc = useQueryClient();
  const invalidateLists = () => {
    qc.invalidateQueries([KEY, "enquiries"]);
  };
  const start = useMutation(startEnquiry, {
    onSuccess: () => { invalidateLists(); toast.success("Message sent"); },
    onError,
  });
  const send = useMutation(postEnquiryMessage, {
    onSuccess: (_d, vars) => {
      qc.invalidateQueries([KEY, "enquiryThread", vars.id]);
      invalidateLists();
    },
    onError,
  });
  return { start, send };
};

/**
 * Subscribe to real-time enquiry messages over the shared socket. On any new
 * message, refresh the thread lists and the open conversation so both the
 * customer and the partner see updates live.
 */
export const useEnquirySocket = (activeThreadId) => {
  const qc = useQueryClient();
  useEffect(() => {
    const socket = connectSocket();
    const onMessage = (payload) => {
      qc.invalidateQueries([KEY, "enquiries"]);
      if (payload?.threadId) {
        qc.invalidateQueries([KEY, "enquiryThread", payload.threadId]);
      }
    };
    socket.on("enquiry:message", onMessage);
    return () => {
      const s = getSocket();
      s.off("enquiry:message", onMessage);
    };
  }, [qc, activeThreadId]);
};
