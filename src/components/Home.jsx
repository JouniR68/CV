import { useEffect, useState } from 'react'
//import MyLocation from './MyLocation';
import "../index.css"
import MyLocation from './MyLocation';
import Confirmation from './Confirmation';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const [isMobileDpi, setMobileDpi] = useState(false);
  const [proceed, setProceed] = useState(false)
  const [locationReading, setLocationReading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location;
  if (state) {
    const { locationError } = state;
    if (locationError != null && !error){
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
    setProceed(true)
    sessionStorage.setItem('allowSessionStorageForLocation', true)
    setLocationReading(true)
    reloadCount > 0 ? "" : handleReload()
    setError(null)
  }

  const handleCancel = () => {
    setProceed(true)
    setLocationReading(false)
    sessionStorage.removeItem('allowSessionStorageForLocation')
    setError(null)
  }

  return (
    <>
      <div className="flags">
        <img src="/Images/eng-flag.png" width="48" height="48" onClick={() => changeLanguage('en')} />
        <img src="/Images/fin-flag.png" width="48" height="48" onClick={() => changeLanguage('fi')} />
      </div>

      {!proceed && reloadCount === 0 && <Confirmation onConfirm={handleOk} onCancel={handleCancel} />}
      {proceed &&
        <>
          {locationReading && !error && <MyLocation />}
          {error}
          <div className='home-container'>
            <h1>{t('welcome')}</h1>
            <p></p>
            {isMobileDpi ? t('welcomeText') : t('mobileWelcomeText')}
          </div>
        </>
      }
    </>
  );
}
