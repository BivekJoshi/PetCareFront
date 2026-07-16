import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DirectionsRoundedIcon from "@mui/icons-material/DirectionsRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import {
  useBusinessBySlug,
  useSaved,
  useSavedMutations,
  useOfferMutations,
  useReviewMutations,
} from "../../hooks/marketplace/useMarketplace";
import { useEnquiryMutations } from "../../hooks/marketplace/useEnquiries";
import { BusinessLogo, VerifiedBadge, RatingRow, StatTile, colorFor } from "./marketplaceUi";
import { MK } from "../../theme/marketplaceTokens";

const ActionButton = ({ icon, label, href, onClick, primary }) => (
  <Button
    component={href ? "a" : "button"}
    href={href}
    target={href && href.startsWith("http") ? "_blank" : undefined}
    onClick={onClick}
    variant={primary ? "contained" : "outlined"}
    sx={{
      flex: 1,
      minWidth: 0,
      flexDirection: "column",
      gap: 0.5,
      py: 1,
      borderColor: "divider",
      color: primary ? "#fff" : "text.primary",
    }}
  >
    {icon}
    <Typography variant="caption" sx={{ fontWeight: 600 }}>
      {label}
    </Typography>
  </Button>
);

const RedeemDialog = ({ open, onClose, result }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700 }}>Your promo code</DialogTitle>
    <DialogContent>
      <Box
        sx={{
          background: MK.voucher,
          color: "#fff",
          borderRadius: 3,
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: "0.08em" }}>
          PROMO CODE
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {result?.code}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          {result?.title} · {result?.business?.name}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
        Show this code at {result?.business?.name} to redeem.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained">
        Done
      </Button>
    </DialogActions>
  </Dialog>
);

