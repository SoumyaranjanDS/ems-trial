
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { generateQRCode } = require('../services/qrService');



// Generate structured Ticket Pass ID e.g. EH-TECH-X8B9
const generateTicketPassId = (category) => {
  const catClean = (category || 'EVENT')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase() || 'PASS';
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EH-${catClean}-${rand}`;
};

// @desc    Create a free booking directly (Amount = 0)
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const numTickets = parseInt(quantity, 10) || 1;

    if (numTickets <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid ticket quantity' });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: numTickets }, status: 'approved' },
      { $inc: { availableSeats: -numTickets } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Booking failed: Event is sold out or not enough seats remaining'
      });
    }

    const totalAmount = updatedEvent.price * numTickets;
    const ticketPassId = generateTicketPassId(updatedEvent.category);

    const booking = await Booking.create({
      ticketPassId,
      user: req.user.id,
      event: eventId,
      quantity: numTickets,
      totalAmount,
      paymentStatus: updatedEvent.price === 0 ? 'paid' : 'pending',
      bookingStatus: 'confirmed'
    });

    const qrPayload = JSON.stringify({
      ticketPassId: booking.ticketPassId,
      bookingId: booking._id,
      userId: req.user.id,
      eventId: updatedEvent._id,
      tickets: numTickets
    });
    const qrCode = await generateQRCode(qrPayload);

    booking.qrCode = qrCode;
    await booking.save();



    if (req.app.get('io')) {
      req.app.get('io').emit('seatAvailabilityUpdated', {
        eventId: updatedEvent._id,
        availableSeats: updatedEvent.availableSeats
      });
    }

    res.status(201).json({
      success: true,
      booking,
      event: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Payment Session (Simulation)
// @route   POST /api/bookings/create-payment-session
// @access  Private
exports.createPaymentSession = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const numTickets = parseInt(quantity, 10) || 1;

    const targetEvent = await Event.findById(eventId);
    if (!targetEvent || targetEvent.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Event not found or not approved' });
    }

    if (targetEvent.availableSeats < numTickets) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const totalAmountINR = targetEvent.price * numTickets;
    
    if (totalAmountINR === 0) {
      return res.status(200).json({
        success: true,
        isFree: true,
        amount: 0,
        currency: 'INR'
      });
    }

    // Simulate order creation
    const order = {
      id: `order_mock_${Date.now()}`,
      amount: totalAmountINR * 100, // paise
      currency: 'INR'
    };

    res.status(200).json({
      success: true,
      isFree: false,
      orderId: order.id,
      amount: order.amount,
      currency: 'INR',
      eventTitle: targetEvent.title,
      userName: req.user.name,
      userEmail: req.user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment Session (Simulation) & Atomically Complete Booking
// @route   POST /api/bookings/verify-payment-session
// @access  Private
exports.verifyPaymentSession = async (req, res, next) => {
  try {
    const {
      eventId,
      quantity,
      orderId
    } = req.body;

    const numTickets = parseInt(quantity, 10) || 1;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: numTickets }, status: 'approved' },
      { $inc: { availableSeats: -numTickets } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Payment verified, but event sold out before seat confirmation'
      });
    }

    const totalAmount = updatedEvent.price * numTickets;
    const ticketPassId = generateTicketPassId(updatedEvent.category);

    const booking = await Booking.create({
      ticketPassId,
      user: req.user.id,
      event: eventId,
      quantity: numTickets,
      totalAmount,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentIntentId: orderId || `mock_intent_${Date.now()}`
    });

    const qrPayload = JSON.stringify({
      ticketPassId: booking.ticketPassId,
      bookingId: booking._id,
      userId: req.user.id,
      eventId: updatedEvent._id,
      tickets: numTickets
    });
    const qrCode = await generateQRCode(qrPayload);

    booking.qrCode = qrCode;
    await booking.save();

    if (req.app.get('io')) {
      req.app.get('io').emit('seatAvailabilityUpdated', {
        eventId: updatedEvent._id,
        availableSeats: updatedEvent.availableSeats
      });
    }

    res.status(200).json({
      success: true,
      booking,
      event: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings (with lazy ticketPassId generation)
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });

    // Ensure legacy bookings have a ticketPassId
    for (let b of bookings) {
      if (!b.ticketPassId) {
        b.ticketPassId = generateTicketPassId(b.event?.category);
        await b.save();
      }
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or ticketPassId
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const key = req.params.id;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(key);

    const booking = await Booking.findOne({
      $or: [{ _id: isMongoId ? key : null }, { ticketPassId: key }]
    })
      .populate('event')
      .populate('user', 'name email profileImage');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: booking.quantity }
    });

    if (req.app.get('io')) {
      const eventObj = await Event.findById(booking.event);
      if (eventObj) {
        req.app.get('io').emit('seatAvailabilityUpdated', {
          eventId: eventObj._id,
          availableSeats: eventObj.availableSeats
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and seats released'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Flexible Check-in via Camera QR scan OR Ticket Pass ID / Mongo ID
// @route   POST /api/bookings/checkin
// @access  Private (Organizer / Admin)
exports.checkInBooking = async (req, res, next) => {
  try {
    let rawCode = req.body.code || req.body.ticketPassId || req.params.id;
    if (!rawCode) {
      return res.status(400).json({ success: false, message: 'No ticket code provided' });
    }

    let searchPassId = rawCode.trim();
    let searchBookingId = null;

    // Try parsing raw JSON from camera QR scan
    if (searchPassId.startsWith('{') && searchPassId.endsWith('}')) {
      try {
        const parsedPayload = JSON.parse(searchPassId);
        searchPassId = parsedPayload.ticketPassId || searchPassId;
        searchBookingId = parsedPayload.bookingId || null;
      } catch (e) {}
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(searchPassId) || /^[0-9a-fA-F]{24}$/.test(searchBookingId);
    const targetMongoId = /^[0-9a-fA-F]{24}$/.test(searchPassId) ? searchPassId : searchBookingId;

    const booking = await Booking.findOne({
      $or: [
        { ticketPassId: searchPassId },
        { _id: targetMongoId || null }
      ]
    })
      .populate('event')
      .populate('user', 'name email profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Invalid Ticket Pass Code: "${searchPassId}"`
      });
    }

    if (booking.isCheckedIn) {
      const checkedInTimeStr = booking.checkedInAt ? new Date(booking.checkedInAt).toLocaleTimeString() : '';
      return res.status(400).json({
        success: false,
        message: `ALREADY CHECKED IN! Ticket pass ${booking.ticketPassId || booking._id} was scanned earlier today ${checkedInTimeStr ? `at ${checkedInTimeStr}` : ''}`,
        alreadyCheckedIn: true,
        booking
      });
    }

    booking.isCheckedIn = true;
    booking.checkedInAt = new Date();
    await booking.save();

    if (req.app.get('io')) {
      req.app.get('io').emit('seatAvailabilityUpdated', {
        eventId: booking.event?._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'VALID TICKET PASS! Entry Granted',
      booking
    });
  } catch (error) {
    next(error);
  }
};
