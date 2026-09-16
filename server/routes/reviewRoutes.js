const express = require('express');
const { addReview, getEventReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:eventId', getEventReviews);

module.exports = router;