const BusinessDetailView = ({ slug, interactive = true, onBack }) => {
  const navigate = useNavigate();
  const query = useBusinessBySlug(slug);
  const business = query.data;

  const saved = useSaved({ enabled: interactive });
  const { add, remove } = useSavedMutations();
  const { redeem } = useOfferMutations();
  const { create: createReview } = useReviewMutations();
  const { start: startEnquiry } = useEnquiryMutations();

  const [redeemResult, setRedeemResult] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryText, setEnquiryText] = useState("");

  if (query.isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (query.isError || !business) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        This business could not be found.
      </Alert>
    );
  }

  const isSaved = (saved.data?.items || saved.data || []).some?.((b) => b.id === business.id);
  const activeOffer = business.offers?.[0];
  const coverColor = business.primaryCategory?.color || colorFor(business.name);
  const mapsHref =
    business.latitude != null && business.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`
      : null;

  const doRedeem = () => {
    if (!activeOffer) return;
    redeem.mutate(activeOffer.id, { onSuccess: (res) => setRedeemResult(res) });
  };

  const submitReview = () => {
    createReview.mutate(
      { businessId: business.id, rating, text: reviewText },
      {
        onSuccess: () => {
          setReviewOpen(false);
          setReviewText("");
          query.refetch();
        },
      },
    );
  };

  const submitEnquiry = () => {
    startEnquiry.mutate(
      { businessId: business.id, subject: `Enquiry · ${business.name}`, body: enquiryText },
      {
        onSuccess: () => {
          setEnquiryOpen(false);
          setEnquiryText("");
        },
      },
    );
  };

  return (
    <Box>
      {/* Cover + logo */}
      <Box sx={{ position: "relative", mb: 5 }}>
        <Box
          sx={{
            height: 140,
            borderRadius: 3,
            background: business.coverUrl
              ? `url(${business.coverUrl}) center/cover`
              : `linear-gradient(135deg, ${coverColor} 0%, ${MK.brandDeep} 100%)`,
          }}
        />
        {(interactive || onBack) && (
          <IconButton
            onClick={onBack || (() => navigate(-1))}
            sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}
            size="small"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
        )}
        {interactive && (
          <IconButton
            onClick={() => (isSaved ? remove.mutate(business.id) : add.mutate(business.id))}
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}
            size="small"
          >
            {isSaved ? <BookmarkRoundedIcon color="primary" /> : <BookmarkBorderRoundedIcon />}
          </IconButton>
        )}
        <Box sx={{ position: "absolute", bottom: -32, left: 16 }}>
          <Avatar variant="rounded" sx={{ width: 76, height: 76, borderRadius: 3, bgcolor: "#fff", p: 0.75 }}>
            <BusinessLogo business={business} size={64} radius={12} />
          </Avatar>
        </Box>
      </Box>

      {/* Identity */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {business.name}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {business.primaryCategory?.label}
        {business.secondaryTag ? ` · ${business.secondaryTag}` : ""}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        {business.isVerified && <VerifiedBadge />}
        {business.yearsOnPlatform ? (
          <Chip size="small" label={`${business.yearsOnPlatform} yrs on platform`} variant="outlined" />
        ) : null}
      </Stack>

      {/* Rating / reviews / trust strip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          py: 1.5,
          mb: 2,
        }}
      >
        <StatTile
          value={Number(business.ratingAvg || 0).toFixed(1)}
          label="rating"
          sub={<Rating value={Number(business.ratingAvg) || 0} precision={0.1} readOnly size="small" />}
        />
        <Divider orientation="vertical" flexItem />
        <StatTile value={business.ratingCount} label="reviews" />
        <Divider orientation="vertical" flexItem />
        <StatTile
          value={business.isVerified ? "KYB" : "New"}
          label={business.yearsOnPlatform ? `${business.yearsOnPlatform} yrs here` : "on platform"}
          sub={business.isVerified ? <VerifiedRoundedIcon sx={{ fontSize: 14, color: MK.green }} /> : null}
        />
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <ActionButton icon={<PhoneRoundedIcon />} label="Call" href={business.phone ? `tel:${business.phone}` : undefined} primary />
        <ActionButton icon={<WhatsAppIcon />} label="WhatsApp" href={business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}` : undefined} />
        <ActionButton icon={<LanguageRoundedIcon />} label="Website" href={business.website || undefined} />
        <ActionButton icon={<DirectionsRoundedIcon />} label="Directions" href={mapsHref || undefined} />
      </Stack>

      {/* Active offer */}
      {activeOffer && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.75,
            mb: 3,
            border: `1px dashed ${MK.brand}`,
            bgcolor: MK.brandTint,
            borderRadius: 3,
          }}
        >
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: MK.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LocalOfferOutlinedIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {activeOffer.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Code{" "}
              <Box component="span" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                {activeOffer.code}
              </Box>
            </Typography>
          </Box>
          {interactive && (
            <Button variant="contained" size="small" onClick={doRedeem} disabled={redeem.isLoading}>
              Redeem
            </Button>
          )}
        </Box>
      )}

      {/* About */}
      {business.description && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            About
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {business.description}
          </Typography>
        </Box>
      )}

      {/* Services */}
      {business.services?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Services & pricing
          </Typography>
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
            {business.services.map((s, i) => (
              <Box
                key={s.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  borderTop: i ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2">{s.name}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {s.priceLabel || (s.priceCents != null ? `$${(s.priceCents / 100).toFixed(2)}` : "")}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Reviews */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Reviews
          </Typography>
          {interactive && (
            <Button size="small" onClick={() => setReviewOpen(true)}>
              Write a review
            </Button>
          )}
        </Box>
        {business.recentReviews?.length ? (
          <Stack spacing={1.5}>
            {business.recentReviews.map((r) => (
              <Box key={r.id} sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>{r.author?.firstName?.[0]}</Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {r.author?.firstName} {r.author?.lastName?.[0]}.
                  </Typography>
                  <Rating value={r.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {r.text}
                </Typography>
                {r.reply && (
                  <Box sx={{ mt: 1, ml: 2, p: 1.25, bgcolor: MK.bg2, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      Response from {business.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.reply}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No reviews yet.
          </Typography>
        )}
      </Box>

      {/* Message the business */}
      {interactive && (
        <Button fullWidth variant="outlined" startIcon={<ChatRoundedIcon />} onClick={() => setEnquiryOpen(true)}>
          Message {business.name}
        </Button>
      )}

      {!interactive && (
        <Button fullWidth variant="contained" onClick={() => navigate("/login")}>
          Open in the app to contact
        </Button>
      )}

      <RedeemDialog open={Boolean(redeemResult)} onClose={() => setRedeemResult(null)} result={redeemResult} />

      {/* Write review dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Rate {business.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
            <Rating value={rating} onChange={(_e, v) => setRating(v || 1)} size="large" />
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Share your experience…"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitReview} disabled={reviewText.trim().length < 3 || createReview.isLoading}>
            Post review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enquiry dialog */}
      <Dialog open={enquiryOpen} onClose={() => setEnquiryOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Message {business.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Ask a question or request a quote…"
            value={enquiryText}
            onChange={(e) => setEnquiryText(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnquiryOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEnquiry} disabled={enquiryText.trim().length < 1 || startEnquiry.isLoading}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessDetailView;
