import { useEffect, useState, useContext } from 'react'
//import MyLocation from './MyLocation';
import "../index.css"
import MyLocation from './MyLocation';
import Confirmation from './Confirmation';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import CheckLocation from './CheckLocation';
import { AuthContext } from './LoginContext';

export default function Home() {
  const [isMobileDpi, setMobileDpi] = useState(false);
  const [confirmation, setConfirmation] = useState(true)
  const [locationReading, setLocationReading] = useState(false)
  const [error, setError] = useState(null)
  const { isLoggedIn, login, logout } = useContext(AuthContext);

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
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  let reloadCount = 0

  const handleText = () => {
    const mediaQuery = console.log(window.matchMedia())
    console.log(`Media query matches: ${mediaQuery.matches}`);

    if (window.matchMedia('(min-resolution: 250dpi)')) {
      console.log("min-resolution 250dpi")
      setMobileDpi(true)
    } else { setMobileDpi(false) }
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

  //{confirmation && <Confirmation onConfirm={handleOk} onCancel={handleCancel} />}
  //{locationReading === true && <MyLocation />}
  console.log("isMobile: ", isMobile)

  
  return (
    <>
      <h1>jriimala.netlify.app is more dev site, pls click <a href = "https://softa-apu.fi">softa-apu.fi</a></h1>
      <div className="flags">        
        <img src="/Images/eng-flag.png" width="48" height="48" onClick={() => changeLanguage('en')} />
        <img src="/Images/fin-flag.png" width="48" height="48" onClick={() => changeLanguage('fi')} />
        </div>
        <img id = "softaapu-logo" src="/Images/softaapu.png" onClick={() => changeLanguage('en')} />
      
      
      <div className='home-container'>
        <h1>{t('welcome')}</h1>
        <p></p>
        {isMobileDpi ? t('welcomeText') : t('mobileWelcomeText')}
      </div>

    </>
  );
}
