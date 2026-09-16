import React from 'react';
import { Container, Box, Typography, Paper, Divider, Stack } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

const LegalPrivacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <SecurityIcon sx={{ fontSize: 48, color: '#FF5018', mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: February 2026 • EventHub Platform Trust & Safety
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid #EBEBEB', borderRadius: 4, bgcolor: '#FFFFFF' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              EventHub collects information you provide directly when creating an account, registering for events, or hosting event listings. This includes your name, email address, profile picture, and transactional details when purchasing ticket passes.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              We use your data to:
              • Generate unique QR code digital entry passes for your booked events.
              • Send instant transactional receipts and booking confirmations.
              • Enable verified event organizers to validate ticket entry at event gates.
              • Prevent fraudulent transactions and maintain platform security.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              3. Data Security & Third-Party Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Your payment information is securely processed. EventHub does not store full credit card numbers or banking secrets on our servers. Images are securely hosted via Cloudinary, and location services are powered by Google Places API.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              4. Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              If you have any questions or privacy concerns, please reach out to our privacy compliance team at <strong>privacy@eventhub.com</strong>.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LegalPrivacy;
