// Base URL for the PetCare API. Override per-environment with VITE_API_URL.
export const getBaseUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1";

export const getDocUrl = () => {
  return "https://demo.filestash.app/s/8HZMJMX/";
};
