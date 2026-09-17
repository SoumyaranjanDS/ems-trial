import mongoose from "mongoose";
import Event from "../model/event.js";
import Booking from "../model/booking.js";

const handelCreateEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, capacity, price, image } =
      req.body;

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      !category ||
      !capacity ||
      !price ||
      !image
    )
      return res.status(400).json({
        message: "Please enter all the fields",
      });

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      capacity,
      price,
      image,
      organizer: req.user.id,
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const handelGetAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: {
        $gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const handelGetEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookingsCount = await Booking.countDocuments({ event: id });
    const remainingCapacity = event.capacity - bookingsCount;

    return res.status(200).json({
      message: "Event fetched successfully",
      event,
      remainingCapacity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const handelGetMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    return res.status(200).json({
      message: "My events fetched successfully",
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const handelDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, organizer: req.user.id });
    if (!event) {
      return res.status(404).json({
        message: "Event not found or you are not authorized to delete it",
      });
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  handelCreateEvent,
  handelGetAllEvents,
  handelGetEventById,
  handelGetMyEvents,
  handelDeleteEvent,
};
