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
  Stack,
  CircularProgress
} from '@mui/material';
import { Event as EventIcon, Check as CheckIcon } from '@mui/icons-material';
import { updateUserRole } from '../../redux/slices/authSlice';

const RoleUpgradeModal = ({ open, onClose, onUpgraded }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const result = await dispatch(updateUserRole('organizer'));
    setLoading(false);

    if (updateUserRole.fulfilled.match(result)) {
      onClose();
      if (onUpgraded) onUpgraded();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pb: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#FF5018',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5
          }}
        >
          <EventIcon />
        </Box>
        Become an Organizer
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upgrade your account to an <strong>Organizer</strong> to host, list, and manage event tickets on EventHub.
        </Typography>

        <Stack spacing={1.5} sx={{ textAlign: 'left', bg: '#FAF8F5', p: 2, borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CheckIcon sx={{ color: '#FF5018', fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#111111' }}>
              Publish unlimited event listings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CheckIcon sx={{ color: '#FF5018', fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#111111' }}>
              Track ticket sales & revenue metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CheckIcon sx={{ color: '#FF5018', fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#111111' }}>
              Access door QR scanner for gate entry
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleUpgrade}
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: '#FF5018', color: '#FFFFFF', px: 3, fontWeight: 700 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Upgrade to Organizer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleUpgradeModal;
