import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';

interface SearchBarProps {
  onSearch: (query1: string, query2?: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [query1, query2] = query.trim().split(/\s+/, 2);
    onSearch(query1, query2);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}
    >
      <TextField
        label="Search"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
      />
    </Box>
  );
};

export default SearchBar;