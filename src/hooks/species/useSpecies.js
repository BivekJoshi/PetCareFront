import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchSpecies,
  fetchAllSpecies,
  createSpecies,
  updateSpecies,
  deleteSpecies,
} from "../../api/species/species-api";
import { registerSpeciesEmoji } from "../../pages/Owner/ownerUi";

const PUBLIC_KEY = "species";
const ADMIN_KEY = "species-all";

const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

const invalidateAll = (queryClient) => {
  queryClient.invalidateQueries(PUBLIC_KEY);
  queryClient.invalidateQueries(ADMIN_KEY);
};

// Active species (public). Also feeds the shared emoji map so custom species
// render their emoji across the app.
export const usePublicSpecies = (options = {}) =>
  useQuery([PUBLIC_KEY], fetchSpecies, {
    staleTime: 5 * 60 * 1000,
    onSuccess: registerSpeciesEmoji,
    ...options,
  });

// Every species, including inactive — admin management view.
export const useAllSpecies = (options = {}) =>
  useQuery([ADMIN_KEY], fetchAllSpecies, options);

export const useSpeciesMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation(createSpecies, {
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Species added");
    },
    onError,
  });

  const update = useMutation(updateSpecies, {
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Species updated");
    },
    onError,
  });

  const remove = useMutation(deleteSpecies, {
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Species deleted");
    },
    onError,
  });

  return { create, update, remove };
};
