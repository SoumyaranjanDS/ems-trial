const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events with filters (search, category, city, date, pagination)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { search, category, city, date, page = 1, limit = 9, status = 'approved' } = req.query;

    const query = {};

    if (req.user && req.user.role === 'admin' && req.query.includePending === 'true') {
      // Allow fetching all statuses
    } else {
      query.status = 'approved';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email profileImage')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email profileImage');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer / Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, category, banner, location, city, date, time, price, capacity } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      banner: banner || undefined,
      location,
      city,
      date,
      time,
      price: Number(price),
      capacity: Number(capacity),
      availableSeats: Number(capacity),
      organizer: req.user.id,
      status: 'approved'
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Owner Organizer / Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Owner Organizer / Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Reject event status
// @route   PATCH /api/events/:id/status
// @access  Private (Admin)
exports.updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events created by logged-in organizer
// @route   GET /api/events/my/hosted
// @access  Private (Organizer / Admin)
exports.getHostedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete real-time dashboard analytics for organizer
// @route   GET /api/events/my/stats
// @access  Private (Organizer / Admin)
exports.getOrganizerDashboardStats = async (req, res, next) => {
  try {
    const myEvents = await Event.find({ organizer: req.user.id });
    const eventIds = myEvents.map((e) => e._id);

    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email profileImage')
      .populate('event', 'title date price location city')
      .sort({ createdAt: -1 });

    const totalEvents = myEvents.length;
    const paidBookings = bookings.filter((b) => b.paymentStatus === 'paid');

    const totalSeatsSold = paidBookings.reduce((acc, b) => acc + (b.quantity || 1), 0);
    const totalRevenue = paidBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
    const totalCheckedIn = paidBookings.filter((b) => b.isCheckedIn).length;

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalSeatsSold,
        totalRevenue,
        totalCheckedIn,
        totalBookingsCount: bookings.length
      },
      events: myEvents,
      recentBookings: bookings.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};
