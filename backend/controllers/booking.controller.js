import Booking from "../model/booking.js";
import Event from "../model/event.js";
import Ticket from "../model/ticket.js";
import crypto from "crypto";
export const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookingsCount = await Booking.countDocuments({ event: eventId });
    if (bookingsCount >= event.capacity) {
      return res.status(400).json({ message: "This event is sold out" });
    }

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      organizer: event.organizer
    });

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const ticketId = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const ticket = await Ticket.create({
      booking: booking._id,
      ticketId
    });

    return res.status(201).json({
      message: "Booking confirmed successfully",
      booking,
      ticket
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await Booking.find({ user: userId }).populate("event");

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};
