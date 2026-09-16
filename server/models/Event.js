const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Tech & AI', 'Music & Concerts', 'Business & Startups', 'Design & Arts', 'Health & Fitness', 'Workshop'],
      index: true
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
    },
    location: {
      type: String,
      required: [true, 'Venue / Location address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Event start time is required']
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Price cannot be negative']
    },
    capacity: {
      type: Number,
      required: [true, 'Total event capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    availableSeats: {
      type: Number,
      required: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'approved'
    },
    averageRating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Compound index for optimized search & discovery queries
eventSchema.index({ city: 1, date: 1 });
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
