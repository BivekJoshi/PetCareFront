import { useMutation } from "react-query";
import { resolveMapLink } from "../../api/geo/geo-api";

// Resolves a pasted Google Maps link to coordinates. Errors are surfaced by the
// caller (the picker shows them inline), so no global toast here.
export const useResolveMapLink = () => useMutation(resolveMapLink);
