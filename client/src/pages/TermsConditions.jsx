import React from 'react';
import { Container, Box, Typography, Paper, Divider, Stack } from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';

const TermsConditions = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <GavelIcon sx={{ fontSize: 48, color: '#FF5018', mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: February 2026 • EventHub Event Marketplace Agreement
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid #EBEBEB', borderRadius: 4, bgcolor: '#FFFFFF' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              By accessing or using EventHub, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, you may not access or use our marketplace services.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              2. Event Ticket Purchases & Pass Validation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              • All ticket sales issue an official structured Ticket Pass ID and digital QR code.
              • Passes are valid for single door entry check-in only. Duplicate scans will be flagged as ALREADY CHECKED IN.
              • Event organizers reserve the right to verify attendee identity against the ticket pass at door entry.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              3. Event Hosting Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Organizers publishing events must provide accurate dates, location venues, ticket pricing, and high-resolution event banners. EventHub reserves the right to reject or suspend listings that violate community guidelines or provide misleading venue descriptions.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', mb: 1 }}>
              4. Governing Law
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              These terms shall be governed by and construed in accordance with standard commerce regulations. For inquiries regarding marketplace terms, contact <strong>support@eventhub.com</strong>.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default TermsConditions;
