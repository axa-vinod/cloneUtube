import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Tooltip,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Mic as MicIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  YouTube as YouTubeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { NOTIFICATIONS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar({ toggleTheme, mode, toggleSidebar }) {
  const [micActive, setMicActive] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  // Use Firebase AuthContext state
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleMicClick = () => {
    setMicActive(true);
    // Simulate speech recognition
    setTimeout(() => {
      setMicActive(false);
      navigate('/search/Tech setup tour');
    }, 1500);
  };

  const handleProfileMenuOpen = (e) => setAnchorElProfile(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorElProfile(null);

  const handleNotificationsOpen = (e) => setAnchorElNotifications(e.currentTarget);
  const handleNotificationsClose = () => setAnchorElNotifications(null);

  const handleUploadOpen = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Upload feature coming soon!');
  };

  const unreadNotificationsCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: mode === 'dark' ? 'rgba(15, 15, 15, 0.85)' : 'rgba(249, 249, 249, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleSidebar} edge="start" sx={{ mr: { xs: 0.5, sm: 2 } }}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <YouTubeIcon sx={{ color: '#FF0000', fontSize: { xs: 28, sm: 36 }, mr: 0.5 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: -1,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                fontFamily: '"Outfit", sans-serif',
                display: { xs: 'none', sm: 'block' },
                background: mode === 'dark' ? 'linear-gradient(90deg, #fff 0%, #aaa 100%)' : 'linear-gradient(90deg, #000 0%, #555 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Vidio
            </Typography>
          </Link>
        </Box>

        {/* Middle Section (Search) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: { xs: 220, sm: 600 },
            mx: { xs: 1, sm: 4 },
          }}
        >
          <SearchBar />

          {/* Voice Search */}
          <Tooltip title={micActive ? 'Listening...' : 'Search with your voice'}>
            <IconButton
              onClick={handleMicClick}
              sx={{
                ml: { xs: 0.5, sm: 1.5 },
                backgroundColor: micActive ? '#FF0000' : (mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                color: micActive ? '#fff' : 'inherit',
                animation: micActive ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)' },
                },
                '&:hover': {
                  backgroundColor: micActive ? '#CC0000' : (mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
                },
              }}
            >
              <MicIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          {/* Create Button */}
          <Tooltip title="Create">
            <IconButton onClick={handleUploadOpen}>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle Button */}
          <Tooltip title={mode === 'dark' ? 'Use Light Theme' : 'Use Dark Theme'}>
            <IconButton onClick={toggleTheme}>
              {mode === 'dark' ? <LightModeIcon sx={{ color: '#ffb300' }} /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton onClick={handleNotificationsOpen}>
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Account or Sign In Button */}
          {user ? (
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                sx={{ width: 32, height: 32, border: '1.5px solid transparent' }}
                src={user.avatar}
                alt={user.name}
              />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              startIcon={<AccountCircleIcon />}
              sx={{
                borderRadius: 20,
                color: '#3ea6ff',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                fontWeight: 'bold',
                px: 2,
                py: 0.5,
                fontSize: '0.85rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(62, 166, 255, 0.1)',
                  borderColor: '#3ea6ff',
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Notifications Dropdown Menu */}
      <Menu
        anchorEl={anchorElNotifications}
        open={Boolean(anchorElNotifications)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1.5,
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 8,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}>
            Mark all as read
          </Typography>
        </Box>
        <Divider />
        {NOTIFICATIONS.map((notif) => (
          <MenuItem
            key={notif.id}
            onClick={handleNotificationsClose}
            sx={{
              whiteSpace: 'normal',
              py: 1.5,
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
              backgroundColor: !notif.read ? (mode === 'dark' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(255, 0, 0, 0.02)') : 'inherit',
            }}
          >
            <Avatar src={notif.channel.avatar} sx={{ width: 36, height: 36 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: !notif.read ? 600 : 400 }}>
                <strong>{notif.channel.name}</strong> {notif.text}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                {notif.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User Profile Dropdown Menu */}
      {user && (
        <Menu
          anchorEl={anchorElProfile}
          open={Boolean(anchorElProfile)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 240,
              mt: 1.5,
              border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 3,
              boxShadow: 8,
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Avatar src={user.avatar} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>Your Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Vidio Studio</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Switch account</MenuItem>
          <MenuItem onClick={() => { handleProfileMenuClose(); logout(); navigate('/'); }}>Sign out</MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleProfileMenuClose(); toggleTheme(); }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="body2">Appearance: {mode === 'dark' ? 'Dark' : 'Light'}</Typography>
              {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </Box>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
        </Menu>
      )}
    </AppBar>
  );
}
