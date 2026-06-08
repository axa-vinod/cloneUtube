import { Link } from 'react-router-dom';
import { Box, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function ChannelCard({ channelDetail, marginTop }) {
  const { user, userData, toggleSubscribeChannel } = useAuth();

  const id = channelDetail?.id?.channelId || channelDetail?.id;
  const snippet = channelDetail?.snippet || {};
  const channelTitle = snippet.title || 'Unknown Channel';
  const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '';

  const subscriberCount = channelDetail?.statistics?.subscriberCount;
  const isSubscribed = userData.subscriptions.some((sub) => (sub.id?.channelId || sub.id) === id);

  // Format subscriber numbers
  let subCountText;
  if (subscriberCount) {
    const rawSubs = parseInt(subscriberCount);
    const totalSubscribers = isSubscribed ? rawSubs + 1 : rawSubs;
    if (totalSubscribers >= 1000000) {
      subCountText = `${(totalSubscribers / 1000000).toFixed(1)}M subscribers`;
    } else if (totalSubscribers >= 1000) {
      subCountText = `${(totalSubscribers / 1000).toFixed(0)}K subscribers`;
    } else {
      subCountText = `${totalSubscribers} subscribers`;
    }
  } else {
    subCountText = isSubscribed ? '450K subscribers' : '449K subscribers';
  }

  const handleSubscribeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please Sign In first to subscribe to channels.');
      return;
    }
    toggleSubscribeChannel(channelDetail);
  };

  if (!id) return null;

  return (
    <Box
      sx={{
        boxShadow: 'none',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: { xs: '356px', md: '320px' },
        height: '326px',
        margin: 'auto',
        marginTop,
        backgroundColor: 'background.card',
        transition: 'transform 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Link to={`/channel/${id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          <CardMedia
            image={thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
            alt={channelTitle}
            sx={{
              borderRadius: '50%',
              height: '180px',
              width: '180px',
              mb: 2,
              border: '1px solid #e3e3e3',
              mx: 'auto',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {channelTitle}
            <CheckCircleIcon sx={{ fontSize: 14, color: 'text.secondary', ml: '5px' }} />
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', my: 1 }}>
            {subCountText}
          </Typography>

          <Button
            variant="contained"
            onClick={handleSubscribeClick}
            sx={{
              borderRadius: 20,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              mt: 1,
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
        </CardContent>
      </Link>
    </Box>
  );
}
