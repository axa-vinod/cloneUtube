import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF0000', // YouTube Red
      },
      secondary: {
        main: mode === 'dark' ? '#ffffff' : '#0f0f0f',
      },
      background: {
        default: mode === 'dark' ? '#0f0f0f' : '#f9f9f9',
        paper: mode === 'dark' ? '#0f0f0f' : '#ffffff',
        card: mode === 'dark' ? '#1f1f1f' : '#ffffff',
        search: mode === 'dark' ? '#121212' : '#f0f0f0',
        hover: mode === 'dark' ? '#272727' : '#e5e5e5',
      },
      text: {
        primary: mode === 'dark' ? '#f1f1f1' : '#0f0f0f',
        secondary: mode === 'dark' ? '#aaaaaa' : '#606060',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '0.9rem',
      },
      subtitle2: {
        fontSize: '0.8rem',
        fontWeight: 400,
      },
      body1: {
        fontSize: '0.9rem',
      },
      body2: {
        fontSize: '0.8rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
