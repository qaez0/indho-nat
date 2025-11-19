import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Translates a message text to Urdu using a translation API
 * Falls back to original text if translation fails
 */
const translateText = async (text: string, targetLang: string = 'ur'): Promise<string> => {
  if (!text || targetLang === 'en') {
    return text;
  }

  try {
    // Using MyMemory Translation API (free, no API key required)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Translation API request failed: ${response.status}`);
    }
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Translation request timed out');
    } else {
      console.error('Translation failed, using original text:', error);
    }
    return text;
  }
};

/**
 * Cache for translations to avoid repeated API calls
 */
const translationCache = new Map<string, string>();

/**
 * Translates a message with caching
 */
export const translateMessageText = async (
  text: string,
  targetLang: string = 'ur',
): Promise<string> => {
  if (!text || targetLang === 'en') {
    return text;
  }

  const cacheKey = `${text}|${targetLang}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Translate and cache
  const translated = await translateText(text, targetLang);
  translationCache.set(cacheKey, translated);

  return translated;
};

/**
 * Hook to translate message title and content based on current language
 */
export const useTranslateMessage = () => {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'pk';

  const translateMessage = useMemo(() => {
    return async (message: { title: string; content: string }) => {
      if (!isUrdu) {
        return message;
      }

      const [translatedTitle, translatedContent] = await Promise.all([
        translateMessageText(message.title, 'ur'),
        translateMessageText(message.content, 'ur'),
      ]);

      return {
        ...message,
        title: translatedTitle,
        content: translatedContent,
      };
    };
  }, [isUrdu]);

  return { translateMessage, isUrdu };
};

