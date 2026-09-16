import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Rating,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import api from '../../api/axios';

const ReviewSection = ({ eventId }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${eventId}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await api.post('/reviews', { eventId, rating, comment });
      setComment('');
      setSuccess('Review submitted successfully!');
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Attendee Reviews ({reviews.length})
      </Typography>

      {/* Review Form for logged in users */}
      {isAuthenticated ? (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', mb: 4, bgcolor: '#FFFFFF' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1E293B' }}>
            Leave a Review
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Rating:</Typography>
              <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} precision={1} />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your experience at this event..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Post Review
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px border #E2E8F0', mb: 4, bgcolor: '#F8FAFC' }}>
          <Typography variant="body2" color="text.secondary">
            Please log in to submit a review for this event.
          </Typography>
        </Paper>
      )}

      {/* Reviews List */}
      <Stack spacing={2.5}>
        {reviews.map((rev) => (
          <Paper key={rev._id} elevation={0} sx={{ p: 2.5, border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={rev.user?.profileImage} alt={rev.user?.name}>
                  {rev.user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {rev.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Rating value={rev.rating} precision={0.5} size="small" readOnly />
            </Box>
            <Typography variant="body2" sx={{ color: '#334155', mt: 1 }}>
              {rev.comment}
            </Typography>
          </Paper>
        ))}

        {reviews.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No reviews submitted yet. Be the first to share your thoughts!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ReviewSection;
