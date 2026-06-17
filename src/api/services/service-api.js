import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchServices = (params) =>
  axiosInstance.get("/services", { params }).then(unwrap);

export const createService = (payload) =>
  axiosInstance.post("/services", payload).then(unwrap);

export const updateService = ({ id, ...payload }) =>
  axiosInstance.patch(`/services/${id}`, payload).then(unwrap);

export const deleteService = (id) =>
  axiosInstance.delete(`/services/${id}`).then(unwrap);
