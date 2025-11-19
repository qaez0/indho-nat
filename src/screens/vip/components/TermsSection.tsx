import React from 'react';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { vipStyles } from './vip.styles';

const TermsSection: React.FC = () => {
  const { t } = useTranslation();

  const termsSections = [
    {
      title: t('vip.terms.eligibility.title'),
      description: t('vip.terms.eligibility.description')
    },
    {
      title: t('vip.terms.weekly-lossback-bonus-games.title'),
      description: t('vip.terms.weekly-lossback-bonus-games.description'),
      providers: [
        t('vip.terms.weekly-lossback-bonus-games.providers.sports'),
        t('vip.terms.weekly-lossback-bonus-games.providers.live-casino'),
        t('vip.terms.weekly-lossback-bonus-games.providers.slots')
      ]
    },
    {
      title: t('vip.terms.events-access.title'),
      description: t('vip.terms.events-access.description')
    },
    {
      title: t('vip.terms.modification-rights.title'),
      description: t('vip.terms.modification-rights.description')
    },
    {
      title: t('vip.terms.general-terms.title'),
      description: t('vip.terms.general-terms.description')
    }
  ];

  return (
    <View style={vipStyles.termsSection}>
      <Text style={vipStyles.sectionTitle}>
        {t('common-terms.terms-and-conditions')}
      </Text>
      
      <View style={vipStyles.termsContent}>
        {termsSections.map((section, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text style={[vipStyles.termsText, { fontWeight: 'bold', marginBottom: 4 }]}>
              {index + 1}. {section.title}
            </Text>
            <Text style={vipStyles.termsText}>
              {section.description}
            </Text>
            {section.providers && (
              <View style={{ marginTop: 8, marginLeft: 8 }}>
                {section.providers.map((provider, providerIndex) => (
                  <Text key={providerIndex} style={[vipStyles.termsText, { marginBottom: 2 }]}>
                    • {provider}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={[vipStyles.termsText, { marginTop: 8 }]}>
          6. {t('vip.terms.for-more-inq')}
        </Text>
      </View>
    </View>
  );
};

export default TermsSection;
