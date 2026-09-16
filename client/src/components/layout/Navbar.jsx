import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    setMobileDrawerOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <HideOnScroll {...props}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F0F0F0',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 76 }}>
            {/* Logo */}
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF5018" />
                <path d="M2 17L12 22L22 17" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Typography variant="h6" sx={{ color: '#111111', fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.15rem' }}>
                EVENT<span style={{ color: '#FF5018' }}>HUB</span>
              </Typography>
            </Box>

            {/* Desktop Center Navigation Pill Bar */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                bgcolor: '#EFEFEF',
                p: '4px',
                borderRadius: '100px',
                gap: 0.5
              }}
            >
              <Button component={RouterLink} to="/" size="small" sx={{ color: '#111111', fontWeight: 600, px: 2, borderRadius: '100px', fontSize: '0.825rem', bgcolor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                Home
              </Button>
              <Button component={RouterLink} to="/events" size="small" sx={{ color: '#555555', fontWeight: 600, px: 2, borderRadius: '100px', fontSize: '0.825rem', '&:hover': { color: '#111111', bgcolor: 'rgba(255,255,255,0.6)' } }}>
                Explore Events
              </Button>
              <Button component={RouterLink} to="/organizers" size="small" sx={{ color: '#555555', fontWeight: 600, px: 2, borderRadius: '100px', fontSize: '0.825rem', '&:hover': { color: '#111111', bgcolor: 'rgba(255,255,255,0.6)' } }}>
                For Organizers
              </Button>
            </Box>

            {/* Desktop & Mobile Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isAuthenticated ? (
                <>
                  {user?.role === 'organizer' && (
                    <Button
                      component={RouterLink}
                      to="/organizer/dashboard"
                      variant="contained"
                      size="small"
                      startIcon={<DashboardIcon />}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '100px', px: 2.5, py: 0.7, fontWeight: 700, bgcolor: '#111111' }}
                    >
                      Dashboard
                    </Button>
                  )}

                  {user?.role === 'admin' && (
                    <Button
                      component={RouterLink}
                      to="/admin/dashboard"
                      variant="contained"
                      startIcon={<AdminIcon />}
                      size="small"
                      sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '100px', px: 2.5, bgcolor: '#111111' }}
                    >
                      Admin
                    </Button>
                  )}

                  {user?.role === 'attendee' && (
                    <Button
                      component={RouterLink}
                      to="/bookings/my"
                      variant="contained"
                      startIcon={<TicketIcon />}
                      size="small"
                      sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '100px', px: 2.5, py: 0.7, fontWeight: 700, bgcolor: '#FF5018', color: '#FFFFFF' }}
                    >
                      My Tickets
                    </Button>
                  )}

                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
                      <Avatar src={user?.profileImage} alt={user?.name} sx={{ width: 38, height: 38, bgcolor: '#FF5018' }}>
                        {user?.name?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: { mt: 1, minWidth: 200, border: '1px solid #EFEFEF', borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111111' }}>
                        {user?.name}
                      </Typography>
                      <Chip
                        label={user?.role?.toUpperCase()}
                        size="small"
                        sx={{ mt: 0.5, height: 20, fontSize: 10, fontWeight: 800, bgcolor: '#FFECE5', color: '#FF5018' }}
                      />
                    </Box>
                    <Divider />
                    {user?.role === 'attendee' && (
                      <MenuItem component={RouterLink} to="/organizers" onClick={handleCloseMenu} sx={{ gap: 1 }}>
                        <AddIcon fontSize="small" sx={{ color: '#FF5018' }} /> Host an Event
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout} sx={{ color: '#DC2626', gap: 1 }}>
                      <LogoutIcon fontSize="small" /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <Button component={RouterLink} to="/organizers" variant="text" size="small" sx={{ color: '#111111', fontWeight: 600 }}>
                    For Organizers
                  </Button>
                  <Button component={RouterLink} to="/login" variant="contained" sx={{ borderRadius: '100px', bgcolor: '#FF5018', color: '#FFFFFF', px: 3, fontWeight: 700 }}>
                    Log In
                  </Button>
                </Stack>
              )}

              {/* Mobile Hamburger Drawer Icon */}
              <IconButton
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: '#111111' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{ sx: { width: 280, p: 2, bgcolor: '#FFFFFF' } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>EventHub Menu</Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/" onClick={() => setMobileDrawerOpen(false)}>
                <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/events" onClick={() => setMobileDrawerOpen(false)}>
                <ListItemText primary="Explore Events" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/organizers" onClick={() => setMobileDrawerOpen(false)}>
                <ListItemText primary="For Organizers" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/privacy" onClick={() => setMobileDrawerOpen(false)}>
                <ListItemText primary="Privacy Policy" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/terms" onClick={() => setMobileDrawerOpen(false)}>
                <ListItemText primary="Terms & Conditions" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
