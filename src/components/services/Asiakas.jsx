import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

export default function Asiakas({ saaja, setSaaja }) {
  return (
    <Box mb={4}>
      <Typography variant="h6">Asiakas</Typography>
      <TextField
        label="Nimi"
        value={saaja.nimi}
        onChange={(e) => setSaaja({ ...saaja, nimi: e.target.value })}
        fullWidth
        variant="outlined"
      />
      {/* Repeat for other fields: Osoite, Puhelinnumero, etc. */}
    </Box>
  );
}
