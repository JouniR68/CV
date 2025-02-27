// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './src/locales/en/translation.json';  // English translation file
import fiTranslations from './src/locales/fi/translation.json';  // Finnish translation file
i18n
  .use(HttpBackend) // Load translations using http
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    lng: 'fi', // Default language
    fallbackLng: 'fi', // Use Finnish as the fallback language
    debug: true,
    resources: {
      en: { translation: enTranslations }, // English translations
      fi: { translation: fiTranslations }, // Finnish translations
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
  });  

export default i18n;
