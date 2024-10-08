import { useEffect, useState } from 'react'
import "../index.css"
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import { useAuth } from './LoginContext';
import { Button, Typography } from '@mui/material';
import InactivityTimer from './InActivity';
import FeedbackDialog from './Feedback';

export default function Home() {
  const [isMobile, setMobile] = useState(false);
  const [confirmation, setConfirmation] = useState(true)
  const [locationReading, setLocationReading] = useState(false)
  const [error, setError] = useState(null)
  const { isLoggedIn, currentUser } = useAuth();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [disclaimer, setShowDisclaimer] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false);


  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location;
  if (state) {
    const { locationError } = state;
    if (locationError != null && !error) {
      console.log(locationError)
      setError(locationError)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);


  const { t, i18n } = useTranslation();

  let reloadCount = 0

  const handleText = () => {
    const mediaQuery = console.log(window.matchMedia())
    console.log(`Media query matches: ${mediaQuery.matches}`);

    if (window.matchMedia('(min-width: 1080px and (max-width:2400px))')) {
      setMobile(true)
    } else { setMobile(false) }
  }

  const handleReload = () => {
    console.log("Reload activated")
    reloadCount++
    const lastReload = sessionStorage.getItem('lastReload')
    const currentTime = new Date().getTime()

    if (lastReload && currentTime - lastReload < 300000) {
      return
    }

    sessionStorage.setItem('lastReload', currentTime)
    window.location.reload()
  }

  useEffect(() => {
    handleText;
  }, [])

  const handleOk = () => {
    sessionStorage.setItem('allowSessionStorageForLocation', true)
    setLocationReading(true)
    setConfirmation(false)
    //reloadCount > 0 ? "" : handleReload()    
  }

  const handleCancel = () => {
    setLocationReading(false)
    setConfirmation(false)
    sessionStorage.removeItem('allowSessionStorageForLocation')
    setError(null)
  }


  const tarjouspyyntoon = () => {
    navigate('/tarjouspyynto')
  }

  console.log("isMobile: ", isMobile)

  let name = ""
  const fname = sessionStorage.getItem("firstName")
  !fname ? name = "" : name = fname


  const showDisclaimer = () => {
    setShowDisclaimer(!disclaimer)
  }

  return (
    <div className="home">

      <div className="home-teksti">{t('Cando1')}<p />{t('Cando2')}<p />{t('Cando3')}</div>      
      <div className="home-kollaasi">
        <Typography variant="h5">
          <h5>{t('PM')}</h5>
          <img alt="Tuotehallintaa" src="/Images/jrsoft/backlog.png" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>{t('Support')}</h5>
          <img alt="Käyttötukea" src="/Images/jrsoft/help.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>{t('Project')}</h5>
          <img alt="Projekti suunnitelmaa" src="/Images/jrsoft/gantt.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>{t('Webdev')}</h5>
          <img alt="Web-koodausta, apuja yms" src="/Images/jrsoft/web.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>{t('Message')}</h5>
          <img alt="Palaute/Feedback" src="/Images/jrsoft/feedback.png" onClick={() => handleOpen()} />
        </Typography>
        <Typography variant="h5">
          <h5>{t('GoodToKnow')}</h5>
          <img alt="Vastuuvapaus / disclaimer" src="/Images/jrsoft/disclaimer.png" onClick={showDisclaimer}></img>
        </Typography>
      </div>

      {isLoggedIn && <InactivityTimer />}


      {disclaimer && navigate('/done', { state: { description: "disclaimer" } })}
      {/* Feedback Dialog */}
      <FeedbackDialog open={dialogOpen} handleClose={handleClose} />
    </div>
  );
}