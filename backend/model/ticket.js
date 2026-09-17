import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true
  },
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["valid", "used", "cancelled"],
    default: "valid"
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
