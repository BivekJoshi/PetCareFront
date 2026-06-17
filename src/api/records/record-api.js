import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchRecords = (params) =>
  axiosInstance.get("/records", { params }).then(unwrap);

export const createRecord = (payload) =>
  axiosInstance.post("/records", payload).then(unwrap);

export const deleteRecord = (id) =>
  axiosInstance.delete(`/records/${id}`).then(unwrap);
