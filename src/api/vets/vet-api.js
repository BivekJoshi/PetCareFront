import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchVets = (params) =>
  axiosInstance.get("/vets", { params }).then(unwrap);

export const fetchVet = (id) => axiosInstance.get(`/vets/${id}`).then(unwrap);

export const createVet = (payload) =>
  axiosInstance.post("/vets", payload).then(unwrap);

export const updateVet = ({ id, ...payload }) =>
  axiosInstance.patch(`/vets/${id}`, payload).then(unwrap);

export const deleteVet = (id) =>
  axiosInstance.delete(`/vets/${id}`).then(unwrap);
