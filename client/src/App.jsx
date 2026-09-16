import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { Agentation } from 'agentation';

import theme from './theme/theme';
import { checkAuth } from './redux/slices/authSlice';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EventCatalog from './pages/Events/EventCatalog';
import EventDetail from './pages/Events/EventDetail';
import CreateEvent from './pages/Organizer/CreateEvent';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import OrganizerOnboarding from './pages/Organizer/OrganizerOnboarding';
import CheckInScanner from './pages/Organizer/CheckInScanner';
import MyBookings from './pages/Attendee/MyBookings';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LegalPrivacy from './pages/LegalPrivacy';
import TermsConditions from './pages/TermsConditions';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <Navbar />
        <Toolbar sx={{ minHeight: '76px !important' }} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventCatalog />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/organizers" element={<OrganizerOnboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<LegalPrivacy />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* Attendee Routes */}
            <Route
              path="/bookings/my"
              element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Organizer Routes */}
            <Route path="/organizer/create-event" element={<CreateEvent />} />
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/scan"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <CheckInScanner />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
        {/* Agentation Visual Feedback & Annotation Toolbar */}
        <Agentation />
      </Box>
    </ThemeProvider>
  );
};

export default App;
