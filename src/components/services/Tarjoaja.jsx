import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

export default function Tarjoaja({ tarjoaja, setTarjoaja }) {
  return (
    <Box mb={4}>
      <Typography variant="h6">Tarjoaja</Typography>
      <TextField
        label="Nimi"
        value={tarjoaja.nimi}
        onChange={(e) => setTarjoaja({ ...tarjoaja, nimi: e.target.value })}
        fullWidth
        variant="outlined"
      />
      {/* Repeat for other fields: Osoite, Puhelinnumero, etc. */}
    </Box>
  );
}
