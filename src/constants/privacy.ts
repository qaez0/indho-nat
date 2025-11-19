export const getPrivacyData = (t: (key: string) => string) => [
  {
    title: t('information.privacy.privacy-policy.title'),
    details: t('information.privacy.privacy-policy.details'),
  },
  {
    title: t('information.privacy.disclaimer-of-warranty.title'),
    details: t('information.privacy.disclaimer-of-warranty.details'),
  },
];
