import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EBEBEB', py: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2.5}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()} <strong>EventHub Marketplace</strong>. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
            <Link component={RouterLink} to="/organizers" variant="body2" color="text.secondary" underline="hover" sx={{ fontWeight: 600 }}>
              For Organizers
            </Link>
            <Link component={RouterLink} to="/privacy" variant="body2" color="text.secondary" underline="hover" sx={{ fontWeight: 600 }}>
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" variant="body2" color="text.secondary" underline="hover" sx={{ fontWeight: 600 }}>
              Terms & Conditions
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
