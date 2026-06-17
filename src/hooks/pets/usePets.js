import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchPets,
  createPet,
  updatePet,
  deletePet,
} from "../../api/pets/pet-api";

const PETS_KEY = "pets";

export const usePets = (params = {}) =>
  useQuery([PETS_KEY, params], () => fetchPets(params), {
    keepPreviousData: true,
  });

export const usePetMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(PETS_KEY);
  const onError = (error) =>
    toast.error(error?.response?.data?.message || "Something went wrong");

  const create = useMutation(createPet, {
    onSuccess: () => {
      invalidate();
      toast.success("Pet added");
    },
    onError,
  });

  const update = useMutation(updatePet, {
    onSuccess: () => {
      invalidate();
      toast.success("Pet updated");
    },
    onError,
  });

  const remove = useMutation(deletePet, {
    onSuccess: () => {
      invalidate();
      toast.success("Pet removed");
    },
    onError,
  });

  return { create, update, remove };
};
