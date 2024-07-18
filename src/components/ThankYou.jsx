import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ThankYouPage = () => {
  const handleReturnHome = () => {    
    window.location.href = '/'; // Redirect to the homepage
  };

  const {t} = useTranslation()

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
          {t('ThankYou')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('SubmissionReceived')}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          {t('ThankYouText')}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReturnHome}>
          {t('ReturnToHome')}
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
