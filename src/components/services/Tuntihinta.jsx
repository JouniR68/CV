import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

export default function Tuntihinta({ tuntihinta, setTuntihinta }) {
  return (
    <Box mb={4}>
      <Typography variant="h6">Tuntihinta</Typography>
      <TextField
        type="number"
        value={tuntihinta}
        onChange={(e) => setTuntihinta(e.target.value)}
        style={{ width: '4rem' }}
        variant="outlined"
      />
    </Box>
  );
}
