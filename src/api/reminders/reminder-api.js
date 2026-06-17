import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

export const fetchReminders = (params) =>
  axiosInstance.get("/reminders", { params }).then(unwrap);

export const createReminder = (payload) =>
  axiosInstance.post("/reminders", payload).then(unwrap);

export const markReminderRead = (id) =>
  axiosInstance.patch(`/reminders/${id}/read`).then(unwrap);

export const dismissReminder = (id) =>
  axiosInstance.delete(`/reminders/${id}`).then(unwrap);
