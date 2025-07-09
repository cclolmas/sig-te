import { createTheme } from '@mui/material/styles';

// Paleta baseada no Design System Gov.br (firma)
const govBrTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1351B4', // azul gov.br
    },
    secondary: {
      main: '#FFCD07', // amarelo gov.br
    },
    success: {
      main: '#168821',
    },
    error: {
      main: '#E52207',
    },
    warning: {
      main: '#FFCD07',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#6C757D',
    },
  },
  typography: {
    fontFamily: 'Noto Sans, sans-serif',
    fontSize: 16,
    h1: {
      fontSize: '2rem',
      color: '#0C326F',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      color: '#0C326F',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      color: '#212529',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8, // padrão Material UI
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          minHeight: 44,
          textTransform: 'none',
          padding: '8px 24px',
        },
        containedPrimary: {
          backgroundColor: '#1351B4',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0C326F',
          },
        },
        outlinedPrimary: {
          borderColor: '#1351B4',
          color: '#1351B4',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default govBrTheme;
