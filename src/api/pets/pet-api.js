import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchPets = (params) =>
  axiosInstance.get("/pets", { params }).then(unwrap);

export const fetchPet = (id) => axiosInstance.get(`/pets/${id}`).then(unwrap);

// Vet-facing: pull up a pet (with owner, vaccinations, records) by its code.
export const lookupPetByCode = (code) =>
  axiosInstance.get(`/pets/lookup/${encodeURIComponent(code)}`).then(unwrap);

export const createPet = (payload) =>
  axiosInstance.post("/pets", payload).then(unwrap);

export const updatePet = ({ id, ...payload }) =>
  axiosInstance.patch(`/pets/${id}`, payload).then(unwrap);

export const deletePet = (id) =>
  axiosInstance.delete(`/pets/${id}`).then(unwrap);
