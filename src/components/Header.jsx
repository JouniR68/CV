import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom";
import Login from "./Login"
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AuthContext, useAuth } from "./LoginContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import DesignServicesSharpIcon from '@mui/icons-material/DesignServicesSharp';
import LoginSharpIcon from '@mui/icons-material/AdminPanelSettingsSharp';
import DraftsSharpIcon from '@mui/icons-material/DraftsSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Header() {
  //const [unreadMessages, setUnreadMessages] = useState(false)
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn)



  /*
  const fetchMessages = async () => {
    try {
      const eventsCollection = await getDocs(collection(db, 'messages'));
      setUnreadMessages(!eventsCollection)
    }
    catch (error) {
      console.error("Error checking documents: ", error)
    }
  }


  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages()
    }
  }, []);
*/

  return (
    <header className="app-header">
      <nav>
        <Link to="/home"><HomeWorkIcon /></Link>
        <Link to="/profile"><PersonSharpIcon /></Link>
        <Link to="/catalog"><DesignServicesSharpIcon /></Link>
    
        
        <Link to="/checkLocation"><IconButton><LocationOnIcon style={{ transform: 'translateY(-5px)' }} /></IconButton></Link>
        {!isLoggedIn &&
          <>            
            <Link to="/userLogin">{t('Login')}</Link>
            <Link to="/register">{t('Register')}</Link>
            <Link to="/login"><SettingsIcon /></Link>            
          </>
        }

        {isLoggedIn &&
          <>
            <Link to="/c"><DraftsSharpIcon /></Link>
            <Link to="/calendar"><CalendarMonthSharpIcon /></Link>
            <Link to="/tunterointi">Tunterointi</Link>
            {isLoggedIn && <Link to="/logout"><LogoutSharpIcon /></Link>}
          </>}


      </nav>

    </header>
  );
}
