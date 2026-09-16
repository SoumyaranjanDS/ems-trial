import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5018',
      light: '#FF6B38',
      dark: '#E04000',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#111111',
      light: '#222222',
      dark: '#000000',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#111111',
      secondary: '#666666'
    },
    divider: '#EBEBEB'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', color: '#111111' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', color: '#111111' },
    h3: { fontWeight: 700, color: '#111111' },
    h4: { fontWeight: 700, color: '#111111' },
    h5: { fontWeight: 700, color: '#111111' },
    h6: { fontWeight: 700, color: '#111111' },
    subtitle1: { color: '#666666' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            boxShadow: 'none',
            transform: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          backgroundColor: '#FFFFFF'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF !important',
          borderRadius: 12,
          border: '1px solid #EBEBEB',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12) !important',
          padding: '4px 0'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111111',
          fontWeight: 600,
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: '#FFF7F4 !important',
            color: '#FF5018'
          },
          '&.Mui-selected': {
            backgroundColor: '#FFECE5 !important',
            color: '#FF5018',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#FFECE5 !important'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 100
        }
      }
    }
  }
});

export default theme;
