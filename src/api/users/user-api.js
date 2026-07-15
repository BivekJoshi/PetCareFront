import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Admin user management. Backed by the admin-only /users endpoints.
export const fetchUsers = (params) =>
  axiosInstance.get("/users", { params }).then(unwrap);

// Paginated + filtered directory. POST body carries pageNumber / pageSize plus
// filters (roles, search, isActive, sortBy, sortOrder).
export const searchUsers = (payload) =>
  axiosInstance.post("/users/list", payload).then(unwrap);

// Same paginated + filtered directory as `searchUsers`, but via the HTTP QUERY
// method (draft-ietf-httpbis-safe-method-w-body): a safe, idempotent read that
// carries its filters in the body. Semantically a *query*, not a POST write —
// the preferred method for reading the directory. Maps to QUERY /users.
export const queryUsers = (payload) =>
  axiosInstance
    .request({ url: "/users", method: "QUERY", data: payload })
    .then(unwrap);

export const fetchUser = (id) =>
  axiosInstance.get(`/users/${id}`).then(unwrap);

export const createUser = (payload) =>
  axiosInstance.post("/users", payload).then(unwrap);

export const updateUser = ({ id, ...payload }) =>
  axiosInstance.patch(`/users/${id}`, payload).then(unwrap);

export const deleteUser = (id) =>
  axiosInstance.delete(`/users/${id}`).then(unwrap);
