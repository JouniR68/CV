import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const { t } = useTranslation()

  const location = useLocation();
  const currentPath = location.pathname
  //<Link to='intrests'>{t('Intrest-header')}</Link>
  /*
        <Link to="output">{t('cv')}</Link>
        <Link to='looking'>{t('Open-header')}</Link>
  */
  return (
    <>
      {currentPath != '/profile/output' && currentPath != '/profile'  && 
      <nav className='host-nav'>
        <Link to="output">{t('cv')}</Link>
        <Link to='looking'>{t('Open-header')}</Link>
      </nav>}
      <Outlet />
    </>

  );
}
