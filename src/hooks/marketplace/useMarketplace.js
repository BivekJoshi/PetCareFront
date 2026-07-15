import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  browseBusinesses,
  fetchBusinessBySlug,
  fetchMyBusiness,
  updateMyBusiness,
  submitMyBusiness,
  adminListBusinesses,
  moderateBusiness,
  fetchSaved,
  addSaved,
  removeSaved,
  browseOffers,
  fetchOffer,
  fetchMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  redeemOffer,
  fetchMyRedemptions,
  fetchBusinessReviews,
  createReview,
  fetchMyReviews,
  replyToReview,
  moderateReview,
} from "../../api/marketplace/marketplace-api";

const KEY = "marketplace";
const onError = (error) =>
  toast.error(error?.response?.data?.message || "Something went wrong");

// ── Categories ─────────────────────────────────────────────
export const useCategories = (params = {}) =>
  useQuery([KEY, "categories", params], () => fetchCategories(params), {
    staleTime: 60_000,
  });

export const useCategoryMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries([KEY, "categories"]);
  const create = useMutation(createCategory, {
    onSuccess: () => { invalidate(); toast.success("Category created"); },
    onError,
  });
  const update = useMutation(updateCategory, {
    onSuccess: () => { invalidate(); toast.success("Category updated"); },
    onError,
  });
  const remove = useMutation(deleteCategory, {
    onSuccess: () => { invalidate(); toast.success("Category deleted"); },
    onError,
  });
  return { create, update, remove };
};

// ── Businesses (discovery) ─────────────────────────────────
export const useBusinesses = (filters = {}) =>
  useQuery([KEY, "businesses", filters], () => browseBusinesses(filters), {
    keepPreviousData: true,
  });

export const useBusinessBySlug = (slug) =>
  useQuery([KEY, "business", slug], () => fetchBusinessBySlug(slug), {
    enabled: Boolean(slug),
  });

// ── Businesses (partner) ───────────────────────────────────
export const useMyBusiness = (options = {}) =>
  useQuery([KEY, "myBusiness"], fetchMyBusiness, { retry: false, ...options });

export const useMyBusinessMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries([KEY, "myBusiness"]);
  const update = useMutation(updateMyBusiness, {
    onSuccess: () => { invalidate(); toast.success("Listing saved"); },
    onError,
  });
  const submit = useMutation(submitMyBusiness, {
    onSuccess: () => { invalidate(); toast.success("Submitted for review"); },
    onError,
  });
  return { update, submit };
};

// ── Businesses (admin) ─────────────────────────────────────
export const useAdminBusinesses = (params = {}) =>
  useQuery([KEY, "adminBusinesses", params], () => adminListBusinesses(params), {
    keepPreviousData: true,
  });

export const useModerateBusiness = () => {
  const qc = useQueryClient();
  return useMutation(moderateBusiness, {
    onSuccess: () => {
      qc.invalidateQueries([KEY, "adminBusinesses"]);
      toast.success("Listing updated");
    },
    onError,
  });
};

// ── Saved ──────────────────────────────────────────────────
export const useSaved = (options = {}) => useQuery([KEY, "saved"], fetchSaved, options);

export const useSavedMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries([KEY, "saved"]);
  const add = useMutation(addSaved, { onSuccess: () => { invalidate(); toast.success("Saved"); }, onError });
  const remove = useMutation(removeSaved, { onSuccess: () => { invalidate(); }, onError });
  return { add, remove };
};

// ── Offers ─────────────────────────────────────────────────
export const useOffers = (params = {}) =>
  useQuery([KEY, "offers", params], () => browseOffers(params), { keepPreviousData: true });

export const useOffer = (id) =>
  useQuery([KEY, "offer", id], () => fetchOffer(id), { enabled: Boolean(id) });

export const useMyOffers = () => useQuery([KEY, "myOffers"], fetchMyOffers);

export const useMyRedemptions = () => useQuery([KEY, "redemptions"], fetchMyRedemptions);

export const useOfferMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries([KEY, "myOffers"]);
  const create = useMutation(createOffer, {
    onSuccess: () => { invalidate(); toast.success("Offer created"); },
    onError,
  });
  const update = useMutation(updateOffer, {
    onSuccess: () => { invalidate(); toast.success("Offer updated"); },
    onError,
  });
  const remove = useMutation(deleteOffer, {
    onSuccess: () => { invalidate(); toast.success("Offer deleted"); },
    onError,
  });
  const redeem = useMutation(redeemOffer, {
    onSuccess: () => { qc.invalidateQueries([KEY, "redemptions"]); },
    onError,
  });
  return { create, update, remove, redeem };
};

// ── Reviews ────────────────────────────────────────────────
export const useBusinessReviews = (businessId, params = {}) =>
  useQuery([KEY, "reviews", businessId, params], () => fetchBusinessReviews(businessId, params), {
    enabled: Boolean(businessId),
  });

export const useMyReviews = () => useQuery([KEY, "myReviews"], fetchMyReviews);

export const useReviewMutations = () => {
  const qc = useQueryClient();
  const create = useMutation(createReview, {
    onSuccess: (_d, vars) => {
      qc.invalidateQueries([KEY, "reviews", vars.businessId]);
      qc.invalidateQueries([KEY, "business"]);
      toast.success("Review posted");
    },
    onError,
  });
  const reply = useMutation(replyToReview, {
    onSuccess: () => { qc.invalidateQueries([KEY, "myReviews"]); toast.success("Reply saved"); },
    onError,
  });
  const moderate = useMutation(moderateReview, {
    onSuccess: () => { qc.invalidateQueries([KEY]); toast.success("Review updated"); },
    onError,
  });
  return { create, reply, moderate };
};
