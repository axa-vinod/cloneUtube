import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbDown as ThumbDownIcon,
  ThumbDownOutlined as ThumbDownOutlinedIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getVideoComments, addVideoComment } from '../services/firestoreService';

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [likedComments, setLikedComments] = useState({}); // { commentId: 'like' | 'dislike' }

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    
    const loadComments = async () => {
      // Defer state setter to satisfy linter
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      
      try {
        const data = await getVideoComments(videoId);
        if (active) {
          setComments(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
        if (active) setLoading(false);
      }
    };

    loadComments();

    return () => {
      active = false;
    };
  }, [videoId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!user) {
      alert('Please Sign In first to post comments.');
      navigate('/login');
      return;
    }

    const payload = {
      username: user.name,
      avatar: user.avatar,
      text: newCommentText,
    };

    try {
      const added = await addVideoComment(videoId, payload);
      setComments((prev) => [added, ...prev]);
      setNewCommentText('');
      setShowButtons(false);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleCancel = () => {
    setNewCommentText('');
    setShowButtons(false);
  };

  const handleLikeClick = (commentId) => {
    setLikedComments((prev) => {
      const current = prev[commentId];
      let diff = 0;
      let nextState;

      if (current === 'like') {
        diff = -1;
        nextState = null;
      } else {
        diff = 1;
        nextState = 'like';
      }

      setComments((cList) =>
        cList.map((c) => {
          if (c.id === commentId) {
            return { ...c, likes: c.likes + diff };
          }
          return c;
        })
      );

      return { ...prev, [commentId]: nextState };
    });
  };

  const handleDislikeClick = (commentId) => {
    setLikedComments((prev) => {
      const current = prev[commentId];
      let diff = 0;
      let nextState;

      if (current === 'like') {
        diff = -1;
        nextState = 'dislike';
      } else if (current === 'dislike') {
        diff = 0;
        nextState = null;
      } else {
        diff = 0;
        nextState = 'dislike';
      }

      if (current === 'like') {
        setComments((cList) =>
          cList.map((c) => {
            if (c.id === commentId) {
              return { ...c, likes: c.likes + diff };
            }
            return c;
          })
        );
      }

      return { ...prev, [commentId]: nextState };
    });
  };

  const handleSortMenuOpen = (e) => setSortAnchorEl(e.currentTarget);
  const handleSortMenuClose = () => setSortAnchorEl(null);

  const handleSort = (type) => {
    let sorted = [...comments];
    if (type === 'top') {
      sorted.sort((a, b) => b.likes - a.likes);
    } else {
      // Sort newest (by id or timestamp)
      sorted.sort((a, b) => b.id.localeCompare(a.id));
    }
    setComments(sorted);
    handleSortMenuClose();
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header with Sort Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {comments.length} Comments
        </Typography>
        <Button
          startIcon={<SortIcon />}
          onClick={handleSortMenuOpen}
          color="inherit"
          sx={{ fontWeight: 'bold' }}
        >
          Sort by
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={() => handleSort('top')}>Top comments</MenuItem>
          <MenuItem onClick={() => handleSort('newest')}>Newest first</MenuItem>
        </Menu>
      </Box>

      {/* Write Comment Form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Avatar src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'} />
        <Box component="form" onSubmit={handlePostComment} sx={{ flex: 1 }}>
          <TextField
            placeholder={user ? "Add a public comment..." : "Sign in to add a public comment..."}
            variant="standard"
            fullWidth
            multiline
            disabled={!user}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => setShowButtons(true)}
            InputProps={{
              disableUnderline: false,
              sx: {
                pb: 0.5,
                fontSize: '0.875rem',
              },
            }}
          />
          {showButtons && user && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
              <Button onClick={handleCancel} color="inherit" size="small">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newCommentText.trim()}
                size="small"
                sx={{ borderRadius: 20 }}
              >
                Comment
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Comments List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {comments.map((comment) => {
            const userAction = likedComments[comment.id];
            return (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={comment.avatar} sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                  {comment.username ? comment.username.charAt(0) : 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  {/* Username & Time */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.time}
                    </Typography>
                  </Box>
                  {/* Comment Text */}
                  <Typography variant="body2" sx={{ color: 'text.primary', mb: 1, whiteSpace: 'pre-line' }}>
                    {comment.text}
                  </Typography>
                  {/* Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleLikeClick(comment.id)}>
                      {userAction === 'like' ? (
                        <ThumbUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      ) : (
                        <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                    {comment.likes > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {comment.likes}
                      </Typography>
                    )}
                    <IconButton size="small" onClick={() => handleDislikeClick(comment.id)}>
                      {userAction === 'dislike' ? (
                        <ThumbDownIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      ) : (
                        <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                    <Button size="small" color="inherit" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      Reply
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
