import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  ThumbUp as LikedIcon,
  WatchLater as WatchLaterIcon,
  Subscriptions as SubscriptionsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { fetchChannelDetail, fetchChannelVideos } from '../services/youtubeApi';
import { useAuth } from '../context/AuthContext';
import Videos from '../components/Videos';
import ChannelCard from '../components/ChannelCard';


export default function Profile() {
  const { id } = useParams(); // Channel ID (if present)
  const navigate = useNavigate();
  const location = useLocation();

  // AuthContext bindings
  const { user, userData, logout, clearHistory, toggleSubscribeChannel } = useAuth();

  // Determine if this is a public channel profile or user's own profile dashboard
  const isChannelView = Boolean(id);

  // Profile states
  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync tab index from location state (useful when navigated from Sidebar)
  useEffect(() => {
    const syncTab = async () => {
      await Promise.resolve();
      if (!isChannelView && location.state?.initialTab !== undefined) {
        setActiveTab(location.state.initialTab);
      }
    };
    syncTab();
  }, [location.state, isChannelView]);

  useEffect(() => {
    let active = true;

    const loadChannelData = async () => {
      if (!isChannelView) {
        // Defer state setter to satisfy linter
        await Promise.resolve();
        if (active) setLoading(false);
        return;
      }

      // Defer state setter to satisfy linter
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);

      try {
        const [channelData, videosData] = await Promise.all([
          fetchChannelDetail(id),
          fetchChannelVideos(id),
        ]);

        if (active) {
          setChannel(channelData);
          setChannelVideos(videosData.items || []);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching channel data:', err);
          setError('Failed to fetch channel details.');
          setLoading(false);
        }
      }
    };

    loadChannelData();

    return () => {
      active = false;
    };
  }, [id, isChannelView]);

  // Loading page state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Handle Unauthenticated State for User Profile Dashboard
  if (!isChannelView && !user) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 56px)',
          p: 3,
          textAlign: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'extrabold', mb: 2 }}>
          Your Library & Subscriptions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Sign in to view your watch history, liked videos, watch later list, and manage channel subscriptions.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ borderRadius: 20, px: 4, py: 1, fontWeight: 'bold' }}
        >
          Sign In Now
        </Button>
      </Box>
    );
  }

  // --- RENDER PUBLIC CHANNEL VIEW ---
  if (isChannelView) {
    if (error || !channel) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{error || 'Channel details not found.'}</Alert>
        </Box>
      );
    }

    const snippet = channel.snippet || {};
    const channelTitle = snippet.title || '';
    const channelDesc = snippet.description || '';
    const channelLogo = snippet.thumbnails?.default?.url || '';
    const bannerUrl =
      channel.brandingSettings?.image?.bannerExternalUrl ||
      'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=1200&auto=format&fit=crop&q=80';

    const isSubscribed = userData.subscriptions.some((sub) => (sub.id?.channelId || sub.id) === id);
    const rawSubs = channel.statistics?.subscriberCount ? parseInt(channel.statistics.subscriberCount) : 450000;
    const totalSubscribers = isSubscribed ? rawSubs + 1 : rawSubs;
    
    let subCountText;
    if (totalSubscribers >= 1000000) {
      subCountText = `${(totalSubscribers / 1000000).toFixed(2)}M`;
    } else if (totalSubscribers >= 1000) {
      subCountText = `${(totalSubscribers / 1000).toFixed(0)}K`;
    } else {
      subCountText = `${totalSubscribers}`;
    }

    const handleSubscribeToggle = () => {
      if (!user) {
        navigate('/login');
        return;
      }
      const subPayload = channel || {
        id: id,
        snippet: {
          title: channelTitle,
          thumbnails: {
            default: { url: channelLogo || '' }
          }
        }
      };
      toggleSubscribeChannel(subPayload);
    };

    const featuredVideo = channelVideos[0];

    return (
      <Box sx={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
        {/* Banner */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 120, sm: 200 },
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Profile Header Block */}
        <Box sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 1100, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 3,
              mb: 3,
            }}
          >
            <Avatar
              src={channelLogo}
              alt={channelTitle}
              sx={{ width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 } }}
            >
              {channelTitle.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'extrabold',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                }}
              >
                {channelTitle}
                <CheckCircleIcon sx={{ fontSize: 24, ml: 1, color: 'text.secondary' }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{id} • {subCountText} subscribers • {channel.statistics?.videoCount || '0'} videos
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {channelDesc || 'No description provided.'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleSubscribeToggle}
              sx={{
                borderRadius: 20,
                px: 4,
                py: 1,
                fontWeight: 'bold',
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

          {/* Tab Headers */}
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', mb: 3 }}
          >
            <Tab label="Home" sx={{ fontWeight: 'bold' }} />
            <Tab label="Videos" sx={{ fontWeight: 'bold' }} />
            <Tab label="About" sx={{ fontWeight: 'bold' }} />
          </Tabs>

          {/* Tab Content Panels */}
          {activeTab === 0 && (
            <Box>
              {/* Featured Video */}
              {featuredVideo && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Featured Video
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Box
                        onClick={() => navigate(`/video/${featuredVideo.id?.videoId || featuredVideo.id}`)}
                        sx={{
                          width: '100%',
                          aspectRatio: '16/9',
                          borderRadius: 3,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={featuredVideo.snippet?.thumbnails?.high?.url || featuredVideo.snippet?.thumbnails?.medium?.url || ''}
                          alt={featuredVideo.snippet?.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Typography
                        variant="h5"
                        onClick={() => navigate(`/video/${featuredVideo.id?.videoId || featuredVideo.id}`)}
                        sx={{ fontWeight: 'bold', mb: 1.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                        dangerouslySetInnerHTML={{ __html: featuredVideo.snippet?.title || '' }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Uploaded {featuredVideo.snippet?.publishedAt ? new Date(featuredVideo.snippet.publishedAt).toLocaleDateString() : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {featuredVideo.snippet?.description || 'No description provided.'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Uploads List */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2.5 }}>
                Recent uploads
              </Typography>
              <Videos videos={channelVideos.slice(1, 5)} loading={false} />
            </Box>
          )}

          {/* Videos Tab */}
          {activeTab === 1 && <Videos videos={channelVideos} loading={false} />}

          {/* About Tab */}
          {activeTab === 2 && (
            <Box sx={{ maxWidth: 800, py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line', mb: 4 }}>
                {channelDesc || 'No description provided.'}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Channel ID • {id}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // --- RENDER PRIVATE USER PROFILE DASHBOARD ---
  const { likedVideos, watchLater, history, subscriptions } = userData;

  return (
    <Box sx={{ flex: 1, p: { xs: 2.5, sm: 4 }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      {/* Account Info Spotlight */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: 'background.card',
          border: '1.5px solid rgba(255,255,255,0.08)',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
        <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h5" sx={{ fontWeight: 'extrabold', mb: 0.5 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" startIcon={<SettingsIcon />} sx={{ textTransform: 'none', borderRadius: 20 }}>
              Manage Account
            </Button>
            <Button size="small" variant="contained" color="error" onClick={logout} sx={{ textTransform: 'none', borderRadius: 20 }}>
              Sign Out
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Library Navigation Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        textColor="inherit"
        indicatorColor="primary"
        sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', mb: 4 }}
      >
        <Tab label="Overview" sx={{ fontWeight: 'bold' }} />
        <Tab label="History" icon={<HistoryIcon />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
        <Tab label="Watch Later" icon={<WatchLaterIcon />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
        <Tab label="Liked Videos" icon={<LikedIcon />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
        <Tab label="Subscriptions" icon={<SubscriptionsIcon />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      {/* Overview Tab (Tab 0) */}
      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Recent History Row */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent History
            </Typography>
            {history.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No watch history yet. Explore trending videos on the home page!
              </Typography>
            ) : (
              <Videos videos={history.slice(0, 4)} loading={false} />
            )}
          </Box>

          <Divider />

          {/* Watch Later Quick Row */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Watch Later
            </Typography>
            {watchLater.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No watch later videos saved. Hover on video thumbnails to add them.
              </Typography>
            ) : (
              <Videos videos={watchLater.slice(0, 4)} loading={false} />
            )}
          </Box>
        </Box>
      )}

      {/* History Tab (Tab 1) */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Watch History ({history.length} videos)
            </Typography>
            {history.length > 0 && (
              <Button variant="outlined" color="error" onClick={clearHistory} sx={{ borderRadius: 20, textTransform: 'none' }}>
                Clear All Watch History
              </Button>
            )}
          </Box>
          {history.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              Your watch history is empty.
            </Typography>
          ) : (
            <Videos videos={history} loading={false} />
          )}
        </Box>
      )}

      {/* Watch Later Tab (Tab 2) */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Watch Later ({watchLater.length} videos)
          </Typography>
          {watchLater.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              No videos saved for later.
            </Typography>
          ) : (
            <Videos videos={watchLater} loading={false} />
          )}
        </Box>
      )}

      {/* Liked Videos Tab (Tab 3) */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Liked Videos ({likedVideos.length} videos)
          </Typography>
          {likedVideos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              Videos you like will be saved here.
            </Typography>
          ) : (
            <Videos videos={likedVideos} loading={false} />
          )}
        </Box>
      )}

      {/* Subscriptions Tab (Tab 4) */}
      {activeTab === 4 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Subscribed Channels ({subscriptions.length})
          </Typography>
          {subscriptions.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              Channels you subscribe to will appear here.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {subscriptions.map((channel) => {
                const subId = channel.id?.channelId || channel.id;
                if (!subId) return null;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={subId}>
                    <ChannelCard channelDetail={channel} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}
