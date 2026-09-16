const Review = require('../models/Review');
const Event = require('../models/Event');

// @desc    Add review for an event
// @route   POST /api/reviews
// @access  Private (Attendee)
exports.addReview = async (req, res, next) => {
  try {
    const { eventId, rating, comment } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const existingReview = await Review.findOne({ event: eventId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this event' });
    }

    const review = await Review.create({
      user: req.user.id,
      event: eventId,
      rating: Number(rating),
      comment
    });

    // Recalculate average rating
    const reviews = await Review.find({ event: eventId });
    const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    event.averageRating = Number(avg.toFixed(1));
    event.numReviews = reviews.length;
    await event.save();

    res.status(201).json({ success: true, review, averageRating: event.averageRating });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for an event
// @route   GET /api/reviews/:eventId
// @access  Public
exports.getEventReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
