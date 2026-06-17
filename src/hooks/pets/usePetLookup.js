import { useMutation } from "react-query";
import { lookupPetByCode } from "../../api/pets/pet-api";

// Vet console lookup — triggered on demand (not a standing query).
export const usePetLookup = (options = {}) =>
  useMutation((code) => lookupPetByCode(code), options);
