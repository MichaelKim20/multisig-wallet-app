import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import commonEn from './src/locales/en/common.json';
import commonKo from './src/locales/ko/common.json';

export const resources = {
  en: {
    translation: commonEn,
  },
  ko: {
    translation: commonKo,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'ko',
  resources,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  supportedLngs: ['en', 'ko'],
  fallbackLng: 'en',
});

export {i18n};
