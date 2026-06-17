import { useQuery } from "react-query";
import { fetchVets } from "../../api/vets/vet-api";

export const useVets = (params = {}) =>
  useQuery(["vets", params], () => fetchVets(params), {
    keepPreviousData: true,
  });
