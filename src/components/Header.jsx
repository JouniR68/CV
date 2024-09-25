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

  return (

    <div className="header">
      <div className="header-left">
        <Link to="/"><HomeWorkIcon /></Link>
        <Link to="/profile"><PersonSharpIcon /></Link>
        <Link to="/checkLocation"><IconButton><LocationOnIcon style={{ transform: 'translateY(-5px)' }} /></IconButton></Link>
      </div>
      <div className="header-right">
        {!isLoggedIn && currentPath != '/userLogin' && <Link to="/userLogin">{t('Login')}</Link>}
        {!isLoggedIn && currentPath != '/register' && <Link to="/register">{t('Register')}</Link>}

        {isLoggedIn &&
          <>
            <Link to="/calendar"><CalendarMonthSharpIcon /></Link>
            <Link to="/admin"><SettingsIcon /> </Link>
            {isLoggedIn && <Link to="/logout"><LogoutSharpIcon /></Link>}
          </>}
      </div>
    </div>


  );
}