import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Explore as ExploreIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  QrCode2 as QrIcon,
  Bolt as BoltIcon,
  Star as StarIcon,
  Check as CheckIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { fetchEvents } from '../redux/slices/eventSlice';
import EventCard from '../components/events/EventCard';

const categories = ['All', 'Tech & AI', 'Music & Concerts', 'Business & Startups', 'Design & Arts', 'Workshop'];

const faqs = [
  { question: 'How do QR ticket passes work?', answer: 'Scan digital QR passes directly from your phone at entry gates.' },
  { question: 'How are double bookings prevented?', answer: 'Atomic MongoDB locks guarantee seats are never oversold.' },
  { question: 'Can I host my own event?', answer: 'Yes. Switch to Organizer mode to list events & monitor sales.' },
  { question: 'Are receipts emailed?', answer: 'Instant confirmation receipts are provided in the app.' }
];

const Home = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchEvents({ limit: 6 }));
  }, [dispatch]);

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', color: '#111111' }}>
      {/* ---------------- 1. ULTRA-MINIMAL HERO WITH VIDEO BG & BLACK MASK OVERLAY (100VH) ---------------- */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: { xs: 8, md: 12 },
          borderBottom: '1px solid #EBEBEB',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          src="/hero-bg.mp4"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        />

        {/* Black Overlay Mask */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1
          }}
        />

        {/* Content Layer (Centered) */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: 840, mx: 'auto', textAlign: 'center' }}>
            <Chip
              label="EVENT MARKETPLACE 2026"
              size="small"
              sx={{ mb: 2, fontWeight: 700, bgcolor: '#FFFFFF', color: '#111111', fontSize: '0.75rem' }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                mb: 3
              }}
            >
              Events Made Simple.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.2rem', mb: 5, maxWidth: 540, mx: 'auto' }}>
              Discover summits, workshops, and concerts. Book instant QR tickets.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/events"
                variant="contained"
                sx={{ bgcolor: '#FF5018', color: '#FFFFFF', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#E04000' } }}
              >
                Explore Events
              </Button>
              <Button
                component={RouterLink}
                to="/organizers"
                variant="outlined"
                sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', px: 4, py: 1.5, fontWeight: 700, '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Host Event
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ---------------- 2. ABOUT US (CONCISE BORDERLESS LIST) ---------------- */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #EBEBEB' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ABOUT US
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, mt: 1, lineHeight: 1.15 }}>
                Zero Friction Ticketing Platform.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ color: '#FF5018', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Instant Digital QR Passes</Typography>
                    <Typography variant="body2" color="text.secondary">Scannable passes generated directly on your mobile device.</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ color: '#FF5018', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Atomic Seat Locks</Typography>
                    <Typography variant="body2" color="text.secondary">Database concurrency checks ensure zero oversold seats.</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ color: '#FF5018', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Real-Time Availability</Typography>
                    <Typography variant="body2" color="text.secondary">Socket.IO updates live seat counts across all browsers.</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------------- 3. EVENTS (BORDERLESS GRID) ---------------- */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #EBEBEB' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 800 }}>
              Featured Events
            </Typography>
            <Button component={RouterLink} to="/events" sx={{ color: '#FF5018', fontWeight: 700 }}>
              View All →
            </Button>
          </Box>

          {/* Category Filter Pills */}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 3, scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontWeight: 700,
                  bgcolor: selectedCategory === cat ? '#FF5018' : '#F4F4F5',
                  color: selectedCategory === cat ? '#FFFFFF' : '#111111'
                }}
              />
            ))}
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ---------------- 4. WHY US (NO CARDS, MINIMALIST ICONS & LABELS) ---------------- */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #EBEBEB' }}>
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            WHY US
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 800, mb: 6, mt: 1 }}>
            Engineered for Speed & Trust.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <SecurityIcon sx={{ fontSize: 32, color: '#FF5018', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>Atomic Locks</Typography>
              <Typography variant="body2" color="text.secondary">Zero double booking risk.</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <QrIcon sx={{ fontSize: 32, color: '#111111', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>QR Gate Scans</Typography>
              <Typography variant="body2" color="text.secondary">Fast entrance verification.</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <BoltIcon sx={{ fontSize: 32, color: '#FF5018', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>Live Sync</Typography>
              <Typography variant="body2" color="text.secondary">Real-time Socket seat updates.</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StarIcon sx={{ fontSize: 32, color: '#111111', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>Verified Hosts</Typography>
              <Typography variant="body2" color="text.secondary">Curated tech & art summits.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------------- 5. STATS (NO CARDS, GIANT NUMBERS) ---------------- */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#111111', color: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={6} md={3}>
              <Typography variant="h1" sx={{ fontWeight: 800, color: '#FF5018', fontSize: { xs: '3rem', md: '4rem' } }}>
                15k+
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA', fontWeight: 600 }}>Tickets Issued</Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="h1" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '3rem', md: '4rem' } }}>
                250+
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA', fontWeight: 600 }}>Hosted Events</Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="h1" sx={{ fontWeight: 800, color: '#FF5018', fontSize: { xs: '3rem', md: '4rem' } }}>
                99.9%
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA', fontWeight: 600 }}>Uptime Reliability</Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="h1" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '3rem', md: '4rem' } }}>
                4.9★
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA', fontWeight: 600 }}>User Rating</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------------- 6. FAQ (BORDERLESS QUESTIONS) ---------------- */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            FAQ
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 800, mb: 4, mt: 1 }}>
            Common Questions
          </Typography>

          <Stack spacing={1}>
            {faqs.map((faq, idx) => (
              <Accordion key={idx} elevation={0} sx={{ border: 'none', '&:before': { display: 'none' }, borderBottom: '1px solid #EBEBEB' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF5018' }} />} sx={{ px: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
