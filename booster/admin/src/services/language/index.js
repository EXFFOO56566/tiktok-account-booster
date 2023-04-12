import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LocalStorageBackend from 'i18next-localstorage-backend';
import XHR from 'i18next-xhr-backend';
import * as reactI18nextModule from 'react-i18next';
import Backend from 'i18next-chained-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule.initReactI18next)
  .init({
    detection: {
      order: ['localStorage'],
      name: 'customDetector',
      lookup() {
        return 'en';
      },
      cacheUserLanguage(lng) {
        if (lng.substring(0, 2) === 'en') {
          localStorage.setItem('i18nextLng', 'vi');
        } else {
          localStorage.setItem('i18nextLng', 'en');
        }
      },
    },
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: false,
    },
    backend: {
      crossDomain: true,
      backends: [
        LocalStorageBackend,
        XHR,
      ],
      backendOptions: [{
        prefix: 'yeah1_res_',
        expirationTime: 7 * 24 * 60 * 60 * 1000,
        store: window.localStorage,
      }, {
        crossDomain: true,
        loadPath: `./translations/{{lng}}.json`,
      }],
    },
  });

export default i18n;
