import i18n from 'i18next';

export const getTranslation = (key: string): string => {
  return i18n.t(key);
};

export const getBottomTabLabels = () => {
  return {
    home: getTranslation('common-terms.home'),
    slots: getTranslation('common-terms.slots'),
    deposit: getTranslation('common-terms.deposit'),
    earn: getTranslation('common-terms.earn'),
    wheel: getTranslation('common-terms.wheel'),
  };
};
