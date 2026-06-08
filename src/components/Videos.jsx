import { Grid, Box, Skeleton } from '@mui/material';
import VideoCard from './VideoCard';

export default function Videos({ videos, loading }) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(12)).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Box sx={{ width: '100%' }}>
              {/* Thumbnail skeleton */}
              <Skeleton
                variant="rectangular"
                sx={{ width: '100%', aspectRatio: '16/9', borderRadius: 3, mb: 1.5 }}
                animation="wave"
              />
              {/* Info details skeleton */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Skeleton variant="circular" width={36} height={36} animation="wave" />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="90%" height={20} sx={{ mb: 1 }} animation="wave" />
                  <Skeleton width="60%" height={15} sx={{ mb: 0.5 }} animation="wave" />
                  <Skeleton width="45%" height={15} animation="wave" />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {videos.map((video, idx) => {
        // Handle search result objects where ID might be a nested object or string
        const videoId = video.id?.videoId || video.id;
        if (!videoId) return null;
        
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${videoId}-${idx}`}>
            <VideoCard video={video} />
          </Grid>
        );
      })}
    </Grid>
  );
}
