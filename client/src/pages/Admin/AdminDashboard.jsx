import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/events?includePending=true&limit=50')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setEvents(eventsRes.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusUpdate = async (eventId, status) => {
    try {
      await api.patch(`/events/${eventId}/status`, { status });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Platform Administration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor platform metrics, moderate listings, and manage user permissions
        </Typography>
      </Box>

      {/* Metrics Row */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', width: 44, height: 44 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL USERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stats.totalUsers}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#ECFDF5', color: '#059669', width: 44, height: 44 }}>
                <EventIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL EVENTS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stats.totalEvents}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FEF3C7', color: '#D97706', width: 44, height: 44 }}>
                <PendingIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  PENDING APPROVAL
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stats.pendingEvents}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FCE7F3', color: '#DB2777', width: 44, height: 44 }}>
                <MoneyIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL REVENUE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ₹{stats.totalRevenue.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: '1px solid #E2E8F0', px: 2 }}
        >
          <Tab label="Event Moderation Queue" sx={{ fontWeight: 700 }} />
          <Tab label="User Management" sx={{ fontWeight: 700 }} />
        </Tabs>

        {/* Tab 0: Event Moderation */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Organizer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Moderation Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{ev.title}</TableCell>
                    <TableCell>{ev.organizer?.name || 'Organizer'}</TableCell>
                    <TableCell>{ev.city}</TableCell>
                    <TableCell>${ev.price}</TableCell>
                    <TableCell>
                      <Chip
                        label={ev.status}
                        size="small"
                        color={ev.status === 'approved' ? 'success' : ev.status === 'pending' ? 'warning' : 'error'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {ev.status !== 'approved' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleStatusUpdate(ev._id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                        {ev.status !== 'rejected' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => handleStatusUpdate(ev._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 1: User Management */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Registered On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
                      <Avatar src={u.profileImage} sx={{ width: 32, height: 32 }}>{u.name?.charAt(0)}</Avatar>
                      {u.name}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role.toUpperCase()}
                        size="small"
                        color={u.role === 'admin' ? 'error' : u.role === 'organizer' ? 'secondary' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
