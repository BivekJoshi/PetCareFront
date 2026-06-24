import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// Resolve a Google Maps link (short maps.app.goo.gl or full URL) to { latitude, longitude }.
export const resolveMapLink = (url) =>
  axiosInstance.post("/geo/resolve-link", { url }).then(unwrap);
