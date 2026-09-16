import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  QrCode2 as QrIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { fetchMyBookings, cancelMyBooking } from '../../redux/slices/bookingSlice';
import api from '../../api/axios';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const [selectedQrBooking, setSelectedQrBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handlePayNow = async (bookingId) => {
    try {
      const res = await api.post(`/bookings/${bookingId}/create-checkout`);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else if (res.data.mock) {
        dispatch(fetchMyBookings());
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Cancel this booking?')) {
      dispatch(cancelMyBooking(bookingId));
    }
  };

  const activeBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Minimal Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
            My Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.name} • {activeBookings.length} Active Pass(es) • ₹{totalSpent.toFixed(2)} Total
          </Typography>
        </Box>
        <Button component={RouterLink} to="/events" variant="contained" sx={{ bgcolor: '#FF5018', fontWeight: 700 }}>
          Find Events
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Tickets List (No Cards, Thin Dividers) */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No Purchased Tickets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have not booked any event passes yet.
          </Typography>
          <Button component={RouterLink} to="/events" variant="contained" sx={{ bgcolor: '#111111' }}>
            Explore Events
          </Button>
        </Box>
      ) : (
        <Stack spacing={3}>
          {bookings.map((booking) => {
            const ev = booking.event || {};
            const isCancelled = booking.bookingStatus === 'cancelled';
            const isPaid = booking.paymentStatus === 'paid';

            return (
              <Box key={booking._id} sx={{ pb: 3, borderBottom: '1px solid #EBEBEB' }}>
                <Grid container spacing={3} alignItems="center">
                  {/* Photo Thumbnail */}
                  <Grid item xs={12} sm={3} md={2}>
                    <Box
                      component="img"
                      src={ev.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}
                      alt={ev.title}
                      sx={{ width: '100%', height: 95, borderRadius: 2, objectFit: 'cover' }}
                    />
                  </Grid>

                  {/* Concise Meta */}
                  <Grid item xs={12} sm={6} md={7}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: isCancelled ? '#888888' : '#111111', mb: 0.5 }}>
                      {ev.title || 'Event Title'}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ color: '#666666', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 14, color: '#FF5018' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {ev.date ? new Date(ev.date).toLocaleDateString() : ''} • {ev.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {ev.city}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={booking.ticketPassId || `EH-${booking._id.substring(0, 6).toUpperCase()}`}
                        size="small"
                        sx={{ fontWeight: 800, fontSize: 10, bgcolor: '#111111', color: '#FFFFFF' }}
                      />
                      <Chip
                        label={isCancelled ? 'CANCELLED' : isPaid ? 'CONFIRMED' : 'UNPAID'}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: 10,
                          bgcolor: isCancelled ? '#E4E4E7' : isPaid ? '#FF5018' : '#FEF3C7',
                          color: isCancelled ? '#555555' : isPaid ? '#FFFFFF' : '#D97706'
                        }}
                      />
                      {booking.isCheckedIn && (
                        <Chip label="CHECKED IN" size="small" sx={{ fontWeight: 800, fontSize: 10, bgcolor: '#10B981', color: '#FFFFFF' }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#444444' }}>
                        Qty: {booking.quantity} • Total: ₹{booking.totalAmount}
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} sm={3} md={3} sx={{ textAlign: { sm: 'right' } }}>
                    {!isCancelled ? (
                      <Stack spacing={1}>
                        {isPaid ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<QrIcon />}
                            onClick={() => setSelectedQrBooking(booking)}
                            sx={{ bgcolor: '#111111', fontWeight: 700 }}
                          >
                            QR Pass
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handlePayNow(booking._id)}
                            sx={{ bgcolor: '#FF5018', fontWeight: 700 }}
                          >
                            Pay ₹{booking.totalAmount}
                          </Button>
                        )}
                        <Button variant="text" color="error" size="small" onClick={() => handleCancel(booking._id)}>
                          Cancel
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">Cancelled</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Stack>
      )}

      {/* QR Pass Modal */}
      <Dialog open={Boolean(selectedQrBooking)} onClose={() => setSelectedQrBooking(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>Official Ticket Pass</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', py: 3 }}>
          {selectedQrBooking?.qrCode && (
            <Box
              component="img"
              src={selectedQrBooking.qrCode}
              alt="QR Code Pass"
              sx={{ width: 200, height: 200, borderRadius: 2, border: '1px solid #EBEBEB', p: 1, mb: 2 }}
            />
          )}
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{selectedQrBooking?.event?.title}</Typography>
          <Chip
            label={selectedQrBooking?.ticketPassId || `EH-${selectedQrBooking?._id?.substring(0, 6).toUpperCase()}`}
            size="small"
            sx={{ mt: 1, mb: 1, fontWeight: 800, bgcolor: '#FF5018', color: '#FFFFFF', fontSize: 12 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Pass ID: {selectedQrBooking?.ticketPassId || selectedQrBooking?._id}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tickets: {selectedQrBooking?.quantity} seat(s)
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button startIcon={<PrintIcon />} size="small" onClick={() => window.print()}>Print</Button>
          <Button onClick={() => setSelectedQrBooking(null)} variant="contained" sx={{ bgcolor: '#111111' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings;
