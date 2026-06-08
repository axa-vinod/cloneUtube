import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { YouTube as YouTubeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError('');
      setSigningIn(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setSigningIn(false);
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
          Welcome back to <span style={{ color: '#FF0000' }}>Vidio</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to watch, subscribe, and sync playlists.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={signingIn}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={signingIn}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={signingIn}
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
            {signingIn ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#3ea6ff', textDecoration: 'none', fontWeight: 'bold' }}>
            Create one
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
