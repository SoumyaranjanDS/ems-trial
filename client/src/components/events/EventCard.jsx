import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip, Stack } from '@mui/material';

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const isSoldOut = event.availableSeats <= 0;

  return (
    <Box
      component={RouterLink}
      to={`/events/${event._id}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        group: 'true'
      }}
    >
      {/* Borderless Photo with subtle hover scale */}
      <Box sx={{ overflow: 'hidden', borderRadius: 2, mb: 1.5, position: 'relative' }}>
        <Box
          component="img"
          src={event.banner}
          alt={event.title}
          sx={{
            width: '100%',
            height: 220,
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.03)' }
          }}
        />
        <Chip
          label={event.price === 0 ? 'FREE' : `₹${event.price}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: '#111111',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.75rem'
          }}
        />
      </Box>

      {/* Clean Minimalist Typography (No card background, no borders) */}
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ color: '#FF5018', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {event.category} • {formattedDate}
        </Typography>

        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111', lineHeight: 1.3 }}>
          {event.title}
        </Typography>

        <Typography variant="caption" sx={{ color: '#666666', fontWeight: 500 }}>
          {event.city} • {isSoldOut ? 'Sold Out' : `${event.availableSeats} seats remaining`}
        </Typography>
      </Stack>
    </Box>
  );
};

export default EventCard;
