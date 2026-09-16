import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  Stack,
  Avatar,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  QrCodeScanner as ScanIcon,
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
  CameraAlt as CameraIcon,
  Stop as StopIcon,
  Warning as WarningIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../api/axios';

const CheckInScanner = () => {
  const [ticketInput, setTicketInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  const qrInstanceRef = useRef(null);

  const handleCheckInSubmit = async (codeToVerify) => {
    const targetCode = codeToVerify || ticketInput.trim();
    if (!targetCode) return;

    setLoading(true);
    setError(null);
    setWarning(null);
    setResult(null);

    try {
      const res = await api.post('/bookings/checkin', { code: targetCode });
      setResult(res.data);
      setTicketInput('');

      if (res.data.booking) {
        setScanHistory((prev) => [
          {
            id: res.data.booking.ticketPassId || res.data.booking._id,
            name: res.data.booking.user?.name || 'Attendee',
            event: res.data.booking.event?.title || 'Event',
            time: new Date().toLocaleTimeString(),
            status: 'valid'
          },
          ...prev.slice(0, 9)
        ]);
      }
    } catch (err) {
      if (err.response?.data?.alreadyCheckedIn) {
        setWarning(err.response.data);
      } else {
        setError(err.response?.data?.message || err.message || 'Verification Failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Start Live Camera with explicit getCameras permission request
  const startCameraScanner = async () => {
    setCameraError(null);
    setCameraLoading(true);

    try {
      // 1. Explicitly request camera permissions from browser
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setCameraError('No camera devices detected on this device.');
        setCameraLoading(false);
        return;
      }

      // Pick back camera if available, or first available video camera
      const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')) || devices[0];

      setCameraActive(true);
      setCameraLoading(false);

      setTimeout(async () => {
        try {
          const html5Qrcode = new Html5Qrcode('qr-reader-viewport');
          qrInstanceRef.current = html5Qrcode;

          await html5Qrcode.start(
            backCam.id,
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              handleCheckInSubmit(decodedText);
            },
            () => {}
          );
        } catch (startErr) {
          console.warn('[Camera Start Error]:', startErr);
          setCameraError(startErr.message || 'Failed to start camera feed. Please allow camera permissions in browser.');
          setCameraActive(false);
        }
      }, 300);
    } catch (err) {
      console.error('[getCameras Error]:', err);
      setCameraLoading(false);
      setCameraError(
        'Camera permission was denied or browser security requires HTTPS/localhost. You can use manual Pass ID or upload a QR image photo below.'
      );
    }
  };

  const stopCameraScanner = async () => {
    if (qrInstanceRef.current && qrInstanceRef.current.isScanning) {
      try {
        await qrInstanceRef.current.stop();
      } catch (e) {}
    }
    setCameraActive(false);
  };

  // Upload QR Image Photo File Scanner
  const handleQrPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const html5Qrcode = new Html5Qrcode('file-qr-temp');
      const decodedText = await html5Qrcode.scanFile(file, true);
      if (decodedText) {
        handleCheckInSubmit(decodedText);
      }
    } catch (err) {
      setError('Could not decode QR code from the uploaded image. Please ensure the QR code is clearly visible.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Hidden container for QR file scanning */}
      <Box id="file-qr-temp" sx={{ display: 'none' }} />

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
            Gate Check-In & Camera Scanner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scan attendee QR code passes via camera or enter structured Ticket Pass ID (e.g. EH-TECH-X8B9)
          </Typography>
        </Box>
        <Button
          variant={cameraActive ? 'contained' : 'outlined'}
          color={cameraActive ? 'error' : 'primary'}
          disabled={cameraLoading}
          startIcon={cameraLoading ? <CircularProgress size={18} color="inherit" /> : cameraActive ? <StopIcon /> : <CameraIcon />}
          onClick={cameraActive ? stopCameraScanner : startCameraScanner}
          sx={{ borderRadius: '100px', fontWeight: 700, px: 3, py: 1 }}
        >
          {cameraLoading ? 'Requesting Permission...' : cameraActive ? 'Stop Camera' : 'Launch Camera Scanner'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Camera Viewport & Manual Form */}
        <Grid item xs={12} md={7}>
          {/* Camera Viewport Container */}
          {cameraActive && (
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#111111', borderRadius: 3, mb: 3, textAlign: 'center', border: '2px solid #FF5018' }}>
              <Typography variant="caption" sx={{ color: '#FF5018', fontWeight: 800, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
                LIVE CAMERA SCANNER ACTIVE
              </Typography>
              <Box
                id="qr-reader-viewport"
                sx={{
                  width: '100%',
                  minHeight: 260,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#000000',
                  '& video': { width: '100% !important', borderRadius: '8px' }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mt: 1 }}>
                Point device camera at attendee ticket QR code
              </Typography>
            </Paper>
          )}

          {cameraError && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              {cameraError}
            </Alert>
          )}

          {/* Manual Input Box */}
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 3, bgcolor: '#FFFFFF', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>
              Manual Pass ID Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Enter or paste Ticket Pass ID (e.g. <code>EH-TECH-X8B9</code>)
            </Typography>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleCheckInSubmit(); }}>
              <TextField
                fullWidth
                label="Ticket Pass ID or QR Payload"
                placeholder="e.g. EH-TECH-X8B9 or Paste QR JSON..."
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F4F4F5' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScanIcon />}
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
                {loading ? 'Verifying Ticket Pass...' : 'Validate Entry'}
              </Button>
            </Box>
          </Paper>

          {/* Upload QR Image Photo Option */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px border #CBD5E1', borderRadius: 3, bgcolor: '#FAF8F5', textAlign: 'center' }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ borderColor: '#111111', color: '#111111', fontWeight: 700, borderRadius: '100px' }}
            >
              Upload / Snap Ticket QR Photo
              <input type="file" accept="image/*" hidden onChange={handleQrPhotoUpload} />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Pick or take a photo of a ticket QR code from your gallery
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column: Verification Status & Real-time Scan Roster */}
        <Grid item xs={12} md={5}>
          {/* Result 1: VALID TICKET (SUCCESS GREEN) */}
          {result && (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 3, mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <SuccessIcon sx={{ color: '#10B981', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#065F46' }}>
                    ENTRY GRANTED
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>
                    Valid Ticket Pass Validated
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5, borderColor: '#A7F3D0' }} />
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Pass ID:</Typography>
                  <Chip
                    label={result.booking?.ticketPassId || result.booking?._id}
                    size="small"
                    sx={{ fontWeight: 800, bgcolor: '#10B981', color: '#FFFFFF', fontSize: 11 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Attendee:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46' }}>
                    {result.booking?.user?.name || 'Attendee'} ({result.booking?.user?.email})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Event:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {result.booking?.event?.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Seats Reserved:</Typography>
                  <Chip label={`${result.booking?.quantity} Ticket(s)`} size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Result 2: ALREADY CHECKED IN (WARNING YELLOW) */}
          {warning && (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 3, mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <WarningIcon sx={{ color: '#D97706', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#92400E' }}>
                    ALREADY SCANNED!
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700 }}>
                    This pass was checked in earlier today
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#78350F', mt: 1 }}>
                {warning.message}
              </Typography>
            </Paper>
          )}

          {/* Result 3: ERROR (RED) */}
          {error && (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 3, mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <ErrorIcon sx={{ color: '#EF4444', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#991B1B' }}>
                    ENTRY DENIED
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B91C1C' }}>
                    {error}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Session Scan Log */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111111', mb: 2 }}>
              Gate Check-In History ({scanHistory.length})
            </Typography>
            <Stack spacing={1.5}>
              {scanHistory.map((item, idx) => (
                <Box key={idx} sx={{ p: 1.2, px: 1.8, bgcolor: '#F8FAFC', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.id} • {item.time}
                    </Typography>
                  </Box>
                  <Chip label="VALID" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 800, bgcolor: '#DCFCE7', color: '#15803D' }} />
                </Box>
              ))}
              {scanHistory.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', textAlign: 'center', py: 2 }}>
                  Scanned ticket passes will appear here
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckInScanner;
