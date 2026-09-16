const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const { generateQRCode } = require('./services/qrService');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub');
    console.log('[Seed] Database connected for seeding...');
  } catch (err) {
    console.error('[Seed Error] Could not connect to DB:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('[Seed] Cleared existing records.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@eventhub.com',
      password: 'password123',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });

    const organizer = await User.create({
      name: 'Priya Sharma (Organizer)',
      email: 'priya@eventhub.com',
      password: 'password123',
      role: 'organizer',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    });

    const attendee = await User.create({
      name: 'Rahul Verma (Attendee)',
      email: 'rahul@eventhub.com',
      password: 'password123',
      role: 'attendee',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    });

    console.log('[Seed] Created default users:');
    console.log(' - Admin: admin@eventhub.com / password123');
    console.log(' - Organizer: priya@eventhub.com / password123');
    console.log(' - Attendee: rahul@eventhub.com / password123');

    // 2. Create Events
    const events = await Event.create([
      {
        title: 'Global AI & Web3 Innovators Summit 2026',
        description: 'Join top engineering leaders, researchers, and venture capitalists exploring LLMs, agentic AI systems, and decentralized infrastructure.',
        category: 'Tech & AI',
        banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        location: 'Tech Hub Convention Center, Hall B',
        city: 'San Francisco',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '09:30 AM',
        price: 49.99,
        capacity: 250,
        availableSeats: 247,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 4.8,
        numReviews: 12
      },
      {
        title: 'Indie Rock & Jazz Under the Stars',
        description: 'An intimate outdoor live concert featuring indie rock bands and jazz ensembles under the starry weekend night.',
        category: 'Music & Concerts',
        banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        location: 'Skyline Amphitheater',
        city: 'Austin',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '07:00 PM',
        price: 29.00,
        capacity: 500,
        availableSeats: 495,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 4.9,
        numReviews: 24
      },
      {
        title: 'SaaS Founders & Seed Investor Breakfast',
        description: 'Exclusive networking breakfast connect early-stage SaaS founders with angel investors and B2B growth strategists.',
        category: 'Business & Startups',
        banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        location: 'Palace Hotel Conference Room',
        city: 'New York',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        time: '08:00 AM',
        price: 75.00,
        capacity: 60,
        availableSeats: 58,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 4.7,
        numReviews: 8
      },
      {
        title: 'UI/UX Design Systems & Figma Masterclass',
        description: 'Interactive workshop on building scalable design systems, tokenized variables, and high-fidelity interactive prototypes in Figma.',
        category: 'Design & Arts',
        banner: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
        location: 'Design Lab Studios',
        city: 'Seattle',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        price: 0.00,
        capacity: 100,
        availableSeats: 90,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 5.0,
        numReviews: 5
      },
      {
        title: 'Sunrise Mindful Yoga & Urban Meditation',
        description: 'Start your Saturday with guided mindfulness, breathwork sessions, and energetic Vinyasa yoga.',
        category: 'Health & Fitness',
        banner: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
        location: 'Central Park Green Meadow',
        city: 'New York',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '06:30 AM',
        price: 15.00,
        capacity: 40,
        availableSeats: 35,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 4.9,
        numReviews: 18
      },
      {
        title: 'Full-Stack MERN Microservices Deep-Dive',
        description: 'Hands-on intensive code-along building RESTful APIs, JWT auth with httpOnly cookies, atomic MongoDB updates, and MUI React UI.',
        category: 'Workshop',
        banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        location: 'Developer Academy Tech Hub',
        city: 'San Francisco',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: '02:00 PM',
        price: 35.00,
        capacity: 80,
        availableSeats: 78,
        organizer: organizer._id,
        status: 'approved',
        averageRating: 4.8,
        numReviews: 15
      }
    ]);

    console.log(`[Seed] Created ${events.length} sample events.`);

    // 3. Create Sample Bookings
    const booking1 = await Booking.create({
      user: attendee._id,
      event: events[0]._id,
      quantity: 2,
      totalAmount: 99.98,
      paymentStatus: 'paid',
      paymentRef: 'pi_test_3m9a8183192',
      bookingStatus: 'confirmed',
      isCheckedIn: false
    });

    const qr1Payload = JSON.stringify({
      bookingId: booking1._id,
      userId: attendee._id,
      eventId: events[0]._id,
      tickets: 2
    });
    booking1.qrCode = await generateQRCode(qr1Payload);
    await booking1.save();

    const booking2 = await Booking.create({
      user: attendee._id,
      event: events[3]._id,
      quantity: 1,
      totalAmount: 0.00,
      paymentStatus: 'paid',
      paymentRef: 'free_ticket',
      bookingStatus: 'confirmed',
      isCheckedIn: true,
      checkedInAt: new Date()
    });

    const qr2Payload = JSON.stringify({
      bookingId: booking2._id,
      userId: attendee._id,
      eventId: events[3]._id,
      tickets: 1
    });
    booking2.qrCode = await generateQRCode(qr2Payload);
    await booking2.save();

    console.log('[Seed] Created sample bookings with QR codes.');

    // 4. Create Sample Review
    await Review.create({
      user: attendee._id,
      event: events[0]._id,
      rating: 5,
      comment: 'Incredible speaker lineup and super smooth ticketing process via EventHub!'
    });

    console.log('[Seed] Database seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
