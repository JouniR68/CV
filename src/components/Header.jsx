import { Link } from "react-router-dom";
import Login from "./Login"
import { useTranslation } from 'react-i18next';

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
        <p>
        </p>
        <Link to="/checkLocation">{t('checkLocation')}</Link>
      </nav> : 
      <Login />}
    </header>
  );
}
