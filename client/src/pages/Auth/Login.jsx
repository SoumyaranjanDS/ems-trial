import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectUser = (userObj) => {
    if (userObj?.role === 'organizer') {
      navigate('/organizer/dashboard');
    } else if (userObj?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/bookings/my');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      redirectUser(result.payload);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#111111' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to access your event passes and account
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700, bgcolor: '#FF5018', color: '#FFFFFF', borderRadius: '100px' }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <RouterLink to="/register" style={{ color: '#FF5018', fontWeight: 700 }}>
            Create Account
          </RouterLink>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Looking to host events?{' '}
          <RouterLink to="/organizers" style={{ color: '#111111', fontWeight: 700 }}>
            Host your first event →
          </RouterLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
