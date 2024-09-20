//import Button from '@mui/material/Button';
import i18n from 'i18next';
import { useState } from 'react';
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
import LocalPhoneSharpIcon from '@mui/icons-material/LocalPhoneSharp';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';

export default function Footer() {

  const [phoneNumber, setShowPhoneNumber] = useState(false)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  function gitHub() {
    window.open('https://github.com/JouniR68', '_blank');
  }

  function linkedIn() {
    window.open('https://www.linkedin.com/in/jouni-riimala-04330', '_blank');
  }

  const subject = 'CONTACT REQUEST';
  const recipient = 'jr@softa-apu.fi';
  const body = 'Hi \n\nContacting you via your web cv.\n\n';

  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;


  const { t } = useTranslation()


  const showPhoneNumber = () => {
    console.log("Setting phoneNumber visible")
    setShowPhoneNumber(true)
  }

  return (
    <>
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
          variant=''
          aria-label='outlined button group'
          className="footer"
        >
          <div className="footer-items">
            <IconButton onClick={linkedIn}>
              <LinkedInIcon />
            </IconButton>
            <Tooltip title="jr@softa-apu.fi" placement="bottom">
              <IconButton>
                <a href={mailtoLink}><MailIcon sx={{ marginLeft: '2px' }} /></a>
              </IconButton>
            </Tooltip>

            <Tooltip title="+358 2385 888" placement="bottom">
              <IconButton>
                <LocalPhoneSharpIcon />
              </IconButton>
            </Tooltip>
            <IconButton>
              <Button onClick={() => changeLanguage('en')}><img src="/Images/eng-flag.png" /></Button>
              <Button onClick={() => changeLanguage('fi')}><img src="/Images/fin-flag.png"/></Button>
            </IconButton>
          </div>

        </ButtonGroup>


      </Box >
    </>
  );
}
