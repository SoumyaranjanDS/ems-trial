import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Pagination,
  CircularProgress,
  Divider
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { fetchEvents } from '../../redux/slices/eventSlice';
import EventCard from '../../components/events/EventCard';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';

const categories = ['All', 'Tech & AI', 'Music & Concerts', 'Business & Startups', 'Design & Arts', 'Workshop'];

const EventCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { events, pages, currentPage, loading } = useSelector((state) => state.events);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');

  // Live debounced search & filter effect (300ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = { page: 1, limit: 9 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCity && selectedCity !== 'All Cities') params.city = selectedCity;

      dispatch(fetchEvents(params));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedCity, dispatch]);

  const handlePageChange = (page) => {
    const params = { page, limit: 9 };
    if (search.trim()) params.search = search.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedCity && selectedCity !== 'All Cities') params.city = selectedCity;
    dispatch(fetchEvents(params));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
          Events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse upcoming conferences, concerts, and workshops
        </Typography>
      </Box>

      {/* Minimalist Live Search & Filter Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search events by keyword, speaker, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FF5018', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 100,
                  bgcolor: '#F4F4F5'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <LocationAutocomplete
              placeholder="Filter by city / venue..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onSelectLocation={({ city, mainText }) => {
                setSelectedCity(city || mainText);
              }}
            />
          </Grid>
        </Grid>

        {/* Category Pills */}
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pt: 2, pb: 1, scrollbarWidth: 'none' }}>
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
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Events Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>No events found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your keyword or location filters.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>

          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pages}
                page={currentPage}
                onChange={(e, page) => handlePageChange(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EventCatalog;
