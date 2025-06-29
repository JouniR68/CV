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

import { FullscreenExit, GitHub } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import LocalPhoneSharpIcon from '@mui/icons-material/LocalPhoneSharp';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';

export default function Footer() {
    const [phoneNumber, setShowPhoneNumber] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    function gitHub() {
        window.open('https://github.com/JouniR68', '_blank');
    }

    function linkedIn() {
        window.open(
            'https://www.linkedin.com/in/jouni-riimala-04330',
            '_blank'
        );
    }

    const subject = 'CONTACT REQUEST';
    const recipient = 'jriimala@gmail.com';
    const body = 'Hi \n\nContacting you via your web cv.\n\n';

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(body)}`;

    const { t } = useTranslation();

    const showPhoneNumber = () => {
        console.log('Setting phoneNumber visible');
        setShowPhoneNumber(true);
    };

    return (
        <div className='footer'>
            <div className='footer-items'>
                <ButtonGroup variant='' aria-label='outlined button group'>
                    <IconButton onClick={linkedIn}>
                        <LinkedInIcon />
                    </IconButton>
                    <Tooltip title='jriimala@gmail.com' placement='bottom'>
                        <IconButton>
                            <a href={mailtoLink}>
                                <MailIcon sx={{ marginLeft: '2px' }} />
                            </a>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='+358 2385 888' placement='bottom'>
                        <IconButton>
                            <LocalPhoneSharpIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={() => changeLanguage('en')}>
                        <img src='/Images/eng-flag.png' />
                    </IconButton>
                    <IconButton onClick={() => changeLanguage('fi')}>
                        <img src='/Images/fin-flag.png' />
                    </IconButton>
                </ButtonGroup>
            </div>
        </div>
    );
}
