import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const { t } = useTranslation()
  //<Link to='intrests'>{t('Intrest-header')}</Link>
  return (
    <>
      <nav className='host-nav'>
        <Link to="output">{t('cv')}</Link>
        <Link to='looking'>{t('Open-header')}</Link>
      </nav>
      <Outlet />
    </>

  );
}
