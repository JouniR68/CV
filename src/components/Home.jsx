import { useEffect, useState } from 'react'
//import MyLocation from './MyLocation';
import "../index.css"
export default function Home() {
  const [isMobileDpi, setMobileDpi] = useState(false);

  const welcomeText = "Welcome to my pages, check out my services and resumes."
  const mobileText = "Welcome to my page, feel free to browse through and post me the message."

  const handleText = () => {
    if (window.matchMedia('(min-resolution: 250dpi)')) {
      setMobileDpi(true)
    }
  }

  useEffect(() => {handleText},[])

  return (
    <>
      
      <div className='home-container'>
        <h1>Welcome</h1>
        {isMobileDpi ? welcomeText : mobileText}

      </div>
    </>
  );
}
