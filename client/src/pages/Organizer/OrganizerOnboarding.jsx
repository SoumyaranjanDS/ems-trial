import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Event as EventIcon,
  QrCodeScanner as ScanIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { updateUserRole } from '../../redux/slices/authSlice';

const OrganizerOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleStartHosting = () => {
    navigate('/organizer/create-event');
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', color: '#111111' }}>
      {/* Hero Header */}
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #EBEBEB' }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              FOR ORGANIZERS
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                mt: 1,
                mb: 3
              }}
            >
              Host Events. Track Sales. Validate Passes.
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666', fontSize: '1.2rem', mb: 5, maxWidth: 540, mx: 'auto' }}>
              Everything you need to list summits, concerts, and workshops with real-time seat tracking and instant QR gate verification.
            </Typography>

            <Button
              onClick={handleStartHosting}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#FF5018',
                color: '#FFFFFF',
                px: 5,
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '100px',
                '&:hover': { bgcolor: '#E04000' }
              }}
              endIcon={<ArrowIcon />}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Start Hosting Events'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Organizer Capabilities (Cardless Grid) */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #EBEBEB' }}>
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            PLATFORM CAPABILITIES
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 800, mt: 1, mb: 6 }}>
            Designed for Seamless Event Management
          </Typography>

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={3}>
              <EventIcon sx={{ fontSize: 36, color: '#FF5018', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Instant Event Listing</Typography>
              <Typography variant="body2" color="text.secondary">
                Publish listings in under 2 minutes with curated banner presets and custom pricing.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <ScanIcon sx={{ fontSize: 36, color: '#111111', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Gate QR Scanner</Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile-optimized check-in scanner for instant barcode validation at entry doors.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TrendingIcon sx={{ fontSize: 36, color: '#FF5018', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Live Revenue Metrics</Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor ticket sales, estimated revenue, and seat remaining gauges in real-time.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <SecurityIcon sx={{ fontSize: 36, color: '#111111', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Atomic Concurrency</Typography>
              <Typography variant="body2" color="text.secondary">
                Database-level seat locks prevent overselling tickets during high demand peaks.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#111111', color: '#FFFFFF', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
            Ready to Host Your Next Event?
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAAAAA', mb: 4 }}>
            Join hundreds of organizers hosting summits, concerts, and workshops worldwide.
          </Typography>
          <Button
            onClick={handleStartHosting}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#FF5018',
              color: '#FFFFFF',
              px: 5,
              py: 1.5,
              fontWeight: 700,
              borderRadius: '100px',
              '&:hover': { bgcolor: '#E04000' }
            }}
          >
            Create Your First Event
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default OrganizerOnboarding;
