import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translateMessageText } from '../utils/translateMessage';
import type { IMessageRecordItem } from '../types/message';

/**
 * Hook to translate an array of messages to Urdu when language is set to Urdu
 */
export const useTranslateMessages = (messages: IMessageRecordItem[] | undefined) => {
  const { i18n } = useTranslation();
  const [translatedMessages, setTranslatedMessages] = useState<IMessageRecordItem[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const isUrdu = i18n.language === 'pk';
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Abort any ongoing translations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!messages || messages.length === 0) {
      setTranslatedMessages([]);
      return;
    }

    if (!isUrdu) {
      setTranslatedMessages(messages);
      return;
    }

    // Show original messages immediately
    setTranslatedMessages(messages);

    // Translate messages asynchronously without blocking
    const translateAll = async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsTranslating(true);
      try {
        // Translate messages one by one with a small delay to avoid overwhelming the API
        const translated: IMessageRecordItem[] = [];
        
        for (let i = 0; i < messages.length; i++) {
          if (controller.signal.aborted) {
            return;
          }

          const message = messages[i];
          try {
            const [translatedTitle, translatedContent] = await Promise.all([
              translateMessageText(message.title, 'ur'),
              translateMessageText(message.content, 'ur'),
            ]);

            translated[i] = {
              ...message,
              title: translatedTitle,
              content: translatedContent,
            };

            // Update state incrementally so UI doesn't freeze
            setTranslatedMessages([...translated, ...messages.slice(i + 1)]);
          } catch (error) {
            // If translation fails, use original
            translated[i] = message;
          }

          // Small delay between translations to avoid rate limiting
          if (i < messages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (!controller.signal.aborted) {
          setTranslatedMessages(translated);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error translating messages:', error);
          setTranslatedMessages(messages);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
        }
      }
    };

    // Use setTimeout to ensure this runs after render
    const timeoutId = setTimeout(() => {
      translateAll();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [messages, isUrdu]);

  // Return translated messages if available, otherwise return original messages
  return {
    translatedMessages:
      translatedMessages.length > 0 ? translatedMessages : messages || [],
    isTranslating,
  };
};

/**
 * Hook to translate a single message to Urdu when language is set to Urdu
 */
export const useTranslateMessage = (message: IMessageRecordItem | null | undefined) => {
  const { i18n } = useTranslation();
  const [translatedMessage, setTranslatedMessage] = useState<IMessageRecordItem | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const isUrdu = i18n.language === 'pk';
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Abort any ongoing translation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!message) {
      setTranslatedMessage(null);
      return;
    }

    // Show original message immediately
    setTranslatedMessage(message);

    if (!isUrdu) {
      return;
    }

    // Translate message asynchronously without blocking
    const translate = async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsTranslating(true);
      try {
        const [translatedTitle, translatedContent] = await Promise.all([
          translateMessageText(message.title, 'ur'),
          translateMessageText(message.content, 'ur'),
        ]);

        if (!controller.signal.aborted) {
          setTranslatedMessage({
            ...message,
            title: translatedTitle,
            content: translatedContent,
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error translating message:', error);
          setTranslatedMessage(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
        }
      }
    };

    // Use setTimeout to ensure this runs after render
    const timeoutId = setTimeout(() => {
      translate();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [message, isUrdu]);

  return { translatedMessage, isTranslating };
};

