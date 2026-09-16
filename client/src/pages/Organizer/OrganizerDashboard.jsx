import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  QrCodeScanner as ScanIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';
import api from '../../api/axios';

const OrganizerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalSeatsSold: 0,
    totalRevenue: 0,
    totalCheckedIn: 0
  });

  const [events, setEvents] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  // Quick Edit Modal state
  const [editEvent, setEditEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: 0, capacity: 100, banner: '' });
  const [uploading, setUploading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/events/my/stats');
      if (res.data && res.data.success) {
        setStats(res.data.stats);
        setEvents(res.data.events);
        setRecentBookings(res.data.recentBookings || []);
      }
    } catch (err) {
      console.error('[Organizer Dashboard Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and real-time Socket.IO updates
  useEffect(() => {
    fetchDashboardData();

    const socket = io('/', { path: '/socket.io' });
    socket.on('seatAvailabilityUpdated', () => {
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event listing?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleOpenEdit = (ev) => {
    setEditEvent(ev);
    setEditForm({
      title: ev.title,
      price: ev.price,
      capacity: ev.capacity,
      banner: ev.banner
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setEditForm((prev) => ({ ...prev, banner: res.data.url }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editEvent) return;
    try {
      await api.put(`/events/${editEvent._id}`, editForm);
      setEditEvent(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
            Organizer Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.name || 'Organizer'}! Manage your listings, ticket capacity, and attendee check-ins in real time.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/organizer/scan"
            variant="outlined"
            size="small"
            startIcon={<ScanIcon />}
            sx={{ borderRadius: '100px', borderColor: '#111111', color: '#111111', fontWeight: 600 }}
          >
            Check-In Scanner
          </Button>
          <Button
            component={RouterLink}
            to="/organizer/create-event"
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '100px', bgcolor: '#FF5018', color: '#FFFFFF', fontWeight: 700 }}
          >
            Host Event
          </Button>
        </Stack>
      </Box>

      {/* Real-time Dynamic Metrics Bar */}
      <Grid container spacing={4} sx={{ mb: 5, py: 3, borderTop: '1px solid #EBEBEB', borderBottom: '1px solid #EBEBEB' }}>
        <Grid item xs={12} sm={3}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF5018', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            REALIZED REVENUE
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#111111', mt: 0.5 }}>
            ₹{stats.totalRevenue.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            TICKETS SOLD
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#111111', mt: 0.5 }}>
            {stats.totalSeatsSold}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CHECKED-IN PASSES
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#111111', mt: 0.5 }}>
            {stats.totalCheckedIn}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            HOSTED EVENTS
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#111111', mt: 0.5 }}>
            {stats.totalEvents}
          </Typography>
        </Grid>
      </Grid>

      {/* Tabs: Hosted Events vs Recent Attendee Sales */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem' } }}
        >
          <Tab label={`Hosted Events (${events.length})`} />
          <Tab label={`Recent Ticket Sales (${recentBookings.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Hosted Events Table */}
      {activeTab === 0 && (
        <Box sx={{ mb: 2 }}>
          <TableContainer>
            <Table sx={{ borderCollapse: 'separate' }}>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid #111111' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Event Listing</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Seats Remaining</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#111111' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev._id} sx={{ borderBottom: '1px solid #EBEBEB' }}>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={ev.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}
                          alt={ev.title}
                          sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111111' }}>
                            {ev.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ev.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{ev.city}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{new Date(ev.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#FF5018' }}>
                      {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${ev.availableSeats} / ${ev.capacity}`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: ev.availableSeats === 0 ? '#EF4444' : '#111111',
                          color: '#FFFFFF'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ev.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: ev.status === 'approved' ? '#DCFCE7' : '#FEF3C7',
                          color: ev.status === 'approved' ? '#15803D' : '#D97706'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View event page">
                          <IconButton component={RouterLink} to={`/events/${ev._id}`} size="small" color="inherit">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Quick edit">
                          <IconButton onClick={() => handleOpenEdit(ev)} size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete listing">
                          <IconButton onClick={() => handleDelete(ev._id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#666666' }}>
                      No events hosted yet. Click 'Host Event' to create your first listing!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 1: Recent Attendee Ticket Sales & Gate Check-Ins */}
      {activeTab === 1 && (
        <Box sx={{ mb: 2 }}>
          <TableContainer>
            <Table sx={{ borderCollapse: 'separate' }}>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid #111111' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Attendee Name & Email</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Event Title</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Tickets Booked</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Amount Paid</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#111111' }}>Payment Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#111111' }}>Gate Check-In</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((b) => (
                  <TableRow key={b._id} sx={{ borderBottom: '1px solid #EBEBEB' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={b.user?.profileImage} sx={{ width: 36, height: 36, bgcolor: '#FF5018', fontSize: 14, fontWeight: 700 }}>
                          {b.user?.name?.charAt(0) || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111111' }}>
                            {b.user?.name || 'Attendee'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {b.user?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{b.event?.title || 'Event'}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Chip label={`${b.quantity} Ticket(s)`} size="small" icon={<TicketIcon sx={{ fontSize: '14px !important' }} />} sx={{ fontWeight: 700, bgcolor: '#F4F4F5' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#FF5018' }}>
                      ₹{b.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={b.paymentStatus.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: 10,
                          bgcolor: b.paymentStatus === 'paid' ? '#DCFCE7' : '#FEF3C7',
                          color: b.paymentStatus === 'paid' ? '#15803D' : '#D97706'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {b.isCheckedIn ? (
                        <Chip
                          icon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
                          label="CHECKED IN"
                          size="small"
                          sx={{ fontWeight: 800, fontSize: 10, bgcolor: '#10B981', color: '#FFFFFF' }}
                        />
                      ) : (
                        <Chip
                          label="NOT CHECKED IN"
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: 10, borderColor: '#CBD5E1', color: '#64748B' }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {recentBookings.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#666666' }}>
                      No ticket sales recorded yet. Once attendees book passes, sales will appear here in real time!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Edit Event Modal */}
      <Dialog open={Boolean(editEvent)} onClose={() => setEditEvent(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Event Listing</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Event Title"
              fullWidth
              size="small"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              label="Ticket Price (₹)"
              type="number"
              fullWidth
              size="small"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
            />
            <TextField
              label="Total Capacity"
              type="number"
              fullWidth
              size="small"
              value={editForm.capacity}
              onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
            />
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
              disabled={uploading}
              sx={{ borderColor: '#111111', color: '#111111', fontWeight: 600, borderRadius: '100px' }}
            >
              {uploading ? 'Uploading to Cloudinary...' : 'Upload New Cloudinary Banner'}
              <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditEvent(null)} variant="text" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ bgcolor: '#FF5018', color: '#FFFFFF', fontWeight: 700, borderRadius: '100px' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrganizerDashboard;
