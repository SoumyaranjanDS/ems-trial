import Ticket from "../model/ticket.js";

export const verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId }).populate({
      path: "booking",
      populate: [
        {
          path: "user",
          select: "name email",
        },
        {
          path: "event",
          populate: {
            path: "organizer",
            select: "name email",
          },
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        valid: false,
        message: "Invalid ticket",
      });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({
        valid: false,
        message: "Ticket cancelled",
      });
    }

    return res.json({
      valid: true,
      ticket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkInTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id; // from authMiddleware

    const ticket = await Ticket.findOne({ ticketId }).populate({
      path: "booking",
      populate: [{ path: "event" }, { path: "user", select: "name email" }],
    });

    if (!ticket) {
      return res.status(404).json({ message: "Invalid ticket" });
    }

    // Check if user is the organizer — use booking.organizer which is stored directly
    if (ticket.booking.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to check-in tickets for this event",
        });
    }

    if (ticket.status === "used") {
      return res.status(400).json({ message: "Ticket has already been used" });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({ message: "Ticket is cancelled" });
    }

    ticket.status = "used";
    ticket.verifiedAt = new Date();
    await ticket.save();

    return res.json({
      message: "Ticket checked in successfully",
      ticket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find()
      .populate({
        path: "booking",
        match: { user: userId },
        populate: { path: "event" },
      });

    // Filter out tickets where booking didn't match (populate returns null)
    const myTickets = tickets.filter((t) => t.booking !== null);

    return res.json({ tickets: myTickets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
