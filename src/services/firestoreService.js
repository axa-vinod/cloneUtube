import { db, isFirebaseConfigured } from '../firebase/config';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
} from 'firebase/firestore';

// Initial state for simulated/real user data
const getInitialUserData = () => ({
  likedVideos: [],
  watchLater: [],
  history: [],
  subscriptions: [],
});

/**
 * Fetch user data from Firestore or LocalStorage fallback
 */
export async function getUserData(userId) {
  if (!isFirebaseConfigured || !db || !userId) {
    // LocalStorage fallback
    const key = `vidio_user_${userId || 'guest'}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : getInitialUserData();
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return {
        ...getInitialUserData(),
        ...userDocSnap.data(),
      };
    } else {
      // Initialize new user document in Firestore
      const initial = getInitialUserData();
      await setDoc(userDocRef, initial);
      return initial;
    }
  } catch (error) {
    console.error('Error in firestoreService.getUserData:', error);
    // Fallback to local storage if firestore fetch fails
    const stored = localStorage.getItem(`vidio_user_${userId}`);
    return stored ? JSON.parse(stored) : getInitialUserData();
  }
}

/**
 * Save / Update user data (likedVideos, watchLater, history, subscriptions)
 */
export async function saveUserData(userId, data) {
  if (!userId) return;

  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(`vidio_user_${userId}`, JSON.stringify(data));
    return;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
    // Also mirror to localStorage for quick sync
    localStorage.setItem(`vidio_user_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error in firestoreService.saveUserData:', error);
    localStorage.setItem(`vidio_user_${userId}`, JSON.stringify(data));
  }
}

/**
 * Fetch comments for a specific video
 */
export async function getVideoComments(videoId) {
  if (!isFirebaseConfigured || !db) {
    // LocalStorage fallback for comments
    const key = `vidio_comments_${videoId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Return standard mock comments if nothing in local storage
    return [
      {
        id: 'mock_1',
        username: 'TechEnthusiast',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop&q=80',
        text: 'This video is incredibly informative! The explanation of the technical specs was spot on.',
        time: '2 hours ago',
        likes: 42,
      },
      {
        id: 'mock_2',
        username: 'ChillVibesOnly',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&auto=format&fit=crop&q=80',
        text: 'Perfect desk setup inspo. I need that monitor arm immediately!',
        time: '1 day ago',
        likes: 18,
      },
    ];
  }

  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('videoId', '==', videoId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const comments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        // Convert firestore timestamp to human-friendly text
        time: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Just now',
      });
    });

    // If Firestore has no comments, return the initial mock ones
    if (comments.length === 0) {
      return [
        {
          id: 'mock_1',
          username: 'TechEnthusiast',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop&q=80',
          text: 'This video is incredibly informative! The explanation of the specs was spot on.',
          time: '2 hours ago',
          likes: 42,
        },
        {
          id: 'mock_2',
          username: 'ChillVibesOnly',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&auto=format&fit=crop&q=80',
          text: 'Perfect setup inspo. I need that monitor arm immediately!',
          time: '1 day ago',
          likes: 18,
        },
      ];
    }

    return comments;
  } catch (error) {
    console.error('Error fetching comments from firestore:', error);
    // LocalStorage fallback
    const key = `vidio_comments_${videoId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
}

/**
 * Add a comment to a video
 */
export async function addVideoComment(videoId, comment) {
  const newComment = {
    videoId,
    username: comment.username,
    avatar: comment.avatar || '',
    text: comment.text,
    likes: 0,
    createdAt: new Date(),
  };

  if (!isFirebaseConfigured || !db) {
    const key = `vidio_comments_${videoId}`;
    const comments = await getVideoComments(videoId);
    const updated = [
      {
        id: `local_${Date.now()}`,
        ...newComment,
        time: 'Just now',
      },
      ...comments,
    ];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated[0];
  }

  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, newComment);
    return {
      id: docRef.id,
      ...newComment,
      time: 'Just now',
    };
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
    const key = `vidio_comments_${videoId}`;
    const comments = await getVideoComments(videoId);
    const localComment = {
      id: `local_${Date.now()}`,
      ...newComment,
      time: 'Just now',
    };
    localStorage.setItem(key, JSON.stringify([localComment, ...comments]));
    return localComment;
  }
}
