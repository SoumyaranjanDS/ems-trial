const express = require('express');
const {
  createBooking,
  createPaymentSession,
  verifyPaymentSession,
  getMyBookings,
  getBookingById,
  cancelBooking,
  checkInBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.post('/create-payment-session', protect, createPaymentSession);
router.post('/verify-payment-session', protect, verifyPaymentSession);
router.get('/my', protect, getMyBookings);
router.post('/checkin', protect, authorize('organizer', 'admin'), checkInBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/checkin', protect, authorize('organizer', 'admin'), checkInBooking);

module.exports = router;
