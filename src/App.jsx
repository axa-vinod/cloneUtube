import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography, Button } from '@mui/material';
import { getTheme } from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Sleek fallback component for unfinished routes to give a premium finished feel
function MockPage({ title }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px)',
        textAlign: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        {title} Page
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        This is a mock screen demonstrating the routing for the YouTube clone. 
        You can navigate back to Home to watch videos or search.
      </Typography>
      <Button variant="contained" color="primary" href="/" sx={{ borderRadius: 20, px: 4 }}>
        Go Back Home
      </Button>
    </Box>
  );
}

function MainAppLayout() {
  const [mode, setMode] = useState('dark'); // dark mode by default
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = getTheme(mode);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <Navbar toggleTheme={toggleTheme} mode={mode} toggleSidebar={toggleSidebar} />

        {/* Main Body */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Collapsible Sidebar */}
          <Sidebar isOpen={sidebarOpen} mode={mode} />

          {/* Page Routing Container */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.default' }}>
            <Routes>
              {/* Primary Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/channel/:id" element={<Profile />} />
              <Route path="/search/:searchTerm" element={<SearchResults />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Redirect library helpers directly to Profile dashboard */}
              <Route path="/library" element={<Profile />} />
              <Route path="/history" element={<Profile />} />
              <Route path="/watch-later" element={<Profile />} />
              <Route path="/liked-videos" element={<Profile />} />
              
              {/* Fallback routes */}
              <Route path="/settings" element={<MockPage title="Settings" />} />
              <Route path="/help" element={<MockPage title="Help" />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<MockPage title="Not Found" />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainAppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
