import { useEffect, useState } from 'react'
//import MyLocation from './MyLocation';
import "../index.css"
import MyLocation from './MyLocation';
import Confirmation from './Confirmation';
export default function Home() {
  const [isMobileDpi, setMobileDpi] = useState(false);
  const [proceed, setProceed] = useState(false)
  const [locationReading, setLocationReading] = useState(false)
  const welcomeText = "Welcome to my pages, check out my services and resumes."
  const mobileText = "Welcome to my page, feel free to browse through and post me the message."


  const handleText = () => {
    const mediaQuery = console.log(window.matchMedia())
    console.log(`Media query matches: ${mediaQuery.matches}`);

    if (window.matchMedia('(min-resolution: 250dpi)')) {
      setMobileDpi(true)
    } else { setMobileDpi(false) }
  }

  useEffect(() => { handleText }, [])

  const handleOk = () => {
    setProceed(true)
    setLocationReading(true)
  }

  const handleCancel = () => {
    setProceed(true)
    setLocationReading(false)
  }


  return (
    <>
      {!proceed && <Confirmation onConfirm={handleOk} onCancel={handleCancel} />}
      {proceed &&
        <>
          {locationReading && <MyLocation />}
          <div className='home-container'>
            <h1>Welcome</h1>
            <p></p>
            {isMobileDpi ? welcomeText : mobileText}
          </div>
        </>
      }
    </>
  );
}
