import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  CircularProgress,
  Stack,
  Paper
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as VenueIcon,
  LocationCity as CityIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import api from '../../api/axios';

const LocationAutocomplete = ({ label, value, onChange, onSelectLocation, placeholder, required = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPredictions = async (query) => {
    if (!query || query.trim().length === 0) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/locations/autocomplete?input=${encodeURIComponent(query.trim())}`);
      if (res.data && res.data.predictions) {
        setPredictions(res.data.predictions);
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.warn('[Google Places Autocomplete Error]:', err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (onChange) onChange(e);

    setIsFocused(true);
    fetchPredictions(val);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (inputValue && inputValue.trim().length > 0) {
      fetchPredictions(inputValue);
    }
  };

  const handleSelectPrediction = (pred) => {
    const selectedText = pred.description || pred.mainText;
    setInputValue(selectedText);
    setIsFocused(false);
    setPredictions([]);

    if (onSelectLocation) {
      onSelectLocation({
        location: selectedText,
        city: pred.city,
        mainText: pred.mainText
      });
    }
  };

  return (
    <Box ref={containerRef} sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder || 'Filter by city / venue...'}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        required={required}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon sx={{ color: '#FF5018', fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={18} color="primary" />
            </InputAdornment>
          ) : null
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#F4F4F5'
          }
        }}
      />

      {/* Floating Absolutely-Positioned Google Places Recommendations Dropdown */}
      {isFocused && predictions.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 1300,
            bgcolor: '#FFFFFF',
            border: '1px solid #EBEBEB',
            borderRadius: 3,
            p: 2,
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            maxHeight: 320,
            overflowY: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#666666', letterSpacing: '0.05em' }}>
              REAL-TIME GOOGLE PLACES & VENUES
            </Typography>
            <Chip
              icon={<GoogleIcon sx={{ fontSize: '12px !important' }} />}
              label="Live Google Places"
              size="small"
              sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: '#FFFFFF', border: '1px solid #EBEBEB' }}
            />
          </Box>

          <Stack spacing={1}>
            {predictions.map((pred, idx) => (
              <Box
                key={idx}
                onClick={() => handleSelectPrediction(pred)}
                sx={{
                  p: 1.2,
                  px: 1.8,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #EBEBEB',
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#FF5018',
                    bgcolor: '#FFF7F4',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  {pred.isVenue ? (
                    <VenueIcon sx={{ color: '#FF5018', fontSize: 20, flexShrink: 0 }} />
                  ) : (
                    <CityIcon sx={{ color: '#111111', fontSize: 20, flexShrink: 0 }} />
                  )}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pred.mainText}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pred.secondaryText || pred.description}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={pred.city || (pred.isVenue ? 'VENUE' : 'CITY')}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 800,
                    bgcolor: pred.isVenue ? '#FFECE5' : '#F1F5F9',
                    color: pred.isVenue ? '#FF5018' : '#334155',
                    flexShrink: 0
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default LocationAutocomplete;
