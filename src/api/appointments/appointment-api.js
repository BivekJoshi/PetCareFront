import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchAppointments = (params) =>
  axiosInstance.get("/appointments", { params }).then(unwrap);

export const createAppointment = (payload) =>
  axiosInstance.post("/appointments", payload).then(unwrap);

export const updateAppointmentStatus = ({ id, status }) =>
  axiosInstance.patch(`/appointments/${id}/status`, { status }).then(unwrap);

export const deleteAppointment = (id) =>
  axiosInstance.delete(`/appointments/${id}`).then(unwrap);
