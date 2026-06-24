import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  createRoleRequest,
  fetchMyRoleRequests,
  cancelRoleRequest,
  fetchRoleRequests,
  fetchPendingRoleRequestCount,
  reviewRoleRequest,
} from "../../api/roleRequests/role-request-api";

const MINE_KEY = "my-role-requests";
const ADMIN_KEY = "role-requests";
const PENDING_KEY = "role-requests-pending";

const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

// ── User-facing ──

export const useMyRoleRequests = (options = {}) =>
  useQuery([MINE_KEY], fetchMyRoleRequests, options);

export const useRoleRequestMutations = () => {
  const queryClient = useQueryClient();

  const submit = useMutation(createRoleRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(MINE_KEY);
      toast.success("Role request submitted for review");
    },
    onError,
  });

  const cancel = useMutation(cancelRoleRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(MINE_KEY);
      toast.success("Request cancelled");
    },
    onError,
  });

  return { submit, cancel };
};

// ── Admin-facing ──

export const useRoleRequests = (params, options = {}) =>
  useQuery([ADMIN_KEY, params], () => fetchRoleRequests(params), {
    keepPreviousData: true,
    ...options,
  });

export const usePendingRoleRequestCount = (options = {}) =>
  useQuery([PENDING_KEY], fetchPendingRoleRequestCount, options);

export const useReviewRoleRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(reviewRoleRequest, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(ADMIN_KEY);
      queryClient.invalidateQueries(PENDING_KEY);
      // A decision may have changed a user's role — refresh the user list too.
      queryClient.invalidateQueries("users");
      toast.success(
        variables.status === "APPROVED" ? "Request approved" : "Request rejected"
      );
    },
    onError,
  });
};
