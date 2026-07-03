import { useMutation } from "react-query";
import { lookupPetByCode, lookupOwnerByCode } from "../../api/pets/pet-api";

// Vet console lookup — triggered on demand (not a standing query).
export const usePetLookup = (options = {}) =>
  useMutation((code) => lookupPetByCode(code), options);

// Owner Lookup console — resolve a pet owner (all pets + appointment history)
// from their shareable code. On-demand, like the pet lookup.
export const useOwnerLookup = (options = {}) =>
  useMutation((code) => lookupOwnerByCode(code), options);
