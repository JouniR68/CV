//import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
//import Sos from '@mui/icons-material/GitHub';
import '../index.css';
import { GitHub } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';


export default function Contact() {

   function gitHub() {
     window.open('https://github.com/JouniR68', '_blank');
   } 

  function linkedIn() {
    window.open('https://www.linkedin.com/in/jouni-riimala-04330', '_blank');
  }

  function fb() {
    window.open('https://www.facebook.com/jriimala', '_blank');
  }

  function insta() {
    window.open('https://www.instagram.com/jriimala/', '_blank');
  }

  const subject = 'CONTACT REQUEST';
  const recipient = 'jr@softa-apu.fi';
  const body = 'Hi \n\nContacting you via your web cv.\n\n';

  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;


  const {t} = useTranslation()

  return (
    <>
      <hr></hr>
      <p></p>

      <Box
        sx={{
          display: 'flex',          
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'start',
          '& > *': {
            m: 1,
          },
        }}
      >
        
          <ButtonGroup
            variant='outlined'
            aria-label='outlined button group'            
          >
            <div className='sos'>
            <IconButton onClick={fb}>
              <FacebookIcon  />
            </IconButton>
            <IconButton onClick={insta}>
              <InstagramIcon />
            </IconButton>
            <IconButton onClick={linkedIn}>
              <LinkedInIcon  />
            </IconButton>
            <IconButton onClick={gitHub}>
              <GitHub />
              <Typography variant='body1' ml={1}>
                {t('Repositories')}
              </Typography>
            </IconButton>
            <IconButton>
              <a href={mailtoLink}><MailIcon sx={{marginLeft: '2px' }}/></a>
              <Typography variant='body1' ml={1}>
                {t('Phone')} +358 2385 888.
              </Typography>

            </IconButton>
            </div>
          </ButtonGroup>

      </Box>
    </>
  );
}
