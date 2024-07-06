import MyLocation from './MyLocation';
import "../index.css"
export default function Home() {
  const [isMobileDpi, setMobileDpi] = useState(false);

  const welcomeText = "Welcome to my pages, in here trying to paint a picture from myself and what I am all about. In here you can see my work history, competences and other details. Hopefully you find time to discuss, how I can contribute with your success story.<p></p>Note that if you do not want to hire me for permanent bases, I can be hired for the shorter periods, for the companies at minimum for the one month and for the individuals for the day ! "
  const mobileText = "Welcome to my page, Feel free to browse through and post me a message."

  if (window.matchMedia('(min-resolution: 510dpi)')) {
    setMobileDpi(true)
  }


  return (
    <>
      
      
      <MyLocation />
      <div className='home-container'>
        <h1>Welcome</h1>
        {isMobileDpi ? welcomeText : mobileText}
        
      </div>
    </>
  );
}
