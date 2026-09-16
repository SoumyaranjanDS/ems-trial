const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    ticketPassId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Must book at least 1 ticket']
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentRef: {
      type: String,
      default: ''
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    },
    qrCode: {
      type: String,
      default: ''
    },
    isCheckedIn: {
      type: Boolean,
      default: false
    },
    checkedInAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
