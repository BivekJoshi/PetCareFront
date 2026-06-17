import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchOverview = () =>
  axiosInstance.get("/stats/overview").then(unwrap);

export const fetchByArea = (params) =>
  axiosInstance.get("/stats/by-area", { params }).then(unwrap);
