import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { login, register, updateUserRole } from '../../redux/slices/authSlice';

const AuthPromptModal = ({ open, onClose, onAuthSuccess }) => {
  const dispatch = useDispatch();

  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isRegisterTab) {
      const result = await dispatch(register({ name, email, password, role: 'organizer' }));
      if (register.fulfilled.match(result)) {
        setLoading(false);
        onClose();
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setError(result.payload || 'Registration failed');
        setLoading(false);
      }
    } else {
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        await dispatch(updateUserRole('organizer'));
        setLoading(false);
        onClose();
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setError(result.payload || 'Login failed');
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pb: 1 }}>
        Sign In to Publish Event
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Your draft event is saved! Sign in or create an account to publish your listing instantly.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleEmailAuth}>
          {isRegisterTab && (
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.2, bgcolor: '#FF5018', color: '#FFFFFF', fontWeight: 700, borderRadius: '100px', mb: 1.5 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : isRegisterTab ? 'Sign Up & Publish' : 'Log In & Publish'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setIsRegisterTab(!isRegisterTab)}
            sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.8rem' }}
          >
            {isRegisterTab ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit" fullWidth size="small">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthPromptModal;
