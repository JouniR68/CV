import { useEffect, useState } from 'react'
import "../index.css"
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import { useAuth } from './LoginContext';
import { Button, Typography } from '@mui/material';
import InactivityTimer from './InActivity';
import FeedbackDialog from './Feedback';


const TextWrapper = ({ text, maxLength }) => {
  console.log("text: ", text + ", length: ", maxLength)
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

    <div className = "home-teksti">Alla esimerkkejä missä koen voivani auttaa, näiden lisäksi esim asennukset / päivitykset / konfiguroinnit yms onnistuvat.<p/>Klikkaa kuvaa antaaksesi tarjouspyynnön, kiitokset jo etukäteen.</div>

      <div className="home-kollaasi">
        <Typography variant="h5">
          <h5> Tuotehallintaa</h5>
          <img alt="Tuotehallintaa" src="/Images/jrsoft/backlog.png" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>Tukea</h5>
          <img alt="Käyttötukea" src="/Images/jrsoft/help.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>Projektityötä</h5>
          <img alt="Projekti suunnitelmaa" src="/Images/jrsoft/gantt.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5>Koodia (WEB)</h5>
          <img alt="Web-koodausta, apuja yms" src="/Images/jrsoft/web.jpg" onClick={() => tarjouspyyntoon()} />
        </Typography>
        <Typography variant="h5">
          <h5> Viestiä</h5>
          <img alt="Palaute/Feedback" src="/Images/jrsoft/feedback.png" onClick={() => handleOpen()} />
        </Typography>
        <Typography variant="h5">
          <h5>Vastuuvapaus</h5>
          <img alt="Vastuuvapaus / disclaimer" src="/Images/jrsoft/disclaimer.png" onClick={showDisclaimer}></img>
        </Typography>

      </div>

      {isLoggedIn && <InactivityTimer />}
      {/*viewportWidth*/} {/*viewportHeight*/}

      {disclaimer && navigate('/done', { state: { description: "disclaimer" } })}
      {/* Feedback Dialog */}
      <FeedbackDialog open={dialogOpen} handleClose={handleClose} />


    </div>
  );
}
