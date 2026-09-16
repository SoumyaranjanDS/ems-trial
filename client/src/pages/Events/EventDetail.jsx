import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';
import { fetchEventById, updateSeatCount } from '../../redux/slices/eventSlice';
import ReviewSection from '../../components/events/ReviewSection';
import api from '../../api/axios';



const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedEvent, loading } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch Event Details
  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  // Real-time Socket.IO Seat Availability Updates
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });

    socket.on('seatAvailabilityUpdated', (data) => {
      if (data.eventId === id) {
        dispatch(updateSeatCount(data));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, dispatch]);

  if (loading || !selectedEvent) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const formattedDate = new Date(selectedEvent.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const availableSeats = selectedEvent.availableSeats;
  const capacity = selectedEvent.capacity;
  const percentSeatsLeft = Math.round((availableSeats / capacity) * 100);
  const isSoldOut = availableSeats <= 0;

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }
    setBookingDialogOpen(true);
  };

  const handleSimulatedPayment = async () => {
    setBookingLoading(true);
    setBookingError(null);

    try {
      // 1. Create Payment Session
      const res = await api.post('/bookings/create-payment-session', {
        eventId: selectedEvent._id,
        quantity
      });

      if (res.data.isFree) {
        // Free ticket - create booking directly
        const freeRes = await api.post('/bookings', {
          eventId: selectedEvent._id,
          quantity
        });
        setBookingLoading(false);
        setBookingDialogOpen(false);
        if (freeRes.data.success) {
          navigate('/bookings/my');
        }
        return;
      }

      // 2. Simulate Payment Delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Verify Simulated Payment
      const verifyRes = await api.post('/bookings/verify-payment-session', {
        eventId: selectedEvent._id,
        quantity,
        orderId: res.data.orderId
      });

      if (verifyRes.data.success) {
        setBookingDialogOpen(false);
        navigate('/bookings/my');
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Banner */}
      <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', mb: 4, maxHeight: 420 }}>
        <Box
          component="img"
          src={selectedEvent.banner}
          alt={selectedEvent.title}
          sx={{ width: '100%', height: 420, objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)',
            display: 'flex',
            alignItems: 'flex-end',
            p: { xs: 3, md: 5 }
          }}
        >
          <Box color="#FFFFFF">
            <Chip label={selectedEvent.category} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700, bgcolor: '#FF5018', color: '#FFFFFF' }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.2 }}>
              {selectedEvent.title}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #E2E8F0', mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              About This Event
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', mb: 4 }}>
              {selectedEvent.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Event Info Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#FFF7F4', color: '#FF5018' }}>
                    <CalendarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      DATE & TIME
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formattedDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.time}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#F1F5F9', color: '#111111' }}>
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      LOCATION
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {selectedEvent.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.city}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Organizer Card */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              ORGANIZED BY
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
              <Avatar src={selectedEvent.organizer?.profileImage} sx={{ width: 48, height: 48, bgcolor: '#FF5018' }}>
                {selectedEvent.organizer?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {selectedEvent.organizer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified Event Host on EventHub
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Reviews */}
          <ReviewSection eventId={selectedEvent._id} />
        </Grid>

        {/* Ticket Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 3, position: 'sticky', top: 90 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              {selectedEvent.price === 0 ? 'Free Entry' : `₹${selectedEvent.price}`}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                / ticket
              </Typography>
            </Typography>

            {/* Live Seat Availability Gauge */}
            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                  SEAT AVAILABILITY
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: isSoldOut ? '#DC2626' : '#059669' }}>
                  {isSoldOut ? 'Sold Out' : `${availableSeats} of ${capacity} left`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentSeatsLeft}
                color={isSoldOut ? 'error' : percentSeatsLeft < 20 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                ⚡ Seats update live via Socket.IO
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={isSoldOut}
              onClick={handleOpenBooking}
              startIcon={<TicketIcon />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                mb: 2,
                bgcolor: '#FF5018',
                color: '#FFFFFF',
                borderRadius: '100px',
                '&:hover': { bgcolor: '#E04000' }
              }}
            >
              {isSoldOut ? 'Event Sold Out' : 'Book Tickets Now'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Simulated Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Ticket Booking</DialogTitle>
        <DialogContent dividers>
          {bookingError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{bookingError}</Alert>}

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {selectedEvent.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Price per ticket: ₹{selectedEvent.price}
          </Typography>

          <TextField
            label="Number of Tickets"
            type="number"
            fullWidth
            size="small"
            inputProps={{ min: 1, max: Math.min(10, availableSeats) }}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            sx={{ mb: 3 }}
          />

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#FAF8F5', border: '1px solid #EBEBEB', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FF5018' }}>
                ₹{(selectedEvent.price * quantity).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setBookingDialogOpen(false)} variant="text" color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={bookingLoading}
            onClick={handleSimulatedPayment}
            sx={{ bgcolor: '#FF5018', color: '#FFFFFF', fontWeight: 700, borderRadius: '100px' }}
          >
            {bookingLoading ? 'Processing Payment...' : 'Pay Securely'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetail;
