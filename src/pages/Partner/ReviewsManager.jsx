import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import QueryState from "../../components/common/QueryState";
import { useMyReviews, useReviewMutations } from "../../hooks/marketplace/useMarketplace";
import { MK } from "../../theme/marketplaceTokens";
import NoStorefront, { isNoStorefront } from "./NoStorefront";

const ReviewRow = ({ review, onReply, submitting }) => {
  const [reply, setReply] = useState("");
  const answered = Boolean(review.reply);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        borderLeft: answered ? undefined : `3px solid ${MK.amber}`,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Avatar sx={{ width: 30, height: 30, fontSize: 13 }}>{review.author?.firstName?.[0]}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {review.author?.firstName} {review.author?.lastName?.[0]}.
          </Typography>
          <Rating value={review.rating} readOnly size="small" />
        </Box>
        {!answered && <Chip size="small" color="warning" label="Needs response" />}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {review.text}
      </Typography>

      {answered ? (
        <Box sx={{ bgcolor: MK.bg2, borderRadius: 2, p: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            YOUR REPLY
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {review.reply}
          </Typography>
        </Box>
      ) : (
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            fullWidth
            size="small"
            multiline
            placeholder="Write a public reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => onReply(review.id, reply, () => setReply(""))}
            disabled={reply.trim().length < 1 || submitting}
          >
            Reply
          </Button>
        </Stack>
      )}
    </Paper>
  );
};

const ReviewsManager = () => {
  const query = useMyReviews();
  const { reply } = useReviewMutations();
  const reviews = query.data?.items ?? [];
  const noBusiness = isNoStorefront(query);

  const onReply = (id, text, done) => {
    reply.mutate({ id, reply: text }, { onSuccess: done });
  };

  return (
    <Box>
      <PageHeader title="Reviews" subtitle="Respond to customer feedback on your storefront." />
      {noBusiness ? (
        <NoStorefront />
      ) : (
        <QueryState query={query} isEmpty={reviews.length === 0} emptyMessage="No reviews yet.">
          <Stack spacing={1.5}>
            {reviews.map((r) => (
              <ReviewRow key={r.id} review={r} onReply={onReply} submitting={reply.isLoading} />
            ))}
          </Stack>
        </QueryState>
      )}
    </Box>
  );
};

export default ReviewsManager;
