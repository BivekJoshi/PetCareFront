import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// ── User: submit + manage your own requests ──

// Submit a role-change request with optional supporting documents (File[]).
export const createRoleRequest = ({ requestedRole, reason, documents = [] }) => {
  const form = new FormData();
  form.append("requestedRole", requestedRole);
  if (reason) form.append("reason", reason);
  documents.forEach((file) => form.append("documents", file));
  return axiosInstance
    .post("/role-requests", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);
};

export const fetchMyRoleRequests = () =>
  axiosInstance.get("/role-requests/mine").then(unwrap);

export const cancelRoleRequest = (id) =>
  axiosInstance.post(`/role-requests/${id}/cancel`).then(unwrap);

// ── Admin: review queue ──

export const fetchRoleRequests = (params) =>
  axiosInstance.get("/role-requests", { params }).then(unwrap);

export const fetchPendingRoleRequestCount = () =>
  axiosInstance.get("/role-requests/pending-count").then(unwrap);

export const reviewRoleRequest = ({ id, ...payload }) =>
  axiosInstance.patch(`/role-requests/${id}/review`, payload).then(unwrap);
