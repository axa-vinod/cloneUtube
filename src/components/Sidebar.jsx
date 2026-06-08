import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
} from '@mui/material';
import {
  History as HistoryIcon,
  WatchLater as WatchLaterIcon,
  ThumbUpAltOutlined as LikedIcon,
} from '@mui/icons-material';
import { CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, userData } = useAuth();
  const selectedCategory = location.state?.category || 'Home';

  const handleCategoryClick = (categoryName) => {
    navigate('/', { state: { category: categoryName } });
  };

  const libraryNavItems = [
    { text: 'History', icon: <HistoryIcon />, tabIndex: 1 },
    { text: 'Watch Later', icon: <WatchLaterIcon />, tabIndex: 2 },
    { text: 'Liked Videos', icon: <LikedIcon />, tabIndex: 3 },
  ];

  const handleLibraryClick = (tabIndex) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/profile', { state: { initialTab: tabIndex } });
  };

  // Get subscribed channels details (both mock and real YouTube channels)
  const activeSubscriptions = userData.subscriptions;

  // Render Collapsed Sidebar (small rail view)
  if (!isOpen) {
    return (
      <Box
        sx={{
          width: 72,
          flexShrink: 0,
          position: 'sticky',
          top: 56,
          height: 'calc(100vh - 56px)',
          backgroundColor: 'background.default',
          borderRight: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          overflowY: 'auto',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          py: 1,
          zIndex: 10,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name && location.pathname === '/';
          return (
            <Box
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              sx={{
                width: 64,
                height: 74,
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isSelected ? 'primary.main' : 'text.primary',
                backgroundColor: isSelected ? 'background.hover' : 'transparent',
                '&:hover': {
                  backgroundColor: 'background.hover',
                },
                mb: 0.5,
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ color: isSelected ? 'primary.main' : 'inherit' }}>{cat.icon}</Box>
              <Typography sx={{ fontSize: '0.625rem', mt: 0.5, fontWeight: isSelected ? 600 : 400 }}>
                {cat.name}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  // Render Full Sidebar
  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        position: 'sticky',
        top: 56,
        height: 'calc(100vh - 56px)',
        backgroundColor: 'background.default',
        borderRight: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' },
        zIndex: 10,
        p: 1.5,
      }}
    >
      {/* Main Categories Section */}
      <List disablePadding>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name && location.pathname === '/';
          return (
            <ListItem key={cat.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleCategoryClick(cat.name)}
                sx={{
                  borderRadius: 2.5,
                  backgroundColor: isSelected ? 'background.hover' : 'transparent',
                  color: isSelected ? 'text.primary' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'background.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'inherit', minWidth: 40 }}>
                  {cat.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: isSelected ? 600 : 400 }}>
                      {cat.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* Library Section */}
      <Typography variant="caption" sx={{ px: 2, fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1 }}>
        Library
      </Typography>
      <List disablePadding>
        {libraryNavItems.map((item) => {
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleLibraryClick(item.tabIndex)}
                sx={{
                  borderRadius: 2.5,
                  '&:hover': {
                    backgroundColor: 'background.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.85rem' }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* Subscriptions Section */}
      <Typography variant="caption" sx={{ px: 2, fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1 }}>
        Subscriptions
      </Typography>
      
      {!user || activeSubscriptions.length === 0 ? (
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 1 }}>
          {!user ? 'Sign in to see subscriptions' : 'No subscriptions yet'}
        </Typography>
      ) : (
        <List disablePadding>
          {activeSubscriptions.map((channel) => {
            const channelId = channel.id?.channelId || channel.id;
            if (!channelId) return null;
            
            const path = `/channel/${channelId}`;
            const isActive = location.pathname === path;
            const title = channel.snippet?.title || 'Subscribed Channel';
            const thumbnailUrl = channel.snippet?.thumbnails?.default?.url || '';
            
            return (
              <ListItem key={channelId} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(path)}
                  sx={{
                    borderRadius: 2.5,
                    backgroundColor: isActive ? 'background.hover' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'background.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar src={thumbnailUrl} sx={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
