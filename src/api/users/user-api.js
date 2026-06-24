import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Admin user management. Backed by the admin-only /users endpoints.
export const fetchUsers = (params) =>
  axiosInstance.get("/users", { params }).then(unwrap);

export const fetchUser = (id) =>
  axiosInstance.get(`/users/${id}`).then(unwrap);

export const createUser = (payload) =>
  axiosInstance.post("/users", payload).then(unwrap);

export const updateUser = ({ id, ...payload }) =>
  axiosInstance.patch(`/users/${id}`, payload).then(unwrap);

export const deleteUser = (id) =>
  axiosInstance.delete(`/users/${id}`).then(unwrap);
