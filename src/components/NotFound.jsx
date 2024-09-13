// pages/NotFound.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function NotFound() {
    const {t} = useTranslation()
  return (
    <div>
      <h1>{t('PageNotFound')}</h1>
      <p>{t('PageNotFoundInfo')}</p>
    </div>
  );
}

export default NotFound;
