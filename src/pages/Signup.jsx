import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { YouTube as YouTubeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setSigningUp(true);
      await signup(email, password, username);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account. Please check your credentials.');
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px)',
        background: 'linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(35,10,10,1) 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          bgcolor: 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
        }}
      >
        {/* Logo Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <YouTubeIcon sx={{ color: '#FF0000', fontSize: 48 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'extrabold', mb: 1, color: '#fff' }}>
          Create your Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join Vidio to share comments, like videos, and subscribe.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Username"
            variant="outlined"
            type="text"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={signingUp}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={signingUp}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={signingUp}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={signingUp}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(255, 0, 0, 0.6)',
              },
            }}
          >
            {signingUp ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3ea6ff', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
