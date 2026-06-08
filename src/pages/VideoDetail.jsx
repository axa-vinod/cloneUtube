import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbDown as ThumbDownIcon,
  ThumbDownOutlined as ThumbDownOutlinedIcon,
  Reply as ShareIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { fetchVideoDetail, fetchChannelDetail } from '../services/youtubeApi';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import RelatedVideos from '../components/RelatedVideos';

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isDisliked, setIsDisliked] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Auth Modal prompt state
  const [authPromptType, setAuthPromptType] = useState(null); // 'like' | 'subscribe' | null

  // AuthContext bindings
  const {
    user,
    userData,
    addToHistory,
    toggleLikeVideo,
    toggleSubscribeChannel,
  } = useAuth();

  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fake download state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    let active = true;

    const loadVideoAndDetails = async () => {
      // Defer execution to microtask to satisfy React linter
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      setVideo(null);
      setChannel(null);

      try {
        // Fetch Video Detail
        const videoData = await fetchVideoDetail(id);
        if (!active) return;
        setVideo(videoData);

        // Add to global watch history if user is logged in
        if (user) {
          addToHistory(videoData);
        }

        // Fetch Channel Details
        const channelId = videoData.snippet?.channelId;
        if (channelId) {
          const channelData = await fetchChannelDetail(channelId);
          if (active) {
            setChannel(channelData);
          }
        }

        if (active) {
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error loading video detail page:', err);
          setError('Failed to load video details.');
          setLoading(false);
        }
      }
    };

    loadVideoAndDetails();

    return () => {
      active = false;
    };
  }, [id, user, addToHistory]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !video) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'Video not found.'}</Alert>
      </Box>
    );
  }

  const snippet = video.snippet || {};
  const channelTitle = snippet.channelTitle || '';
  const channelId = snippet.channelId || '';
  const categoryId = snippet.categoryId || '';

  // Derive like states from AuthContext
  const isLiked = userData.likedVideos.some((v) => (v.id?.videoId || v.id) === video.id);
  const rawLikes = video.statistics?.likeCount ? parseInt(video.statistics.likeCount) : 12500;
  const likeCount = isLiked ? rawLikes + 1 : rawLikes;

  // Derive subscription states from AuthContext
  const isSubscribed = userData.subscriptions.some((sub) => (sub.id?.channelId || sub.id) === channelId);
  
  // Calculate subscriber numbers
  const rawSubs = channel?.statistics?.subscriberCount ? parseInt(channel.statistics.subscriberCount) : 450000;
  const totalSubscribers = isSubscribed ? rawSubs + 1 : rawSubs;
  
  let subCountText;
  if (totalSubscribers >= 1000000) {
    subCountText = `${(totalSubscribers / 1000000).toFixed(2)}M`;
  } else if (totalSubscribers >= 1000) {
    subCountText = `${(totalSubscribers / 1000).toFixed(0)}K`;
  } else {
    subCountText = `${totalSubscribers}`;
  }

  const rawViews = video.statistics?.viewCount ? parseInt(video.statistics.viewCount) : 89400;
  const viewsText = rawViews.toLocaleString();

  const handleLikeToggle = () => {
    if (!user) {
      setAuthPromptType('like');
      return;
    }
    toggleLikeVideo(video);
    if (isDisliked) {
      setIsDisliked(false);
    }
  };

  const handleDislikeToggle = () => {
    if (!user) {
      setAuthPromptType('like');
      return;
    }
    setIsDisliked((prev) => !prev);
    if (isLiked) {
      toggleLikeVideo(video); // Untoggle like
    }
  };

  const handleSubscribeToggle = () => {
    if (!user) {
      setAuthPromptType('subscribe');
      return;
    }
    const subPayload = channel || {
      id: channelId,
      snippet: {
        title: channelTitle,
        thumbnails: {
          default: { url: snippet.thumbnails?.default?.url || '' }
        }
      }
    };
    toggleSubscribeChannel(subPayload);
  };

  const handleAuthPromptClose = () => {
    setAuthPromptType(null);
  };

  const handleAuthPromptSignIn = () => {
    setAuthPromptType(null);
    navigate('/login');
  };

  const handleShareClick = () => {
    const videoLink = window.location.href;
    navigator.clipboard.writeText(videoLink).then(() => {
      setSnackbarMessage('Video link copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  const handleDownloadClick = () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            setSnackbarMessage('Mock download finished successfully!');
            setSnackbarOpen(true);
          }, 800);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 56px)', py: 3, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        {/* Left Video Player & Main Details Column */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          {/* Responsive aspect ratio positioning container */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#000',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              title={snippet.title || 'YouTube video player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </Box>

          {/* Video Title */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
            dangerouslySetInnerHTML={{ __html: snippet.title }}
          />

          {/* Channel Info & Actions Bar */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            {/* Channel Info Side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none' }}>
                <Avatar
                  src={channel?.snippet?.thumbnails?.default?.url}
                  sx={{ width: 44, height: 44 }}
                >
                  {channelTitle.charAt(0)}
                </Avatar>
              </Link>
              <Box>
                <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    {channelTitle}
                    <CheckCircleIcon sx={{ fontSize: 15, ml: 0.5, color: 'text.secondary' }} />
                  </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {subCountText} subscribers
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleSubscribeToggle}
                sx={{
                  ml: 2,
                  px: 3,
                  fontWeight: 'bold',
                  borderRadius: 20,
                  bgcolor: isSubscribed ? 'background.hover' : '#FF0000',
                  color: isSubscribed ? 'text.primary' : '#fff',
                  '&:hover': {
                    bgcolor: isSubscribed ? 'background.hover' : '#CC0000',
                    opacity: 0.9,
                  },
                }}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </Box>

            {/* Actions Buttons Side */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* Like / Dislike Pill */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.hover',
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <Button
                  onClick={handleLikeToggle}
                  startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  color="inherit"
                  sx={{
                    px: 2,
                    borderRadius: 0,
                    color: isLiked ? 'primary.main' : 'inherit',
                  }}
                >
                  {likeCount.toLocaleString()}
                </Button>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
                <Button
                  onClick={handleDislikeToggle}
                  startIcon={isDisliked ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
                  color="inherit"
                  sx={{
                    px: 1.5,
                    borderRadius: 0,
                    minWidth: 40,
                    color: isDisliked ? 'primary.main' : 'inherit',
                  }}
                />
              </Box>

              {/* Share */}
              <Button
                onClick={handleShareClick}
                startIcon={<ShareIcon style={{ transform: 'scaleX(-1)' }} />}
                color="inherit"
                sx={{ bgcolor: 'background.hover', borderRadius: 20, px: 2 }}
              >
                Share
              </Button>

              {/* Download */}
              <Button
                onClick={handleDownloadClick}
                startIcon={downloading ? null : <DownloadIcon />}
                color="inherit"
                disabled={downloading}
                sx={{
                  bgcolor: 'background.hover',
                  borderRadius: 20,
                  px: 2,
                  minWidth: 120,
                  position: 'relative',
                }}
              >
                {downloading ? `Downloading ${downloadProgress}%` : 'Download'}
                {downloading && (
                  <LinearProgress
                    variant="determinate"
                    value={downloadProgress}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  />
                )}
              </Button>
            </Box>
          </Box>

          {/* Expandable Description Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'background.hover',
              cursor: 'pointer',
              mb: 4,
            }}
            onClick={() => setDescExpanded((prev) => !prev)}
          >
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {viewsText} views
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : ''}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                fontSize: '0.85rem',
                display: '-webkit-box',
                WebkitLineClamp: descExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {snippet.description || 'No description provided.'}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mt: 1.5 }}>
              {descExpanded ? 'Show less' : '...more'}
            </Typography>
          </Paper>

          {/* Comments Panel */}
          <CommentSection videoId={video.id} />
        </Grid>

        {/* Right Recommended Side Grid Column */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          {/* Custom RelatedVideos component with continuous load options */}
          <RelatedVideos videoId={video.id} categoryId={categoryId} />
        </Grid>
      </Grid>

      {/* Auth Prompt Trigger Modal */}
      <Dialog
        open={Boolean(authPromptType)}
        onClose={handleAuthPromptClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1.5,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
          {authPromptType === 'like' ? 'Like this video?' : 'Want to subscribe to this channel?'}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {authPromptType === 'like'
              ? 'Sign in to make your opinion count and save this video.'
              : 'Sign in to subscribe to this channel and get updates.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleAuthPromptClose} color="inherit" sx={{ fontWeight: 'bold' }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleAuthPromptSignIn}
            startIcon={<AccountCircleIcon />}
            sx={{
              borderRadius: 20,
              color: '#3ea6ff',
              borderColor: 'rgba(255,255,255,0.15)',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(62, 166, 255, 0.1)',
                borderColor: '#3ea6ff',
              },
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
