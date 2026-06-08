import { MOCK_VIDEOS, MOCK_CHANNELS } from '../utils/constants';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || import.meta.env.REACT_APP_YOUTUBE_API_KEY || '';

const isApiKeyProvided = () => {
  return API_KEY && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';
};

async function youtubeFetch(endpoint, params = {}) {
  if (!isApiKeyProvided()) {
    throw new Error('API key not configured in environment.');
  }

  const queryParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `YouTube API responded with status ${response.status}`);
  }

  return response.json();
}

/**
 * Generate paginated mock data to simulate unlimited video loading when API key is missing
 */
function paginateMockData(baseList, pageToken, limit = 12) {
  const pageIndex = pageToken ? parseInt(pageToken.replace('page_', '')) || 0 : 0;
  
  // Create variations of base list to feel like new content
  const items = Array.from({ length: limit }).map((_, index) => {
    const baseItem = baseList[(index + pageIndex * limit) % baseList.length];
    const isSearchFormat = typeof baseItem.id === 'object';
    
    // Construct variations
    let videoId = isSearchFormat ? baseItem.id.videoId : baseItem.id;
    // Vary the ID slightly for subsequent pages so React keys don't clash
    if (pageIndex > 0) {
      videoId = `${videoId}_p${pageIndex}_i${index}`;
    }

    return {
      ...baseItem,
      id: isSearchFormat ? { kind: 'youtube#video', videoId } : videoId,
      snippet: {
        ...baseItem.snippet,
        title: pageIndex > 0 ? `${baseItem.snippet.title} (Part ${pageIndex + 1})` : baseItem.snippet.title,
      },
    };
  });

  return {
    items,
    nextPageToken: `page_${pageIndex + 1}`,
  };
}

/**
 * Fetch most popular videos (Home feed)
 */
export async function fetchPopularVideos(pageToken = '') {
  try {
    const data = await youtubeFetch('videos', {
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      maxResults: 12,
      regionCode: 'US',
      ...(pageToken && { pageToken }),
    });
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.warn('YouTube API fetchPopularVideos failed, using mock pagination fallback. Error:', error.message);
    return paginateMockData(MOCK_VIDEOS, pageToken, 12);
  }
}

/**
 * Fetch videos by search term (Search feed)
 */
export async function fetchSearchVideos(query, pageToken = '') {
  try {
    const data = await youtubeFetch('search', {
      part: 'snippet',
      q: query,
      maxResults: 12,
      type: 'video',
      ...(pageToken && { pageToken }),
    });
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.warn(`YouTube API fetchSearchVideos for "${query}" failed, using mock pagination.`, error.message);
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_VIDEOS.filter(
      (v) =>
        v.snippet.title.toLowerCase().includes(lowerQuery) ||
        v.snippet.description.toLowerCase().includes(lowerQuery) ||
        v.snippet.category.toLowerCase().includes(lowerQuery)
    );
    const sourceList = filtered.length > 0 ? filtered : MOCK_VIDEOS;
    return paginateMockData(sourceList, pageToken, 12);
  }
}

/**
 * Fetch video details (Watch page)
 */
export async function fetchVideoDetail(id) {
  try {
    // If ID contains pagination parts from mock data, strip it to fetch details
    const cleanId = id.split('_p')[0];
    const data = await youtubeFetch('videos', {
      part: 'snippet,statistics,contentDetails',
      id: cleanId,
    });
    if (data.items && data.items.length > 0) {
      // Retain the actual requested ID so routing maps perfectly
      const item = data.items[0];
      return { ...item, id };
    }
    throw new Error('Video not found in API response.');
  } catch (error) {
    console.warn(`YouTube API fetchVideoDetail for ID "${id}" failed, using mock fallback. Error:`, error.message);
    const cleanId = id.split('_p')[0];
    const mock = MOCK_VIDEOS.find((v) => v.id === cleanId) || MOCK_VIDEOS[0];
    return { ...mock, id };
  }
}

/**
 * Fetch channel branding and statistics
 */
export async function fetchChannelDetail(channelId) {
  try {
    const data = await youtubeFetch('channels', {
      part: 'snippet,statistics,brandingSettings',
      id: channelId,
    });
    if (data.items && data.items.length > 0) {
      return data.items[0];
    }
    throw new Error('Channel not found in API response.');
  } catch (error) {
    console.warn(`YouTube API fetchChannelDetail for ID "${channelId}" failed, using mock fallback. Error:`, error.message);
    const mock = MOCK_CHANNELS[channelId] || Object.values(MOCK_CHANNELS)[0];
    return mock;
  }
}

/**
 * Fetch videos uploaded by a channel
 */
export async function fetchChannelVideos(channelId, pageToken = '') {
  try {
    const data = await youtubeFetch('search', {
      part: 'snippet',
      channelId: channelId,
      maxResults: 12,
      order: 'date',
      type: 'video',
      ...(pageToken && { pageToken }),
    });
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.warn(`YouTube API fetchChannelVideos for ID "${channelId}" failed, using mock fallback. Error:`, error.message);
    const filtered = MOCK_VIDEOS.filter((v) => v.snippet.channelId === channelId || v.snippet.channelId === 'mkbhd');
    return paginateMockData(filtered, pageToken, 12);
  }
}

/**
 * Fetch related/recommended videos
 */
export async function fetchRelatedVideos(videoId, categoryId, pageToken = '') {
  try {
    const qParam = categoryId ? `category:${categoryId}` : 'tech';
    const data = await youtubeFetch('search', {
      part: 'snippet',
      maxResults: 10,
      type: 'video',
      q: qParam,
      ...(pageToken && { pageToken }),
    });
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.warn(`YouTube API fetchRelatedVideos for ID "${videoId}" failed, using mock fallback. Error:`, error.message);
    const cleanId = videoId.split('_p')[0];
    const filtered = MOCK_VIDEOS.filter((v) => v.id !== cleanId);
    return paginateMockData(filtered, pageToken, 10);
  }
}
