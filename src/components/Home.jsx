import { useEffect, useState } from 'react'
import "../css/home.css"
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import { useAuth } from './LoginContext';
import { Button, Typography } from '@mui/material';
import InactivityTimer from './InActivity';
import FeedbackDialog from './Messages';
import CollectionCounts from './services/dashboard/News';
import data from '../../data/datapkg.json'

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
  const [isUnsupported, setIsUnsupported] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth > 3000) {
        setIsUnsupported(true);
      } else {
        setIsUnsupported(false);
      }
    };

    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Check on resize

    return () => window.removeEventListener("resize", checkScreenWidth); // Clean up
  }, []);


  const { state } = location;
  if (state) {
    const { locationError } = state;
    if (locationError != null && !error) {
      console.log(locationError)
      setError(locationError)
    }
  }

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

      {isUnsupported && <div className="unsupported-message">Most readable with screen width around 2500px</div>}
      <CollectionCounts />      
      <div className="home-teksti">{t('Cando')}<br /> <span>{t('MoreFromMe')}</span></div>
      <div className="image-container">
        <div className="image-wrapper">
          <img alt="Palvelut, apuja yms" src="/Images/laptop.png" onClick={() => tarjouspyyntoon()} />
          <span>{t('Offer')}</span>
        </div>

        <div className="image-wrapper">
          <img alt="Jounin Verkkokauppa" src="/Images/online-shop.png" onClick={() => navigate('/shop')} />
          <span>{t('Shop')}</span>
        </div>

        <div className="image-wrapper">
          <img alt="Palaute/Feedback" src="/Images/jrsoft/feedback.png" onClick={() => handleOpen()} />
          <span>{t('Message')}</span>
        </div>
      </div>

      {isLoggedIn && <InactivityTimer />}

      {disclaimer && navigate('/done', { state: { description: "disclaimer" } })}
      {/* Feedback Dialog */}
      <FeedbackDialog open={dialogOpen} handleClose={handleClose} />
    </div>
  );
}