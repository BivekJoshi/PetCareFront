import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// List configured fields. Pass { role } to scope, { includeInactive: true } for admin.
export const fetchRoleRequestFields = (params) =>
  axiosInstance.get("/role-request-fields", { params }).then(unwrap);

export const createRoleRequestField = (payload) =>
  axiosInstance.post("/role-request-fields", payload).then(unwrap);

export const updateRoleRequestField = ({ id, ...payload }) =>
  axiosInstance.patch(`/role-request-fields/${id}`, payload).then(unwrap);

export const deleteRoleRequestField = (id) =>
  axiosInstance.delete(`/role-request-fields/${id}`).then(unwrap);
