import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchVets = (params) =>
  axiosInstance.get("/vets", { params }).then(unwrap);

export const fetchVet = (id) => axiosInstance.get(`/vets/${id}`).then(unwrap);
