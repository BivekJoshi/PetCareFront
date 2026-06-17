import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchAreas = (params) =>
  axiosInstance.get("/areas", { params }).then(unwrap);

export const createArea = (payload) =>
  axiosInstance.post("/areas", payload).then(unwrap);
