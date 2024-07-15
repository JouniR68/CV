import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

export default function ProfileLayout() {
  const {t} = useTranslation()

  return (
    <>
      <nav className='host-nav'>
        <Link to='intrests'>{t('Intrest-header')}</Link>
        <Link to='why'>{t('Why-header')}</Link>
        <Link to='looking'>{t('Open-header')}</Link>
      </nav>
      <Outlet />
    </>
  );
}
