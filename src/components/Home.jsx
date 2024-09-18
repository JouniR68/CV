import { useEffect, useState, useContext } from 'react'
import "../index.css"
import MyLocation from './MyLocation';
import Confirmation from './Confirmation';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import CheckLocation from './CheckLocation';
import { AuthContext, useAuth } from './LoginContext';
import Calendar from './Calendar';
import { Button } from '@mui/material';


const TextWrapper = ({ text, maxLength }) => {
  // Function to split the text into chunks of maxLength without breaking words
  const splitIntoChunksWithoutBreakingWords = (text, maxLength) => {
    const words = text.split('.'); // Split the text by spaces (words)
    const chunks = [];
    let currentChunk = '';

    words.forEach((word) => {
      // If adding the next word exceeds maxLength, push the current chunk and start a new one
      if ((currentChunk + word).length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        chunks.push(currentChunk);
        currentChunk = word;
      }
    });

    // Add the remaining chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  // Split the text into chunks without breaking words
  const chunks = splitIntoChunksWithoutBreakingWords(text, maxLength);

  return (
    <div>
      {chunks.map((chunk, index) => (
        <p key={index}>{chunk}
          {index !== 0 && '.'}
        </p> // Render each chunk as a separate <p> tag
      ))}
    </div>
  );
};

export default function Home() {
  const [isMobile, setMobile] = useState(false);
  const [confirmation, setConfirmation] = useState(true)
  const [locationReading, setLocationReading] = useState(false)
  const [error, setError] = useState(null)
  const { isLoggedIn, currentUser } = useAuth();

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


  // {isMobileDpi ? t('welcomeText') : splittedText.forEach(text => text)}
  return (
    <>
      <h1 style={{marginTop:'6rem'}}>{t('welcome') + ' ' + name}</h1>
      <div className="home-container">
        <TextWrapper className='home-container' text={t('mobileWelcomeText')} maxLength={50} />
        <p></p>                
      </div>
      <Button variant = 'contained' id="offer-button" onClick={() => tarjouspyyntoon()}>Tarjouspyyntö</Button>

    </>
  );
}
