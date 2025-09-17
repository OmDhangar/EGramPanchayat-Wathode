import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationMR from './locales/mr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      mr: { translation: translationMR },
    },
    fallbackLng: 'en',
    debug: true, // Enable debug to help diagnose translation issues
    react: {
      useSuspense: false, // Prevents React from suspending while loading translations
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;