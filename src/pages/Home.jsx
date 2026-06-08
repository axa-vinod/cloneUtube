import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Alert, Button, Chip, CircularProgress } from '@mui/material';
import Videos from '../components/Videos';
import { fetchPopularVideos, fetchSearchVideos } from '../services/youtubeApi';

const HOME_CATEGORIES = [
  'All',
  'Trending',
  'Music',
  'Gaming',
  'News',
  'Sports',
  'Tech',
  'Lofi',
  'Coding',
  'Blender',
];

export default function Home() {
  const location = useLocation();
  const sidebarCategory = location.state?.category || 'Home';
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  // Sync category state when sidebar category updates
  useEffect(() => {
    const syncCategory = async () => {
      await Promise.resolve();
      if (sidebarCategory === 'Home') {
        setActiveCategory('All');
      } else {
        setActiveCategory(sidebarCategory);
      }
    };
    syncCategory();
  }, [sidebarCategory]);

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      // Defer to microtask to prevent synchronous setState warning in effect
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      setVideos([]);
      setNextPageToken(null);

      try {
        let response;
        if (activeCategory === 'All') {
          response = await fetchPopularVideos();
        } else {
          response = await fetchSearchVideos(activeCategory);
        }
        
        if (active) {
          setVideos(response.items);
          setNextPageToken(response.nextPageToken || null);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching videos in Home:', err);
          setError('Failed to fetch videos. Please check your network or API keys.');
          setLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      active = false;
    };
  }, [activeCategory]);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    
    try {
      setLoadingMore(true);
      let response;
      if (activeCategory === 'All') {
        response = await fetchPopularVideos(nextPageToken);
      } else {
        response = await fetchSearchVideos(activeCategory, nextPageToken);
      }
      
      setVideos((prev) => [...prev, ...response.items]);
      setNextPageToken(response.nextPageToken || null);
    } catch (err) {
      console.error('Error loading more videos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleChipClick = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      {/* Scrollable Category Chip Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 2,
          mb: 2,
          '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar for clean chip feel
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {HOME_CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => handleChipClick(cat)}
            sx={{
              fontWeight: 'bold',
              fontSize: '0.85rem',
              py: 1.8,
              px: 0.5,
              cursor: 'pointer',
              bgcolor: activeCategory === cat ? 'primary.main' : 'background.card',
              color: activeCategory === cat ? '#fff' : 'text.primary',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              '&:hover': {
                bgcolor: activeCategory === cat ? 'primary.main' : 'background.hover',
              },
            }}
          />
        ))}
      </Box>

      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'extrabold', mb: 3 }}>
        {activeCategory} <span style={{ color: '#FF0000' }}>Videos</span>
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Videos Grid */}
      <Videos videos={videos} loading={loading} />

      {/* Pagination Load More Button */}
      {nextPageToken && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Button
            variant="contained"
            disabled={loadingMore}
            onClick={handleLoadMore}
            sx={{
              borderRadius: 20,
              px: 5,
              py: 1.2,
              fontWeight: 'bold',
              textTransform: 'none',
              bgcolor: 'background.card',
              color: 'text.primary',
              border: '1.5px solid rgba(255,255,255,0.1)',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'background.hover',
                borderColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load More Videos'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
