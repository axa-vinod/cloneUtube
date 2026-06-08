import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  WatchLater as WatchLaterIcon,
  WatchLaterOutlined as WatchLaterOutlinedIcon,
  PlaylistAdd as PlaylistAddIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Simple hash helper to generate consistent mock statistics for API search results
const getMockStats = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const viewsVal = (absHash % 890) + 10; // Between 10 and 900
  const views = viewsVal > 500 ? `${(viewsVal / 100).toFixed(1)}M views` : `${viewsVal}K views`;
  
  const days = (absHash % 28) + 1;
  const uploadedAt = days === 1 ? '1 day ago' : `${days} days ago`;
  
  return { views, uploadedAt };
};

export default function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // AuthContext bindings
  const { user, userData, toggleWatchLater } = useAuth();

  const handleMenuOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAnchorEl(null);
  };

  // Safe parsing for YouTube API response format
  const videoId = video.id?.videoId || video.id;
  const snippet = video.snippet || {};
  const title = snippet.title || 'Untitled Video';
  const channelId = snippet.channelId || '';
  const channelTitle = snippet.channelTitle || 'Unknown Channel';
  const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '';
  
  // Parse stats or generate mock fallbacks for search results
  const hasStats = video.statistics && video.statistics.viewCount;
  let viewCountText;
  let uploadedAtText = '';
  
  if (hasStats) {
    const rawViews = parseInt(video.statistics.viewCount);
    if (rawViews >= 1000000) {
      viewCountText = `${(rawViews / 1000000).toFixed(1)}M views`;
    } else if (rawViews >= 1000) {
      viewCountText = `${(rawViews / 1000).toFixed(0)}K views`;
    } else {
      viewCountText = `${rawViews} views`;
    }
    
    // Parse date
    if (snippet.publishedAt) {
      const diffTime = Math.abs(new Date() - new Date(snippet.publishedAt));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      uploadedAtText = diffDays <= 1 ? 'today' : `${diffDays} days ago`;
    }
  } else {
    const mock = getMockStats(title);
    viewCountText = mock.views;
    uploadedAtText = mock.uploadedAt;
  }

  const isSavedWatchLater = userData.watchLater.some((v) => (v.id?.videoId || v.id) === videoId);

  const handleWatchLaterClick = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please Sign In first to save videos.');
      navigate('/login');
      return;
    }
    toggleWatchLater(video);
    if (anchorEl) {
      handleMenuClose();
    }
  };

  const handleActionClick = (actionName) => {
    if (!user) {
      alert(`Please Sign In first to use ${actionName}.`);
      navigate('/login');
      return;
    }
    alert(`Mock: Added to ${actionName}`);
    handleMenuClose();
  };

  if (!videoId) return null;

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/video/${videoId}`)}
      sx={{
        width: '100%',
        backgroundColor: 'background.card',
        boxShadow: 'none',
        cursor: 'pointer',
        borderRadius: 3,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        },
      }}
    >
      {/* Thumbnail Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <CardMedia
          component="img"
          image={thumbnailUrl}
          alt={title}
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Floating Quick Action Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: hovered ? 8 : -40,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            transition: 'right 0.2s ease',
            zIndex: 2,
          }}
        >
          <Tooltip title={isSavedWatchLater ? 'Remove from Watch Later' : 'Watch Later'} placement="left">
            <IconButton
              size="small"
              onClick={handleWatchLaterClick}
              sx={{
                bgcolor: isSavedWatchLater ? 'primary.main' : 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                '&:hover': { bgcolor: isSavedWatchLater ? '#cc0000' : '#FF0000' },
              }}
            >
              {isSavedWatchLater ? <WatchLaterIcon fontSize="small" /> : <WatchLaterOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Add to Playlist" placement="left">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick('Playlist');
              }}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                '&:hover': { bgcolor: '#FF0000' },
              }}
            >
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Play Icon Overlay on Hover */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              transform: hovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 0.25s ease',
            }}
          >
            <PlayArrowIcon sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
        </Box>

        {/* Video Duration (Optional Mock Badge) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            px: 1,
            py: 0.2,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            zIndex: 2,
          }}
        >
          {video.contentDetails?.duration ? video.contentDetails.duration.replace('PT','').toLowerCase() : '12:30'}
        </Box>
      </Box>

      {/* Card Details */}
      <CardContent sx={{ p: 1.5, pb: '16px !important' }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {/* Channel Avatar Placeholder */}
          <Link
            to={`/channel/${channelId}`}
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: 'none' }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                bgcolor: 'secondary.main',
                border: '1.5px solid transparent',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              {channelTitle.charAt(0)}
            </Avatar>
          </Link>

          {/* Texts */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: 1.3,
                mb: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
              }}
              dangerouslySetInnerHTML={{ __html: title }} // Parse HTML entities in titles returned by API
            />

            <Link
              to={`/channel/${channelId}`}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '&:hover': { color: 'text.primary' },
                  noWrap: true,
                }}
              >
                {channelTitle}
              </Typography>
              <CheckCircleIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            </Link>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.3 }}>
              {viewCountText} • {uploadedAtText}
            </Typography>
          </Box>

          {/* More Action Menu Button */}
          <Box sx={{ alignSelf: 'flex-start' }}>
            <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.2 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Menu Options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleActionClick('Queue')}>Add to queue</MenuItem>
        <MenuItem onClick={handleWatchLaterClick}>
          {isSavedWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('Playlist')}>Save to playlist</MenuItem>
      </Menu>
    </Card>
  );
}
