import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Avatar
} from '@mui/material';
import { EventSeat as AttendeeIcon, Campaign as HostIcon } from '@mui/icons-material';

const RoleSelectModal = ({ open, onClose, googleUserData, onConfirmRole, loading }) => {
  const [selectedRole, setSelectedRole] = useState('attendee');

  const handleConfirm = () => {
    if (googleUserData) {
      onConfirmRole({
        ...googleUserData,
        role: selectedRole
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Avatar src={googleUserData?.profileImage} sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, border: '2px solid #4F46E5' }}>
          {googleUserData?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Welcome, {googleUserData?.name?.split(' ')[0] || 'Friend'}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose how you would like to use EventHub
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <ToggleButtonGroup
          value={selectedRole}
          exclusive
          onChange={(e, newRole) => newRole && setSelectedRole(newRole)}
          fullWidth
          orientation="vertical"
          sx={{ gap: 1.5 }}
        >
          <ToggleButton
            value="attendee"
            sx={{
              p: 2,
              borderRadius: '10px !important',
              border: selectedRole === 'attendee' ? '2px solid #4F46E5 !important' : '1px solid #E2E8F0 !important',
              bgcolor: selectedRole === 'attendee' ? '#EEF2FF' : '#FFFFFF',
              justifyContent: 'flex-start',
              textTransform: 'none',
              textAlign: 'left'
            }}
          >
            <AttendeeIcon sx={{ color: '#4F46E5', mr: 2, fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Join as Event Attendee
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Discover concerts, summits, book digital QR tickets & review events
              </Typography>
            </Box>
          </ToggleButton>

          <ToggleButton
            value="organizer"
            sx={{
              p: 2,
              borderRadius: '10px !important',
              border: selectedRole === 'organizer' ? '2px solid #4F46E5 !important' : '1px solid #E2E8F0 !important',
              bgcolor: selectedRole === 'organizer' ? '#EEF2FF' : '#FFFFFF',
              justifyContent: 'flex-start',
              textTransform: 'none',
              textAlign: 'left'
            }}
          >
            <HostIcon sx={{ color: '#059669', mr: 2, fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Join as Event Organizer
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Host meetups, track live revenue, and scan QR tickets at the door
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.2, fontWeight: 700 }}
        >
          {loading ? 'Creating Account...' : 'Continue to Dashboard'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleSelectModal;
