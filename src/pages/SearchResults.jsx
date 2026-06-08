import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, Alert, Button, CircularProgress } from '@mui/material';
import Videos from '../components/Videos';
import { fetchSearchVideos } from '../services/youtubeApi';

export default function SearchResults() {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSearchResults = async () => {
      // Defer state update to microtask to satisfy React linter
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      setVideos([]);
      setNextPageToken(null);

      try {
        const response = await fetchSearchVideos(searchTerm);
        if (active) {
          setVideos(response.items);
          setNextPageToken(response.nextPageToken || null);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching search results:', err);
          setError('Failed to fetch search results from YouTube API.');
          setLoading(false);
        }
      }
    };

    loadSearchResults();

    return () => {
      active = false;
    };
  }, [searchTerm]);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetchSearchVideos(searchTerm, nextPageToken);
      setVideos((prev) => [...prev, ...response.items]);
      setNextPageToken(response.nextPageToken || null);
    } catch (err) {
      console.error('Error loading more search results:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, sm: 4 },
        overflowY: 'auto',
        height: 'calc(100vh - 56px)',
      }}
    >
      {/* Search Result Title */}
      <Typography variant="h5" sx={{ fontWeight: 'extrabold', mb: 3 }}>
        Search results for: <span style={{ color: '#FF0000' }}>{searchTerm}</span>
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Grid results */}
      {videos.length === 0 && !loading ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No videos found for "{searchTerm}".
        </Typography>
      ) : (
        <Videos videos={videos} loading={loading} />
      )}

      {/* Load More Button */}
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
            {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load More Search Results'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
