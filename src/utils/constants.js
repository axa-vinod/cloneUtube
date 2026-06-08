import React from 'react';
import {
  Home as HomeIcon,
  Whatshot as TrendingIcon,
  MusicNote as MusicIcon,
  SportsEsports as GamingIcon,
  Newspaper as NewsIcon,
  EmojiEvents as SportsIcon,
} from '@mui/icons-material';

export const CATEGORIES = [
  { name: 'Home', icon: React.createElement(HomeIcon) },
  { name: 'Trending', icon: React.createElement(TrendingIcon) },
  { name: 'Music', icon: React.createElement(MusicIcon) },
  { name: 'Gaming', icon: React.createElement(GamingIcon) },
  { name: 'News', icon: React.createElement(NewsIcon) },
  { name: 'Sports', icon: React.createElement(SportsIcon) },
];

// Fallback Mock Data structured exactly in Google YouTube Data API v3 JSON schema shape
// Using REAL YouTube Video IDs for working video playback
export const MOCK_VIDEOS = [
  {
    id: '2KlhM5SRhFc', // MKBHD tech setup
    snippet: {
      title: 'The Ultimate Tech Setup Tour - 2026 Edition',
      description: 'We are looking at the most modern, clean, and productive desk setups for coding, video editing, and gaming in 2026. Feat. new OLED monitors, custom keyboards, and smart home lighting integrations. Let me know which one is your favorite in the comments!',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'mkbhd',
      channelTitle: 'Marques Brownlee',
      publishedAt: '2026-06-06T14:00:00Z',
      category: 'Tech'
    },
    statistics: {
      viewCount: '840320',
      likeCount: '42000'
    }
  },
  {
    id: 'jfKfPfyJRdk', // Lofi study girl beats
    snippet: {
      title: 'Lofi Beats to Study/Relax To ☕ 24/7 Study Session',
      description: 'Grab a warm coffee, open your IDE, and sink into this cozy lofi hip hop mix. Perfect for programmers, writers, and students who need a smooth vibe in the background.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'chillhop',
      channelTitle: 'Chillhop Music',
      publishedAt: '2026-06-01T12:00:00Z',
      category: 'Music'
    },
    statistics: {
      viewCount: '1204908',
      likeCount: '89000'
    }
  },
  {
    id: 'L_LUpnjgPso', // Cyberpunk gameplay
    snippet: {
      title: 'Cyberpunk 2077 - Next-Gen Ray Reconstruction Gameplay',
      description: 'Running Cyberpunk 2077 on an RTX 5090 with Ray Tracing Overdrive Mode, DLSS 4, and Frame Generation. Experiencing fully simulated paths of light at 4K resolution.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'gaminghub',
      channelTitle: 'Gaming Hub',
      publishedAt: '2026-06-03T10:00:00Z',
      category: 'Gaming'
    },
    statistics: {
      viewCount: '340950',
      likeCount: '18000'
    }
  },
  {
    id: 'Aq3zS-1C_nc', // Sintel CGI film
    snippet: {
      title: 'Sintel - Official Open Source Animated Short Film',
      description: 'Sintel is an independently produced short film, initiated by the Blender Foundation. The film follows a girl searching for a dragon she nurtured. Enjoy the high quality CGI.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'blender',
      channelTitle: 'Blender Studio',
      publishedAt: '2025-06-08T08:00:00Z',
      category: 'Gaming'
    },
    statistics: {
      viewCount: '4560780',
      likeCount: '245000'
    }
  },
  {
    id: '30KbR78z2m8', // Space physics / Black Hole
    snippet: {
      title: 'Why Time Dilation Actually Happens Near Black Holes',
      description: 'We explore Einstein’s General Theory of Relativity and visually demonstrate how gravitational fields warp the fabric of spacetime, causing time to tick slower near extreme masses.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'sciencefun',
      channelTitle: 'Curious Mind',
      publishedAt: '2026-05-18T16:00:00Z',
      category: 'Sports'
    },
    statistics: {
      viewCount: '2310400',
      likeCount: '178000'
    }
  },
  {
    id: '8q5H8iZ72oA', // Tech funny support
    snippet: {
      title: 'The Funniest Tech Support Disasters of all Time!',
      description: 'From users plugging power strips into themselves to programmers deleting production databases on their first day, we recount some of the funniest tech support stories.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80' },
        high: { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'mkbhd',
      channelTitle: 'Marques Brownlee',
      publishedAt: '2026-06-04T09:00:00Z',
      category: 'News'
    },
    statistics: {
      viewCount: '670400',
      likeCount: '31000'
    }
  }
];

export const MOCK_CHANNELS = {
  mkbhd: {
    id: 'mkbhd',
    snippet: {
      title: 'Marques Brownlee',
      description: 'MKBHD: Quality Tech Videos | Reviews | News | Podcasts',
      thumbnails: {
        default: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' }
      }
    },
    statistics: {
      subscriberCount: '18200000',
      videoCount: '1540'
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=1200&auto=format&fit=crop&q=80'
      }
    }
  },
  chillhop: {
    id: 'chillhop',
    snippet: {
      title: 'Chillhop Music',
      description: 'Your daily dose of chill study beats, lofi hip hop, and relaxing vibes.',
      thumbnails: {
        default: { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80' }
      }
    },
    statistics: {
      subscriberCount: '3400000',
      videoCount: '820'
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80'
      }
    }
  },
  gaminghub: {
    id: 'gaminghub',
    snippet: {
      title: 'Gaming Hub',
      description: 'Daily gaming walkthroughs, news, and highlights from your favorite creators.',
      thumbnails: {
        default: { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&auto=format&fit=crop&q=80' }
      }
    },
    statistics: {
      subscriberCount: '1200000',
      videoCount: '410'
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80'
      }
    }
  },
  blender: {
    id: 'blender',
    snippet: {
      title: 'Blender Studio',
      description: 'Official Blender open-source animations, short movies, and CGI visual effects showcase.',
      thumbnails: {
        default: { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80' }
      }
    },
    statistics: {
      subscriberCount: '850000',
      videoCount: '235'
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80'
      }
    }
  },
  sciencefun: {
    id: 'sciencefun',
    snippet: {
      title: 'Curious Mind',
      description: 'Exploring the weird, wonderful, and physics-defying mysteries of the universe.',
      thumbnails: {
        default: { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80' }
      }
    },
    statistics: {
      subscriberCount: '4700000',
      videoCount: '580'
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80'
      }
    }
  }
};
