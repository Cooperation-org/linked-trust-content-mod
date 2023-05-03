import { Shadows } from '@mui/material';
import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#320a8d',
      light: '#320a8d',
      dark: '#4a148c',
    },
    info: {
      main: '#eeeeee',
      light: '#f5f5f5',
      dark: '#bdbdbd',
    },
    secondary: {
      main: '#6309ff',
      light: '#6309ff',
      dark: '#00867d',
      contrastText: '#000',
    },
    text: {
      primary: '#320a8d',
      secondary: '#858ec6',
    },
  },
  typography: {
    fontFamily: 'Inter',
    h2: {
      fontSize: '80px',
      lineHeight: 1.5,
      letterSpacing: '-0.5px',
      fontWeight: 800,
    },
    h4: {
      fontSize: '34px',
      fontWeight: 600,
    },
    h6: {
      fontSize: '20px',
      lineHeight: '160%',
    },
    body1: {
      fontSize: '16px',
      lineHeight: '28px',
    },
    body2: {
      fontSize: '14px',
      lineHeight: '24px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 'bold',
        },
      },
    },
  },
});

const customShadow =
  '0px 3px 1px -2px #E9EBFA, 0px 2px 2px rgba(233, 235, 250, 0.5), 0px 1px 5px rgba(233, 235, 250, 0.2)';
const newShadows = [...theme.shadows] as Shadows;
newShadows.splice(1, 0, customShadow);

const theme2 = createTheme(theme, {
  shadows: newShadows,
});

export default theme2;
