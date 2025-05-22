import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Dependencies from './pages/Dependencies';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#DB0011', // HSBC Red
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // HSBC Black
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dependencies" element={<Dependencies />} />
            {/* Temporarily comment out other routes until we create the components */}
            {/* <Route path="/rules" element={<Rules />} /> */}
            {/* <Route path="/reports" element={<Reports />} /> */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 