import React, { useContext } from "react"
import { Link } from "react-router-dom";
import Login from "./Login"
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AuthContext } from "./LoginContext";

export default function Header() {

  const { t } = useTranslation();
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  console.log(isLoggedIn)
  //
  return (
    <header className="app-header">
      <nav>
        <Link to="/home">{t('Home')}</Link>
        <Link to="/profile">{t('Profile')}</Link>
        <Link to="/rent">{t('Services')}</Link>
        <Link to="/checkLocation"><IconButton><LocationOnIcon /></IconButton></Link>
        <Link to="/login">Admin</Link>
        {isLoggedIn &&
          <>
            <Link to="/c">Viestit</Link>
            <Link to="/logout">Logout</Link>
          </>}


      </nav>

    </header>
  );
}
