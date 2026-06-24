import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Public: active species + live pet counts (used by the picker and landing page).
export const fetchSpecies = () => axiosInstance.get("/species").then(unwrap);

// Admin: every species, including inactive ones.
export const fetchAllSpecies = () =>
  axiosInstance.get("/species/all").then(unwrap);

export const createSpecies = (payload) =>
  axiosInstance.post("/species", payload).then(unwrap);

export const updateSpecies = ({ id, ...payload }) =>
  axiosInstance.patch(`/species/${id}`, payload).then(unwrap);

export const deleteSpecies = (id) =>
  axiosInstance.delete(`/species/${id}`).then(unwrap);
