import { Link } from "react-router-dom";
import Login from "./Login"
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Header() {
  let isUserLoggedIn = sessionStorage.getItem("loggedIn")
  isUserLoggedIn === "true" ? isUserLoggedIn = true : isUserLoggedIn = false
  
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <Link to="/">Softa-Apu</Link>
      {!isUserLoggedIn ? <nav> 
        <Link to="/home">{t('Home')}</Link>
        <Link to="/profile">{t('Profile')}</Link>                          
        <Link to="/rent">{t('Services')}</Link>
        <Link to="/checkLocation"><IconButton><LocationOnIcon /></IconButton></Link>
      </nav> : 
      <Login />}
    </header>
  );
}
