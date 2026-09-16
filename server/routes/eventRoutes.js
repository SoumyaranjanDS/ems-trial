const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getHostedEvents,
  getOrganizerDashboardStats
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.get('/my/hosted', protect, authorize('organizer', 'admin'), getHostedEvents);
router.get('/my/stats', protect, authorize('organizer', 'admin'), getOrganizerDashboardStats);
router.get('/:id', getEventById);

router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);
router.patch('/:id/status', protect, authorize('admin'), updateEventStatus);

module.exports = router;
