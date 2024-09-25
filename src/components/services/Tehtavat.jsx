import React from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';

export default function Tehtavat({ tehtavat, setTehtavat, tuntihinta }) {
  const addTask = () => {
    // Logic to add new task
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Tehtävä"
            fullWidth
            variant="outlined"
            // Add value and onChange as needed
          />
        </Grid>
        {/* Repeat for other task fields */}
      </Grid>
      <Button onClick={addTask} variant="contained">
        +
      </Button>
    </form>
  );
}
