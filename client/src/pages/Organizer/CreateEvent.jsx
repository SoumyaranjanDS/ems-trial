import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Stack,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as UploadIcon,
  Check as CheckIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { createEvent } from '../../redux/slices/eventSlice';
import { updateUserRole } from '../../redux/slices/authSlice';
import AuthPromptModal from '../../components/auth/AuthPromptModal';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';
import api from '../../api/axios';

const categories = ['Tech & AI', 'Music & Concerts', 'Business & Startups', 'Design & Arts', 'Health & Fitness', 'Workshop'];

const presetBanners = [
  { name: 'Tech Summit', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Music Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Startup Pitch', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Design Workshop', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Art Showcase', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80' }
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech & AI',
    banner: presetBanners[0].url,
    location: '',
    city: 'San Francisco',
    date: '',
    time: '10:00 AM',
    price: 0,
    capacity: 100
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectBannerPreset = (url) => {
    setFormData({ ...formData, banner: url });
    setUploadSuccess(false);
    setImageError(false);
  };

  // Direct Cloudinary Image File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    setError(null);
    setUploadSuccess(false);
    setImageError(false);

    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.url) {
        setFormData((prev) => ({ ...prev, banner: res.data.url }));
        setUploadSuccess(true);
      }
    } catch (err) {
      console.error('[Cloudinary Upload Error]:', err);
      setError(err.response?.data?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublishListing = async () => {
    setError(null);
    setLoading(true);

    if (user?.role === 'attendee') {
      await dispatch(updateUserRole('organizer'));
    }

    const result = await dispatch(createEvent(formData));
    setLoading(false);

    if (createEvent.fulfilled.match(result)) {
      navigate('/organizer/dashboard');
    } else {
      setError(result.payload || 'Failed to publish event listing');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.date) {
      setError('Please select a valid event date.');
      return;
    }

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    handlePublishListing();
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Deferred Auth Modal */}
      <AuthPromptModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handlePublishListing}
      />

      {/* Navigation Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: '#666666', mb: 2, fontWeight: 600 }}
        >
          Back
        </Button>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
          Host a New Event
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in your event details below to publish your listing on EventHub
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>
          {/* Event Title */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Event Title *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. AI & Full-Stack Tech Summit 2026"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          {/* Category & City */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Category *
            </Typography>
            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#FFFFFF !important',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12) !important',
                      border: '1px solid #EBEBEB',
                      borderRadius: 2
                    }
                  }
                }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              City *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. San Francisco"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          {/* Venue Address with Google Places Autocomplete */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Venue Address / Online Link * (Powered by Google Places)
            </Typography>
            <LocationAutocomplete
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              onSelectLocation={({ location, city }) => {
                setFormData((prev) => ({
                  ...prev,
                  location: location || prev.location,
                  city: city || prev.city
                }));
              }}
              required
            />
          </Grid>

          {/* Date & Time */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Event Date *
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="date"
              inputProps={{ min: todayStr }}
              value={formData.date}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Start Time *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. 10:00 AM PST"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          {/* Price & Capacity */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Ticket Price (₹) * (Set 0 for Free Event)
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="price"
              inputProps={{ min: 0, step: '1' }}
              value={formData.price}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Total Capacity (Seats) *
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="capacity"
              inputProps={{ min: 1 }}
              value={formData.capacity}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          {/* Direct Cloudinary Banner Image Upload Box */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Upload Event Banner Image (Cloudinary Direct Upload)
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileUpload}
              disabled={uploadingImage}
            />
            <Box
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              sx={{
                p: 3,
                bgcolor: '#FAF8F5',
                border: '2px dashed #CBD5E1',
                borderRadius: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#FF5018', bgcolor: '#FFF7F4' }
              }}
            >
              <UploadIcon sx={{ fontSize: 36, color: '#FF5018', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111111' }}>
                {uploadingImage ? 'Uploading Image to Cloudinary...' : 'Click or Drag & Drop Banner Image File'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG, WEBP up to 10MB (Cloudinary Cloud: clrlgldl)
              </Typography>

              {uploadingImage && (
                <Box sx={{ mt: 1.5 }}>
                  <CircularProgress size={24} sx={{ color: '#FF5018' }} />
                </Box>
              )}

              {uploadSuccess && (
                <Chip
                  icon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
                  label="Uploaded to Cloudinary Successfully!"
                  color="success"
                  size="small"
                  sx={{ mt: 1.5, fontWeight: 700 }}
                />
              )}
            </Box>
          </Grid>

          {/* Banner Preset Selector Alternative */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
              OR CHOOSE A PRESET BANNER
            </Typography>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1.5, scrollbarWidth: 'none' }}>
              {presetBanners.map((preset) => (
                <Chip
                  key={preset.name}
                  label={preset.name}
                  clickable
                  onClick={() => handleSelectBannerPreset(preset.url)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: formData.banner === preset.url ? '#FF5018' : '#F4F4F5',
                    color: formData.banner === preset.url ? '#FFFFFF' : '#111111'
                  }}
                />
              ))}
            </Stack>
          </Grid>

          {/* STUNNING LIVE BANNER PREVIEW CARD */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                LIVE BANNER PREVIEW
              </Typography>
              <Chip label="Real-Time Card Preview" size="small" sx={{ fontSize: 10, height: 20, bgcolor: '#FFECE5', color: '#FF5018', fontWeight: 800 }} />
            </Box>

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 280,
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#111111',
                border: '1px solid #EBEBEB',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              {!imageError && formData.banner ? (
                <Box
                  component="img"
                  src={formData.banner}
                  alt="Live Banner Preview"
                  onError={() => setImageError(true)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #111111 0%, #2A2A2A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#888888', fontWeight: 700 }}>
                    Event Banner Image Preview
                  </Typography>
                </Box>
              )}

              {/* Dark Mask Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={formData.category.toUpperCase()}
                    size="small"
                    sx={{ bgcolor: '#FF5018', color: '#FFFFFF', fontWeight: 800, fontSize: 10, height: 22 }}
                  />
                  <Chip
                    label={formData.price > 0 ? `₹${formData.price}` : 'FREE PASS'}
                    size="small"
                    sx={{ bgcolor: '#FFFFFF', color: '#111111', fontWeight: 800, fontSize: 11, height: 22 }}
                  />
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {formData.title || 'Your Event Title Here'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.85)' }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#FF5018' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {formData.location || formData.city || 'San Francisco, CA'} • {formData.date || todayStr} ({formData.time})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Event Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#111111' }}>
              Event Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Provide a compelling overview of your event, keynote speakers, agenda, and target audience..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
            />
          </Grid>

          {/* Submit Action */}
          <Grid item xs={12} sx={{ pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || uploadingImage}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                bgcolor: '#FF5018',
                color: '#FFFFFF',
                borderRadius: '100px',
                '&:hover': { bgcolor: '#E04000' }
              }}
            >
              {loading ? 'Publishing Listing...' : 'Publish Event Listing'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateEvent;
