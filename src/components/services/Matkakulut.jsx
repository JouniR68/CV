import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';

export default function Matkakulut({ matkakulut, setMatkakulut }) {
  return (
    <Box>
      <Typography variant="h6">Matkakulut</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Lähtö"
            value={matkakulut.lahto}
            onChange={(e) => setMatkakulut({ ...matkakulut, lahto: e.target.value })}
            fullWidth
            variant="outlined"
          />
        </Grid>
        {/* Repeat for other fields */}
      </Grid>
    </Box>
  );
}
