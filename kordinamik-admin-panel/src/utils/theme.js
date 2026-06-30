import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626', // Red color from your frontend
      light: '#ef4444',
      dark: '#991b1b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e293b', // Dark blue/slate color
      light: '#334155',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 16px 24px rgba(0, 0, 0, 0.05)',
    '0px 24px 32px rgba(0, 0, 0, 0.05)',
    '0px 32px 40px rgba(0, 0, 0, 0.05)',
    '0px 40px 48px rgba(0, 0, 0, 0.05)',
    '0px 48px 56px rgba(0, 0, 0, 0.05)',
    '0px 56px 64px rgba(0, 0, 0, 0.05)',
    '0px 64px 72px rgba(0, 0, 0, 0.05)',
    '0px 72px 80px rgba(0, 0, 0, 0.05)',
    '0px 80px 88px rgba(0, 0, 0, 0.05)',
    '0px 88px 96px rgba(0, 0, 0, 0.05)',
    '0px 96px 104px rgba(0, 0, 0, 0.05)',
    '0px 104px 112px rgba(0, 0, 0, 0.05)',
    '0px 112px 120px rgba(0, 0, 0, 0.05)',
    '0px 120px 128px rgba(0, 0, 0, 0.05)',
    '0px 128px 136px rgba(0, 0, 0, 0.05)',
    '0px 136px 144px rgba(0, 0, 0, 0.05)',
    '0px 144px 152px rgba(0, 0, 0, 0.05)',
    '0px 152px 160px rgba(0, 0, 0, 0.05)',
    '0px 160px 168px rgba(0, 0, 0, 0.05)',
    '0px 168px 176px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 25px rgba(220, 38, 38, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dc2626',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dc2626',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'visible',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(249, 250, 251, 1)',
        },
      },
    },
  },
});

export default theme;
