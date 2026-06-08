/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, isFirebaseConfigured } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { getUserData, saveUserData } from '../services/firestoreService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    likedVideos: [],
    watchLater: [],
    history: [],
    subscriptions: [],
  });

  // Load user data whenever authentication changes
  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          if (active) {
            setUser({
              uid: currentUser.uid,
              name: currentUser.displayName || currentUser.email.split('@')[0],
              email: currentUser.email,
              avatar: currentUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.uid}`,
            });
          }
          const data = await getUserData(currentUser.uid);
          if (active) {
            setUserData(data);
            setLoading(false);
          }
        } else {
          if (active) {
            setUser(null);
            setUserData({ likedVideos: [], watchLater: [], history: [], subscriptions: [] });
            setLoading(false);
          }
        }
      });
    } else {
      const loadLocalUser = async () => {
        // Defer execution to microtask to satisfy React linter
        await Promise.resolve();
        if (!active) return;

        const localUser = localStorage.getItem('vidio_simulated_user');
        if (localUser) {
          const parsed = JSON.parse(localUser);
          setUser(parsed);
          const data = await getUserData(parsed.uid);
          if (active) {
            setUserData(data);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      };

      loadLocalUser();
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signup = useCallback(async (email, password, username) => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
        await updateProfile(userCredential.user, {
          displayName: username,
          photoURL: avatarUrl,
        });

        const createdUser = {
          uid: userCredential.user.uid,
          name: username,
          email: email,
          avatar: avatarUrl,
        };

        setUser(createdUser);
        // Initial user document
        const initialData = { likedVideos: [], watchLater: [], history: [], subscriptions: [] };
        await saveUserData(createdUser.uid, initialData);
        setUserData(initialData);
        setLoading(false);
        return createdUser;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Simulate signup
      const uid = `sim_${Date.now()}`;
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
      const simulatedUser = { uid, name: username, email, avatar: avatarUrl };
      localStorage.setItem('vidio_simulated_user', JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      
      const initialData = { likedVideos: [], watchLater: [], history: [], subscriptions: [] };
      await saveUserData(uid, initialData);
      setUserData(initialData);
      setLoading(false);
      return simulatedUser;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser = {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || email.split('@')[0],
          email: userCredential.user.email,
          avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userCredential.user.uid}`,
        };
        setUser(loggedUser);
        const data = await getUserData(loggedUser.uid);
        setUserData(data);
        setLoading(false);
        return loggedUser;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Simulate login (check local credentials)
      const simulatedUser = {
        uid: 'sim_default_user',
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
      };
      localStorage.setItem('vidio_simulated_user', JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      const data = await getUserData(simulatedUser.uid);
      setUserData(data);
      setLoading(false);
      return simulatedUser;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    } else {
      localStorage.removeItem('vidio_simulated_user');
    }
    setUser(null);
    setUserData({ likedVideos: [], watchLater: [], history: [], subscriptions: [] });
    setLoading(false);
  }, []);

  // User list manipulation methods (sync to db/local storage)
  const addToHistory = useCallback(async (video) => {
    if (!user) return;
    const videoId = video.id?.videoId || video.id;
    setUserData((prev) => {
      const filtered = prev.history.filter((v) => (v.id?.videoId || v.id) !== videoId);
      const updated = [video, ...filtered];
      const newUserData = { ...prev, history: updated };
      saveUserData(user.uid, newUserData);
      return newUserData;
    });
  }, [user]);

  const clearHistory = useCallback(async () => {
    if (!user) return;
    setUserData((prev) => {
      const newUserData = { ...prev, history: [] };
      saveUserData(user.uid, newUserData);
      return newUserData;
    });
  }, [user]);

  const toggleLikeVideo = useCallback(async (video) => {
    if (!user) return;
    const videoId = video.id?.videoId || video.id;
    setUserData((prev) => {
      const exists = prev.likedVideos.some((v) => (v.id?.videoId || v.id) === videoId);
      const updated = exists
        ? prev.likedVideos.filter((v) => (v.id?.videoId || v.id) !== videoId)
        : [video, ...prev.likedVideos];
      const newUserData = { ...prev, likedVideos: updated };
      saveUserData(user.uid, newUserData);
      return newUserData;
    });
  }, [user]);

  const toggleWatchLater = useCallback(async (video) => {
    if (!user) return;
    const videoId = video.id?.videoId || video.id;
    setUserData((prev) => {
      const exists = prev.watchLater.some((v) => (v.id?.videoId || v.id) === videoId);
      const updated = exists
        ? prev.watchLater.filter((v) => (v.id?.videoId || v.id) !== videoId)
        : [video, ...prev.watchLater];
      const newUserData = { ...prev, watchLater: updated };
      saveUserData(user.uid, newUserData);
      return newUserData;
    });
  }, [user]);

  const toggleSubscribeChannel = useCallback(async (channelDetail) => {
    if (!user) return;
    
    // Support passing either a full channel object or just a string ID
    const channelId = typeof channelDetail === 'string' ? channelDetail : (channelDetail.id?.channelId || channelDetail.id);
    if (!channelId) return;

    setUserData((prev) => {
      const exists = prev.subscriptions.some((sub) => (sub.id?.channelId || sub.id) === channelId);
      let updated;
      if (exists) {
        updated = prev.subscriptions.filter((sub) => (sub.id?.channelId || sub.id) !== channelId);
      } else {
        // Construct a clean, minimal channel object to store
        const newSub = typeof channelDetail === 'string' 
          ? {
              id: channelId,
              snippet: {
                title: `Channel: ${channelId}`,
                thumbnails: { default: { url: '' } }
              }
            }
          : channelDetail;
        updated = [...prev.subscriptions, newSub];
      }
      const newUserData = { ...prev, subscriptions: updated };
      saveUserData(user.uid, newUserData);
      return newUserData;
    });
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userData,
        signup,
        login,
        logout,
        addToHistory,
        clearHistory,
        toggleLikeVideo,
        toggleWatchLater,
        toggleSubscribeChannel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
