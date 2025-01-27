import { useEffect, useState, useContext } from "react"
import { Link, useLocation } from "react-router-dom";

import Login from "./AdminLogin"
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from "./LoginContext";
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
import { Tooltip } from "@mui/material";
import Hamburger from './Hamburger';
import FeedbackDialog from "./Messages";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';

//<Link to="/checkLocation"><LocationOnIcon/></Link>
export default function Header() {
  //const [unreadMessages, setUnreadMessages] = useState(false)
  const { t } = useTranslation();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const isAuthenticated = sessionStorage.getItem("adminLevel")
  console.log("Header isLoggedIn: ", isLoggedIn)

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem("loggedIn")
    if (storedLoggedIn === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  // <Link to="/profile"><PersonSharpIcon /></Link>
  const profile = '/Images/profile'
  return (

    <>
      <Hamburger />
      <div className="header">        
        <div className="header-left">
          <Link to="/"><HomeWorkIcon sx={{width:'3rem', height: '3rem', marginLeft:'1rem'}}/></Link>          
          <Link to="/profile"><img style={{width:'3rem', height: '3rem'}} src="/Images/profile.png" alt="CV"/></Link>
          <Link to="https://memory-c1718.web.app/"><img style={{width:'3rem', height: '3rem'}} src="/Images/memoryGame.jpg" alt="The Game"/></Link>        
          
        </div>
        <div className="header-right">
          {!isLoggedIn && currentPath != '/userLogin' && <Link to="/userLogin"><LoginIcon sx={{width:'3rem', height: '3rem'}}/></Link>}
          {!isLoggedIn && currentPath != '/register' && <Link to="/register"><HowToRegIcon sx={{width:'3rem', height: '3rem'}}/></Link>}

          {isLoggedIn &&
            <>
              {isAuthenticated === "valid" &&
                <>
                  <Link to="/dashboard"><CalendarMonthSharpIcon /></Link>
                  <Link to="/admin"><SettingsIcon /> </Link>                  
                </>}
              {isLoggedIn && <Link to="/logout"><LogoutSharpIcon /></Link>}
            </>}
        </div>
      </div>
      </>


  );
}