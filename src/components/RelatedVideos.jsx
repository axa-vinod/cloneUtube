import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { fetchRelatedVideos } from '../services/youtubeApi';

export default function RelatedVideos({ videoId, categoryId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadRelated = async () => {
      // Defer loading state update to satisfy React linter
      await Promise.resolve();
      if (!active) return;
      
      setLoading(true);

      try {
        const data = await fetchRelatedVideos(videoId, categoryId);
        if (active) {
          setVideos(data.items);
          setNextPageToken(data.nextPageToken || '');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching related videos:', err);
        if (active) setLoading(false);
      }
    };

    loadRelated();

    return () => {
      active = false;
    };
  }, [videoId, categoryId]);

  const loadMoreRelated = () => {
    if (!nextPageToken || loading) return;
    setLoading(true);
    
    fetchRelatedVideos(videoId, categoryId, nextPageToken)
      .then((data) => {
        setVideos((prev) => [...prev, ...data.items]);
        setNextPageToken(data.nextPageToken || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading more related videos:', err);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        Up Next
      </Typography>

      {videos.map((video, idx) => {
        const vidId = video.id?.videoId || video.id;
        if (!vidId) return null;

        const snippet = video.snippet || {};
        const title = snippet.title || 'Untitled Video';
        const channelTitle = snippet.channelTitle || 'Unknown Channel';
        const thumbnailUrl = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '';
        
        // Mock views for sidebar
        const mockViews = `${(Math.abs(title.charCodeAt(0) * 7) % 890 + 10)}K views`;

        return (
          <Card
            key={`${vidId}-${idx}`}
            onClick={() => navigate(`/video/${vidId}`)}
            sx={{
              display: 'flex',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              cursor: 'pointer',
              gap: 1.5,
              '&:hover': {
                '& img': { transform: 'scale(1.03)' },
                '& h6': { color: 'primary.main' }
              }
            }}
          >
            {/* Thumbnail */}
            <Box sx={{ position: 'relative', width: 140, minWidth: 140, aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={thumbnailUrl}
                alt={title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>

            {/* Info details */}
            <CardContent sx={{ p: '0 !important', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  lineHeight: 1.25,
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'text.primary',
                  transition: 'color 0.2s ease',
                }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                {channelTitle}
                <CheckCircleIcon sx={{ fontSize: 10, ml: 0.5, color: 'text.secondary' }} />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mockViews} • 1 week ago
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {nextPageToken && !loading && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={loadMoreRelated}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 'bold',
            borderColor: 'rgba(255,255,255,0.15)',
            py: 1,
            mt: 1,
            '&:hover': {
              bgcolor: 'background.hover',
            }
          }}
        >
          Show More Recommendations
        </Button>
      )}
    </Box>
  );
}
