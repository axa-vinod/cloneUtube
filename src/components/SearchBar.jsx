import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: 20,
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: '#FF0000',
          boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)',
        },
      }}
    >
      <InputBase
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          ml: 2,
          flex: 1,
          color: 'text.primary',
          fontSize: '0.9rem',
        }}
      />
      <IconButton
        type="submit"
        sx={{
          p: '8px 16px',
          borderRadius: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          borderLeft: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
