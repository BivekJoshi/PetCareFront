import { axiosInstance } from "../axiosInterceptor";

const unwrap = (res) => res.data?.data;

// ── Categories ─────────────────────────────────────────────
export const fetchCategories = (params) =>
  axiosInstance.get("/marketplace/categories", { params }).then(unwrap);
export const createCategory = (payload) =>
  axiosInstance.post("/marketplace/categories", payload).then(unwrap);
export const updateCategory = ({ id, ...payload }) =>
  axiosInstance.patch(`/marketplace/categories/${id}`, payload).then(unwrap);
export const deleteCategory = (id) =>
  axiosInstance.delete(`/marketplace/categories/${id}`).then(unwrap);

// ── Businesses (customer discovery) ────────────────────────
// Browse uses the HTTP QUERY method — body-filtered, safe/idempotent read.
export const browseBusinesses = (payload) =>
  axiosInstance.request({ url: "/marketplace/businesses", method: "QUERY", data: payload }).then(unwrap);
export const fetchBusinessBySlug = (slug) =>
  axiosInstance.get(`/marketplace/businesses/${encodeURIComponent(slug)}`).then(unwrap);

// ── Businesses (partner's own storefront) ──────────────────
export const fetchMyBusiness = () =>
  axiosInstance.get("/marketplace/businesses/me").then(unwrap);
export const updateMyBusiness = (payload) =>
  axiosInstance.patch("/marketplace/businesses/me", payload).then(unwrap);
export const submitMyBusiness = () =>
  axiosInstance.post("/marketplace/businesses/me/submit").then(unwrap);

// ── Businesses (admin moderation) ──────────────────────────
export const adminListBusinesses = (params) =>
  axiosInstance.get("/marketplace/admin/businesses", { params }).then(unwrap);
export const moderateBusiness = ({ id, status }) =>
  axiosInstance.patch(`/marketplace/admin/businesses/${id}/moderate`, { status }).then(unwrap);

// ── Media upload (logo / cover / photo) ────────────────────
export const uploadBusinessImage = (file) => {
  const form = new FormData();
  form.append("image", file);
  return axiosInstance
    .post("/marketplace/media", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then(unwrap);
};

// ── Saved / bookmarks ──────────────────────────────────────
export const fetchSaved = () => axiosInstance.get("/marketplace/saved").then(unwrap);
export const addSaved = (businessId) =>
  axiosInstance.post("/marketplace/saved", { businessId }).then(unwrap);
export const removeSaved = (businessId) =>
  axiosInstance.delete(`/marketplace/saved/${businessId}`).then(unwrap);

// ── Offers ─────────────────────────────────────────────────
export const browseOffers = (params) =>
  axiosInstance.get("/marketplace/offers", { params }).then(unwrap);
export const fetchOffer = (id) => axiosInstance.get(`/marketplace/offers/${id}`).then(unwrap);
export const fetchMyOffers = () => axiosInstance.get("/marketplace/offers/mine").then(unwrap);
export const createOffer = (payload) =>
  axiosInstance.post("/marketplace/offers", payload).then(unwrap);
export const updateOffer = ({ id, ...payload }) =>
  axiosInstance.patch(`/marketplace/offers/${id}`, payload).then(unwrap);
export const deleteOffer = (id) => axiosInstance.delete(`/marketplace/offers/${id}`).then(unwrap);
export const redeemOffer = (id) =>
  axiosInstance.post(`/marketplace/offers/${id}/redeem`).then(unwrap);
export const fetchMyRedemptions = () =>
  axiosInstance.get("/marketplace/offers/redemptions").then(unwrap);

// ── Reviews ────────────────────────────────────────────────
export const fetchBusinessReviews = (businessId, params) =>
  axiosInstance.get(`/marketplace/businesses/${businessId}/reviews`, { params }).then(unwrap);
export const createReview = ({ businessId, ...payload }) =>
  axiosInstance.post(`/marketplace/businesses/${businessId}/reviews`, payload).then(unwrap);
export const fetchMyReviews = () => axiosInstance.get("/marketplace/reviews/mine").then(unwrap);
export const replyToReview = ({ id, reply }) =>
  axiosInstance.post(`/marketplace/reviews/${id}/reply`, { reply }).then(unwrap);
export const moderateReview = ({ id, status }) =>
  axiosInstance.patch(`/marketplace/admin/reviews/${id}/moderate`, { status }).then(unwrap);

// ── Enquiries ──────────────────────────────────────────────
export const fetchEnquiries = (box) =>
  axiosInstance.get("/marketplace/enquiries", { params: { box } }).then(unwrap);
export const startEnquiry = ({ businessId, ...payload }) =>
  axiosInstance.post(`/marketplace/businesses/${businessId}/enquiries`, payload).then(unwrap);
export const fetchEnquiryMessages = (id) =>
  axiosInstance.get(`/marketplace/enquiries/${id}/messages`).then(unwrap);
export const postEnquiryMessage = ({ id, body }) =>
  axiosInstance.post(`/marketplace/enquiries/${id}/messages`, { body }).then(unwrap);
