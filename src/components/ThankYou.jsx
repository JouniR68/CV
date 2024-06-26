import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const ThankYouPage = () => {
  const handleReturnHome = () => {    
    window.location.href = '/'; // Redirect to the homepage
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '30vh',
          textAlign: 'center',
          bgcolor: 'background.paper',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your submission has been received.
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          We appreciate your feedback. If you have any questions, feel free to contact.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
