import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enTranslation from './locales/en-us.json';
import pkTranslation from './locales/pk-pk.json';

// Initialize i18n with 'pk' as default
// The language detector will still work, but 'pk' will be the fallback
i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'pk', // Default to Pakistan language
    lng: 'pk', // Set initial language to pk (will be overridden by detector if device language is detected)
    supportedLngs: ['en', 'pk'],
    resources: {
      en: {
        translation: enTranslation,
      },
      pk: {
        translation: pkTranslation,
      },
    },
  });

// Override language detector to default to 'pk' on first install
// Check if there's a stored language preference, if not, use 'pk'
AsyncStorage.getItem('11ic-native-language-storage').then(stored => {
  if (!stored) {
    // No stored preference, ensure it's set to 'pk'
    i18n.changeLanguage('pk');
  }
});
