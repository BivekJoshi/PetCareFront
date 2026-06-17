import { useQuery } from "react-query";
import { fetchOverview, fetchByArea } from "../../api/stats/stats-api";

export const useOverview = (options = {}) =>
  useQuery(["stats", "overview"], fetchOverview, options);

export const useByArea = (params = {}, options = {}) =>
  useQuery(["stats", "by-area", params], () => fetchByArea(params), {
    keepPreviousData: true,
    ...options,
  });
