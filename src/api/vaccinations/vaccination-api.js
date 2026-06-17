import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchVaccinations = (params) =>
  axiosInstance.get("/vaccinations", { params }).then(unwrap);

export const createVaccination = (payload) =>
  axiosInstance.post("/vaccinations", payload).then(unwrap);

export const updateVaccination = ({ id, ...payload }) =>
  axiosInstance.patch(`/vaccinations/${id}`, payload).then(unwrap);

export const deleteVaccination = (id) =>
  axiosInstance.delete(`/vaccinations/${id}`).then(unwrap);
